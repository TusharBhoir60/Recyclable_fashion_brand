# feature_3_sentiment/train.py

import torch
import torch.nn as nn
from torch.optim import AdamW
from transformers import get_linear_schedule_with_warmup
import yaml, time
from pathlib import Path

from dataset import build_dataloaders
from model   import SentimentClassifier, count_parameters

def load_config():
    config_path = Path(__file__).resolve().parent / 'configs' / 'sentiment_config.yaml'
    with config_path.open('r', encoding='utf-8') as f:
        return yaml.safe_load(f)

cfg = load_config()


def train_one_epoch(model, loader, optimizer, scheduler, criterion, device):
    model.train()
    total_loss, correct, total = 0.0, 0, 0

    for batch in loader:
        input_ids      = batch['input_ids'].to(device)
        attention_mask = batch['attention_mask'].to(device)
        labels         = batch['label'].to(device)

        optimizer.zero_grad()
        logits = model(input_ids, attention_mask)          # [B, 3]
        loss   = criterion(logits, labels)

        loss.backward()

        # Gradient clipping — essential for BERT: prevents exploding gradients
        # when the pre-trained weights get large gradient signals early in training
        torch.nn.utils.clip_grad_norm_(
            model.parameters(),
            max_norm=cfg['training']['max_grad_norm']
        )

        optimizer.step()
        scheduler.step()   # step every batch, not every epoch (warmup schedule)

        total_loss += loss.item() * labels.size(0)
        preds       = logits.argmax(dim=1)
        correct    += (preds == labels).sum().item()
        total      += labels.size(0)

    return total_loss / total, correct / total


@torch.no_grad()
def validate(model, loader, criterion, device):
    model.eval()
    total_loss, correct, total = 0.0, 0, 0
    all_preds, all_labels = [], []

    for batch in loader:
        input_ids      = batch['input_ids'].to(device)
        attention_mask = batch['attention_mask'].to(device)
        labels         = batch['label'].to(device)

        logits     = model(input_ids, attention_mask)
        loss       = criterion(logits, labels)
        preds      = logits.argmax(dim=1)

        total_loss += loss.item() * labels.size(0)
        correct    += (preds == labels).sum().item()
        total      += labels.size(0)
        all_preds.extend(preds.cpu().tolist())
        all_labels.extend(labels.cpu().tolist())

    return total_loss / total, correct / total, all_preds, all_labels


def main():
    cfg_t  = cfg['training']
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    print(f"Training on: {device}")

    train_loader, val_loader, class_weights = build_dataloaders()
    model = SentimentClassifier().to(device)
    count_parameters(model)

    # Weighted CrossEntropyLoss — handles class imbalance at the loss level
    criterion = nn.CrossEntropyLoss(
        weight=class_weights.to(device),
        label_smoothing=0.1,
    )

    # AdamW: Adam + proper weight decay (doesn't decay bias/LayerNorm params)
    # Different param groups: don't apply weight decay to bias and LayerNorm weights
    no_decay  = ['bias', 'LayerNorm.weight']
    optimizer = AdamW([
        {'params': [p for n, p in model.named_parameters() if not any(nd in n for nd in no_decay)],
         'weight_decay': cfg_t['weight_decay']},
        {'params': [p for n, p in model.named_parameters() if any(nd in n for nd in no_decay)],
         'weight_decay': 0.0},
    ], lr=cfg_t['lr'])

    # Linear warmup then linear decay — the standard BERT schedule
    total_steps  = len(train_loader) * cfg_t['epochs']
    warmup_steps = int(total_steps * cfg_t['warmup_ratio'])
    scheduler    = get_linear_schedule_with_warmup(
        optimizer,
        num_warmup_steps=warmup_steps,
        num_training_steps=total_steps,
    )
    print(f"Total steps: {total_steps} | Warmup steps: {warmup_steps}")

    ckpt_dir = Path(__file__).resolve().parent / cfg_t['checkpoint_dir']
    ckpt_dir.mkdir(parents=True, exist_ok=True)
    best_val_acc     = 0.0
    patience_counter = 0

    for epoch in range(1, cfg_t['epochs'] + 1):
        t0 = time.time()
        train_loss, train_acc = train_one_epoch(
            model, train_loader, optimizer, scheduler, criterion, device
        )
        val_loss, val_acc, preds, labels = validate(
            model, val_loader, criterion, device
        )
        elapsed = time.time() - t0

        print(
            f"Epoch {epoch}/{cfg_t['epochs']} | "
            f"Train loss: {train_loss:.4f} acc: {train_acc:.3f} | "
            f"Val loss: {val_loss:.4f} acc: {val_acc:.3f} | "
            f"LR: {scheduler.get_last_lr()[0]:.2e} | {elapsed:.1f}s"
        )

        if val_acc > best_val_acc:
            best_val_acc = val_acc
            torch.save(model.state_dict(),
                       str(ckpt_dir / 'sentiment_v1.pt'))
            print(f"  Saved best (val_acc={val_acc:.4f})")
            patience_counter = 0
        else:
            patience_counter += 1

        torch.save({
            'epoch': epoch,
            'model_state': model.state_dict(),
            'optimizer_state': optimizer.state_dict(),
            'best_val_acc': best_val_acc,
        }, str(ckpt_dir / 'sentiment_latest.pt'))

        if patience_counter >= cfg_t['early_stopping_patience']:
            print(f"Early stopping at epoch {epoch}")
            break

    print(f"\nDone. Best val accuracy: {best_val_acc:.4f}")


if __name__ == '__main__':
    main()