# classifiers/textile/train.py

import torch
import torch.nn as nn
from torch.optim import Adam
from torch.optim.lr_scheduler import CosineAnnealingLR
import yaml, os, time
from pathlib import Path

from dataset import build_dataloaders
from model import build_model, unfreeze_backbone, count_parameters

def load_config():
    with open('configs/textile_config.yaml') as f:
        return yaml.safe_load(f)

def train_one_epoch(model, loader, optimizer, criterion, device, scaler):
    model.train()
    total_loss, correct, total = 0.0, 0, 0

    for imgs, labels, _ in loader:
        imgs, labels = imgs.to(device), labels.to(device)
        optimizer.zero_grad()

        # Mixed precision training — faster on GPU, same accuracy
        with torch.autocast(device_type=device.type, dtype=torch.float16):
            logits = model(imgs)
            loss   = criterion(logits, labels)

        scaler.scale(loss).backward()
        scaler.step(optimizer)
        scaler.update()

        total_loss += loss.item() * imgs.size(0)
        preds       = logits.argmax(dim=1)
        correct    += (preds == labels).sum().item()
        total      += imgs.size(0)

    return total_loss / total, correct / total


@torch.no_grad()
def validate(model, loader, criterion, device):
    model.eval()
    total_loss, correct, total = 0.0, 0, 0
    all_preds, all_labels = [], []

    for imgs, labels, _ in loader:
        imgs, labels = imgs.to(device), labels.to(device)
        logits = model(imgs)
        loss   = criterion(logits, labels)

        total_loss += loss.item() * imgs.size(0)
        preds       = logits.argmax(dim=1)
        correct    += (preds == labels).sum().item()
        total      += imgs.size(0)
        all_preds.extend(preds.cpu().tolist())
        all_labels.extend(labels.cpu().tolist())

    return total_loss / total, correct / total, all_preds, all_labels


def main():
    cfg    = load_config()
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    print(f"Training on: {device}")

    train_loader, val_loader = build_dataloaders('data/processed')
    model = build_model(
        num_classes=len(cfg['classes']['material']),
        freeze_backbone=cfg['model']['freeze_backbone']
    ).to(device)
    count_parameters(model)

    # CrossEntropyLoss = log-softmax + NLL loss in one operation
    # label_smoothing: prevents overconfidence — nudges the model to be 90% sure instead of 99.9%
    criterion = nn.CrossEntropyLoss(label_smoothing=0.1)

    # Phase 1 optimizer: only head parameters have requires_grad=True
    optimizer = Adam(
        filter(lambda p: p.requires_grad, model.parameters()),
        lr=cfg['training']['lr'],
        weight_decay=cfg['training']['weight_decay']
    )
    scheduler = CosineAnnealingLR(optimizer, T_max=cfg['training']['epochs'])
    scaler    = torch.cuda.amp.GradScaler()     # for mixed precision

    best_val_acc = 0.0
    patience_counter = 0
    unfreeze_epoch = 10   # switch to phase 2 at epoch 10

    Path(cfg['training']['checkpoint_dir']).mkdir(exist_ok=True)

    for epoch in range(1, cfg['training']['epochs'] + 1):
        # Phase 2: unfreeze backbone at epoch 10
        if epoch == unfreeze_epoch:
            model = unfreeze_backbone(model, cfg['training']['backbone_lr'])
            # Rebuild optimizer to include newly unfrozen params
            optimizer = Adam([
                {'params': model.fc.parameters(),  'lr': cfg['training']['lr']},
                {'params': [p for n, p in model.named_parameters()
                            if 'fc' not in n and p.requires_grad],
                 'lr': cfg['training']['backbone_lr']},
            ], weight_decay=cfg['training']['weight_decay'])
            scheduler = CosineAnnealingLR(optimizer, T_max=cfg['training']['epochs'] - unfreeze_epoch)

        t0 = time.time()
        train_loss, train_acc = train_one_epoch(model, train_loader, optimizer, criterion, device, scaler)
        val_loss, val_acc, preds, labels_list = validate(model, val_loader, criterion, device)
        scheduler.step()
        elapsed = time.time() - t0

        print(
            f"Epoch {epoch:02d}/{cfg['training']['epochs']} | "
            f"Train loss: {train_loss:.4f} acc: {train_acc:.3f} | "
            f"Val loss: {val_loss:.4f} acc: {val_acc:.3f} | "
            f"{elapsed:.1f}s"
        )

        # Save best checkpoint
        if val_acc > best_val_acc:
            best_val_acc = val_acc
            torch.save(model.state_dict(), f"{cfg['training']['checkpoint_dir']}/textile_v1.pt")
            print(f"  Saved best model (val_acc={val_acc:.4f})")
            patience_counter = 0
        else:
            patience_counter += 1

        # Save latest checkpoint every epoch (useful for resuming)
        torch.save({
            'epoch': epoch,
            'model_state': model.state_dict(),
            'optimizer_state': optimizer.state_dict(),
            'best_val_acc': best_val_acc,
        }, f"{cfg['training']['checkpoint_dir']}/textile_latest.pt")

        # Early stopping
        if patience_counter >= cfg['training']['early_stopping_patience']:
            print(f"Early stopping triggered at epoch {epoch}")
            break

    print(f"\nTraining complete. Best val accuracy: {best_val_acc:.4f}")


if __name__ == '__main__':
    main()