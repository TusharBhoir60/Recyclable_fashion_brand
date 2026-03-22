# classifiers/textile/model.py

import torch
import torch.nn as nn
from torchvision import models

def build_model(num_classes: int = 5, freeze_backbone: bool = True) -> nn.Module:
    """
    Strategy:
      Phase 1 (first 10 epochs): freeze backbone, train only the head.
        - Fast convergence, low risk of overwriting useful ImageNet features.
      Phase 2 (remaining epochs): unfreeze backbone with a very small LR.
        - Allows the backbone to fine-tune to fabric-specific textures.
    """
    model = models.resnet50(weights=models.ResNet50_Weights.IMAGENET1K_V2)

    if freeze_backbone:
        for param in model.parameters():
            param.requires_grad = False
        print("Backbone frozen — training head only")
    else:
        print("Backbone unfrozen — full fine-tuning")

    # model.fc is the original 1000-class ImageNet head.
    # in_features = 2048 (size of ResNet-50's feature vector)
    in_features = model.fc.in_features  # 2048

    model.fc = nn.Sequential(
        nn.Dropout(p=0.4),               # regularisation — prevents head from memorising
        nn.Linear(in_features, 256),
        nn.ReLU(inplace=True),
        nn.Linear(256, num_classes),     # raw logits, NOT softmax — CrossEntropyLoss handles that
    )

    return model


def unfreeze_backbone(model: nn.Module, backbone_lr: float = 0.0001):
    """
    Gradual unfreezing: unfreeze the last 2 residual layers only.
    This is safer than unfreezing everything at once.
    Layers to unfreeze: layer3, layer4, fc.
    Layers to keep frozen: conv1, bn1, layer1, layer2.
    """
    frozen_layers = ['conv1', 'bn1', 'layer1', 'layer2']

    for name, param in model.named_parameters():
        layer_name = name.split('.')[0]
        if layer_name not in frozen_layers:
            param.requires_grad = True

    print(f"Unfrozen: layer3, layer4, fc — backbone LR: {backbone_lr}")
    return model


def count_parameters(model: nn.Module):
    total      = sum(p.numel() for p in model.parameters())
    trainable  = sum(p.numel() for p in model.parameters() if p.requires_grad)
    frozen     = total - trainable
    print(f"Total params:     {total:,}")
    print(f"Trainable params: {trainable:,}")
    print(f"Frozen params:    {frozen:,}")