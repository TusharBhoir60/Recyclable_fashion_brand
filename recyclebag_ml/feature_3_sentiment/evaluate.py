# feature_3_sentiment/evaluate.py

import torch
import numpy as np
from sklearn.metrics import (
    classification_report, confusion_matrix, f1_score
)
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns
from pathlib import Path

from dataset import build_dataloaders
from model   import SentimentClassifier

LABELS = ['negative', 'neutral', 'positive']


def load_model(weights_path: str, device):
    model = SentimentClassifier()
    model.load_state_dict(torch.load(weights_path, map_location=device))
    return model.to(device).eval()


@torch.no_grad()
def run_evaluation(model, loader, device):
    all_preds, all_labels, all_probs = [], [], []

    for batch in loader:
        ids    = batch['input_ids'].to(device)
        mask   = batch['attention_mask'].to(device)
        labels = batch['label']

        logits = model(ids, mask)
        probs  = torch.softmax(logits, dim=1).cpu()
        preds  = probs.argmax(dim=1)

        all_preds.extend(preds.tolist())
        all_labels.extend(labels.tolist())
        all_probs.extend(probs.tolist())

    return all_preds, all_labels, all_probs


def full_report(weights_path: str | None = None):
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    base_dir = Path(__file__).resolve().parent
    weights = weights_path or str(base_dir / 'weights' / 'sentiment_v1.pt')
    _, val_loader, _ = build_dataloaders()
    model = load_model(weights, device)

    preds, labels, probs = run_evaluation(model, val_loader, device)

    print("=== Classification Report ===")
    print(classification_report(labels, preds, target_names=LABELS, digits=4))

    macro_f1 = f1_score(labels, preds, average='macro')
    print(f"Macro F1: {macro_f1:.4f}")

    # Confusion matrix
    cm = confusion_matrix(labels, preds)
    cm_norm = cm.astype(float) / cm.sum(axis=1, keepdims=True)

    fig, axes = plt.subplots(1, 2, figsize=(12, 4))
    for ax, data, title, fmt in zip(
        axes, [cm, cm_norm], ['Counts', 'Row-normalised'], ['d', '.2f']
    ):
        sns.heatmap(data, annot=True, fmt=fmt, cmap='Blues',
                    xticklabels=LABELS, yticklabels=LABELS, ax=ax)
        ax.set_title(title)
        ax.set_ylabel('True')
        ax.set_xlabel('Predicted')
    plt.tight_layout()
    output_path = base_dir / 'notebooks' / 'confusion_matrix.png'
    output_path.parent.mkdir(parents=True, exist_ok=True)
    plt.savefig(output_path, dpi=150)
    print("Confusion matrix saved.")

    # Hard examples — reviews the model got wrong with high confidence
    print("\n=== High-confidence mistakes ===")
    mistakes = []
    import pandas as pd
    val_df = pd.read_csv(base_dir / 'data' / 'processed' / 'val.csv')

    for i, (pred, true, prob) in enumerate(zip(preds, labels, probs)):
        if pred != true and max(prob) > 0.80:
            mistakes.append({
                'text':       val_df.iloc[i]['text'][:80],
                'true':       LABELS[true],
                'predicted':  LABELS[pred],
                'confidence': round(max(prob), 3),
            })

    mistakes.sort(key=lambda x: x['confidence'], reverse=True)
    for m in mistakes[:10]:
        print(f"  [{m['true']} → {m['predicted']}] ({m['confidence']}) {m['text']}")


if __name__ == '__main__':
    full_report()