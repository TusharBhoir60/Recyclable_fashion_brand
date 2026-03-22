import torch
import torch.nn as nn
from transformers import AutoModel
import yaml
from pathlib import Path


def load_config():
    config_path = Path(__file__).resolve().parent / 'configs' / 'sentiment_config.yaml'
    with config_path.open('r', encoding='utf-8') as f:
        return yaml.safe_load(f)


cfg = load_config()


class SentimentClassifier(nn.Module):
    def __init__(self):
        super().__init__()
        self.encoder = AutoModel.from_pretrained(cfg['model']['base_checkpoint'])
        hidden_size = self.encoder.config.hidden_size
        self.dropout = nn.Dropout(cfg['model']['dropout'])
        self.classifier = nn.Linear(hidden_size, cfg['model']['num_labels'])

    def forward(self, input_ids, attention_mask):
        outputs = self.encoder(input_ids=input_ids, attention_mask=attention_mask)
        cls_embedding = outputs.last_hidden_state[:, 0]
        logits = self.classifier(self.dropout(cls_embedding))
        return logits


def count_parameters(model: nn.Module):
    total = sum(p.numel() for p in model.parameters())
    trainable = sum(p.numel() for p in model.parameters() if p.requires_grad)
    frozen = total - trainable
    print(f"Total params:     {total:,}")
    print(f"Trainable params: {trainable:,}")
    print(f"Frozen params:    {frozen:,}")
