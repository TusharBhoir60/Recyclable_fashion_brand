# classifiers/textile/evaluate.py

import torch
import numpy as np
from sklearn.metrics import (
    classification_report, confusion_matrix,
    f1_score, precision_recall_fscore_support
)
import matplotlib.pyplot as plt
import seaborn as sns
from pathlib import Path
from dataset import TextileDataset, build_dataloaders
from model import build_model

CLASSES = ['cotton', 'denim', 'polyester', 'silk_blend', 'synthetic']

def load_model(weights_path: str, device):
    model = build_model(num_classes=len(CLASSES), freeze_backbone=False)
    model.load_state_dict(torch.load(weights_path, map_location=device))
    model.to(device).eval()
    return model

@torch.no_grad()
def run_evaluation(model, loader, device):
    all_preds, all_labels, all_probs, all_paths = [], [], [], []

    for imgs, labels, paths in loader:
        imgs = imgs.to(device)
        logits = model(imgs)
        probs  = torch.softmax(logits, dim=1).cpu()
        preds  = probs.argmax(dim=1)

        all_preds.extend(preds.tolist())
        all_labels.extend(labels.tolist())
        all_probs.extend(probs.tolist())
        all_paths.extend(paths)

    return all_preds, all_labels, all_probs, all_paths


def print_classification_report(preds, labels):
    print("\n=== Classification Report ===")
    print(classification_report(labels, preds, target_names=CLASSES, digits=4))

    # Per-class breakdown
    p, r, f1, support = precision_recall_fscore_support(labels, preds, average=None)
    print(f"\n{'Class':<14} {'Precision':>10} {'Recall':>8} {'F1':>8} {'Support':>10}")
    for i, cls in enumerate(CLASSES):
        print(f"{cls:<14} {p[i]:>10.4f} {r[i]:>8.4f} {f1[i]:>8.4f} {support[i]:>10}")


def plot_confusion_matrix(preds, labels, save_path='notebooks/confusion_matrix.png'):
    cm = confusion_matrix(labels, preds)
    cm_norm = cm.astype(float) / cm.sum(axis=1, keepdims=True)  # row-normalised

    fig, axes = plt.subplots(1, 2, figsize=(14, 5))

    for ax, data, title, fmt in zip(
        axes,
        [cm, cm_norm],
        ['Counts', 'Row-normalised'],
        ['d', '.2f']
    ):
        sns.heatmap(data, annot=True, fmt=fmt, cmap='Blues',
                    xticklabels=CLASSES, yticklabels=CLASSES, ax=ax)
        ax.set_title(title)
        ax.set_ylabel('True label')
        ax.set_xlabel('Predicted label')

    plt.tight_layout()
    plt.savefig(save_path, dpi=150)
    print(f"Confusion matrix saved to {save_path}")


def find_hard_examples(preds, labels, probs, paths, n=20):
    """
    Hard examples = where the model was most wrong (high confidence, wrong class).
    These are the most valuable samples to add to your training set.
    """
    hard = []
    for pred, label, prob_vec, path in zip(preds, labels, probs, paths):
        if pred != label:
            confidence = max(prob_vec)
            hard.append({
                'path':       path,
                'true':       CLASSES[label],
                'predicted':  CLASSES[pred],
                'confidence': confidence,
            })

    hard.sort(key=lambda x: x['confidence'], reverse=True)  # most confident mistakes first
    print(f"\n=== Top {n} Hard Examples (confident but wrong) ===")
    for h in hard[:n]:
        print(f"  {h['path']}")
        print(f"    True: {h['true']} | Predicted: {h['predicted']} | Confidence: {h['confidence']:.3f}")

    return hard


if __name__ == '__main__':
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    _, val_loader = build_dataloaders('data/processed')
    model = load_model('weights/textile_v1.pt', device)

    preds, labels, probs, paths = run_evaluation(model, val_loader, device)

    print_classification_report(preds, labels)
    plot_confusion_matrix(preds, labels)
    hard = find_hard_examples(preds, labels, probs, paths)