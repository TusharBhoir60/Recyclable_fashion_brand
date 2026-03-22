# feature_3_sentiment/predict.py

import torch
from transformers import AutoTokenizer
import yaml
from pathlib import Path
from model import SentimentClassifier

def load_config():
    config_path = Path(__file__).resolve().parent / 'configs' / 'sentiment_config.yaml'
    with config_path.open('r', encoding='utf-8') as f:
        return yaml.safe_load(f)

cfg    = load_config()
LABELS = cfg['classes']['overall']   # ['negative', 'neutral', 'positive']


class SentimentPredictor:
    """
    Singleton — model and tokenizer loaded once, reused for all requests.
    """
    _instance = None

    def __new__(cls, weights_path: str | None = None):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            default_weights = Path(__file__).resolve().parent / 'weights' / 'sentiment_v1.pt'
            cls._instance._load(weights_path or str(default_weights))
        return cls._instance

    def _load(self, weights_path):
        self.device    = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.tokenizer = AutoTokenizer.from_pretrained(cfg['model']['base_checkpoint'])
        self.model     = SentimentClassifier()
        self.model.load_state_dict(torch.load(weights_path, map_location=self.device))
        self.model.to(self.device).eval()
        print(f"SentimentPredictor ready on {self.device}")

    @torch.no_grad()
    def predict(self, text: str) -> dict:
        enc = self.tokenizer(
            text,
            max_length=cfg['model']['max_length'],
            padding='max_length',
            truncation=True,
            return_tensors='pt',
        )

        logits = self.model(
            enc['input_ids'].to(self.device),
            enc['attention_mask'].to(self.device),
        )
        probs = torch.softmax(logits, dim=1)[0].cpu()

        pred_idx    = probs.argmax().item()
        label       = LABELS[pred_idx]
        confidence  = probs[pred_idx].item()

        # Reliability signal
        inf_cfg = cfg['inference']
        reliable = confidence >= inf_cfg['high_confidence']
        uncertain = confidence < inf_cfg['low_confidence']

        return {
            'label':      label,
            'confidence': round(confidence, 4),
            'reliable':   reliable,
            'uncertain':  uncertain,
            'scores': {
                'negative': round(probs[0].item(), 4),
                'neutral':  round(probs[1].item(), 4),
                'positive': round(probs[2].item(), 4),
            },
        }

    @torch.no_grad()
    def predict_batch(self, texts: list[str]) -> list[dict]:
        """Batch prediction for bulk processing existing reviews."""
        enc = self.tokenizer(
            texts,
            max_length=cfg['model']['max_length'],
            padding=True,
            truncation=True,
            return_tensors='pt',
        )

        logits = self.model(
            enc['input_ids'].to(self.device),
            enc['attention_mask'].to(self.device),
        )
        probs_all = torch.softmax(logits, dim=1).cpu()

        results = []
        for probs in probs_all:
            idx = probs.argmax().item()
            results.append({
                'label':      LABELS[idx],
                'confidence': round(probs[idx].item(), 4),
                'scores': {
                    'negative': round(probs[0].item(), 4),
                    'neutral':  round(probs[1].item(), 4),
                    'positive': round(probs[2].item(), 4),
                },
            })
        return results