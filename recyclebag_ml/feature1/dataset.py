# classifiers/textile/dataset.py

import os
import torch
from torch.utils.data import Dataset, DataLoader, WeightedRandomSampler
from torchvision import transforms
from PIL import Image
import yaml, numpy as np
from pathlib import Path

def load_config():
    with open('configs/textile_config.yaml') as f:
        return yaml.safe_load(f)

cfg = load_config()
CLASSES = cfg['classes']['material']

class TextileDataset(Dataset):
    """
    Expects folder structure:
      data/processed/train/
        cotton/   img1.jpg  img2.jpg ...
        denim/    ...
        polyester/...
    """
    def __init__(self, root_dir: str, split: str = 'train'):
        self.root   = Path(root_dir) / split
        self.transform = self._build_transforms(split)
        self.samples   = []  # list of (path, label_idx)
        self.class_counts = [0] * len(CLASSES)

        for label_idx, class_name in enumerate(CLASSES):
            class_dir = self.root / class_name
            if not class_dir.exists():
                continue
            for img_path in class_dir.glob('*.jpg'):
                self.samples.append((str(img_path), label_idx))
                self.class_counts[label_idx] += 1

        print(f"[{split}] Loaded {len(self.samples)} images across {len(CLASSES)} classes")
        for name, count in zip(CLASSES, self.class_counts):
            print(f"  {name}: {count}")

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        path, label = self.samples[idx]
        img = Image.open(path).convert('RGB')
        return self.transform(img), label, path  # path useful for error analysis

    def _build_transforms(self, split: str):
        aug = cfg['augmentation']
        mean, std = cfg['data']['mean'], cfg['data']['std']
        size = cfg['data']['image_size']

        if split == 'train':
            t = [
                transforms.RandomResizedCrop(size, scale=(0.7, 1.0)),
                transforms.RandomHorizontalFlip(),
                transforms.ColorJitter(
                    brightness=aug['color_jitter']['brightness'],
                    contrast=aug['color_jitter']['contrast'],
                    saturation=aug['color_jitter']['saturation'],
                    hue=aug['color_jitter']['hue'],
                ),
                transforms.RandomRotation(aug['random_rotation']),
                transforms.ToTensor(),
                transforms.Normalize(mean, std),
            ]
            if aug['random_erasing']:
                # RandomErasing simulates partially occluded or stained fabric
                t.append(transforms.RandomErasing(p=0.2, scale=(0.02, 0.08)))
            return transforms.Compose(t)
        else:
            # Val/test — no random transforms, just resize + normalise
            return transforms.Compose([
                transforms.Resize(256),
                transforms.CenterCrop(size),
                transforms.ToTensor(),
                transforms.Normalize(mean, std),
            ])

    def get_weighted_sampler(self) -> WeightedRandomSampler:
        """
        Class imbalance solution: weight each sample inversely to its class frequency.
        If cotton has 500 images and silk_blend has 50, silk_blend samples get 10× weight.
        This gives the model equal exposure to each class per epoch.
        """
        total = len(self.samples)
        class_weights = [total / (len(CLASSES) * count) if count > 0 else 0
                         for count in self.class_counts]
        sample_weights = [class_weights[label] for _, label in self.samples]
        return WeightedRandomSampler(
            weights=sample_weights,
            num_samples=total,
            replacement=True
        )


def build_dataloaders(data_root: str):
    train_ds = TextileDataset(data_root, 'train')
    val_ds   = TextileDataset(data_root, 'val')

    train_loader = DataLoader(
        train_ds,
        batch_size=cfg['data']['batch_size'],
        sampler=train_ds.get_weighted_sampler(),  # handles class imbalance
        num_workers=cfg['data']['num_workers'],
        pin_memory=True,                           # faster GPU transfer
    )
    val_loader = DataLoader(
        val_ds,
        batch_size=cfg['data']['batch_size'],
        shuffle=False,
        num_workers=cfg['data']['num_workers'],
        pin_memory=True,
    )
    return train_loader, val_loader