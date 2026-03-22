# feature_3_sentiment/dataset.py

import torch
from torch.utils.data import Dataset, DataLoader
from transformers import AutoTokenizer
import pandas as pd
import yaml
from pathlib import Path

def load_config():
    config_path = Path(__file__).resolve().parent / 'configs' / 'sentiment_config.yaml'
    with config_path.open('r', encoding='utf-8') as f:
        return yaml.safe_load(f)

cfg = load_config()
BASE_DIR = Path(__file__).resolve().parent

class ReviewDataset(Dataset):
    """
    Converts raw review text into BERT input tensors.

    What tokenisation actually does:
      "The bag is great!" →
        input_ids:      [101, 1996, 4524, 2003, 2307, 999, 102, 0, 0, ...]
        attention_mask: [  1,    1,    1,    1,    1,   1,   1, 0, 0, ...]

      input_ids:      token IDs from BERT vocabulary (30,522 tokens)
      attention_mask: 1 = real token, 0 = padding — tells BERT what to ignore
      [101] = [CLS], [102] = [SEP], 0s = padding to max_length
    """

    def __init__(self, csv_path: str):
        self.df        = pd.read_csv(csv_path)
        self.tokenizer = AutoTokenizer.from_pretrained(cfg['model']['base_checkpoint'])
        self.max_len   = cfg['model']['max_length']

        # Validate labels
        assert set(self.df['label'].unique()).issubset({0, 1, 2}), \
            "Labels must be 0 (negative), 1 (neutral), 2 (positive)"

        print(f"Dataset: {len(self.df)} samples")
        print(self.df['label'].value_counts().rename({0:'negative',1:'neutral',2:'positive'}))

    def __len__(self):
        return len(self.df)

    def __getitem__(self, idx):
        row  = self.df.iloc[idx]
        text = str(row['text'])

        # tokenizer handles: lowercasing, subword splitting (BPE),
        # [CLS]/[SEP] insertion, padding, truncation — all automatically
        enc = self.tokenizer(
            text,
            max_length=self.max_len,
            padding='max_length',      # pad shorter sequences to max_length
            truncation=True,           # cut sequences longer than max_length
            return_tensors='pt',       # return PyTorch tensors
        )

        return {
            'input_ids':      enc['input_ids'].squeeze(0),       # [128]
            'attention_mask': enc['attention_mask'].squeeze(0),  # [128]
            'label':          torch.tensor(row['label'], dtype=torch.long),
        }


def build_dataloaders():
    train_ds = ReviewDataset(str(BASE_DIR / cfg['data']['train_csv']))
    val_ds   = ReviewDataset(str(BASE_DIR / cfg['data']['val_csv']))

    # Compute class weights to handle imbalance
    # If negative has 200 samples and positive has 600:
    # weight_negative = total / (3 * 200) = 3× higher weight
    counts = train_ds.df['label'].value_counts().sort_index().values
    total  = counts.sum()
    weights = torch.tensor(
        [total / (len(counts) * c) for c in counts],
        dtype=torch.float
    )

    train_loader = DataLoader(
        train_ds,
        batch_size=cfg['training']['batch_size'],
        shuffle=True,
        num_workers=2,
        pin_memory=True,
    )
    val_loader = DataLoader(
        val_ds,
        batch_size=cfg['training']['batch_size'],
        shuffle=False,
        num_workers=2,
        pin_memory=True,
    )
    return train_loader, val_loader, weights