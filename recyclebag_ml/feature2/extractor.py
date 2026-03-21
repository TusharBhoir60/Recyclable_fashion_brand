# search/visual/extractor.py

import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
import io, numpy as np

class ResNetExtractor:
    """
    Strips the ResNet-50 classification head and uses the backbone
    as a pure feature extractor. Every image becomes a 2048-dim vector.

    Key difference from the classifier:
      Classifier: backbone → FC head → 5 class probabilities
      Extractor:  backbone → Identity()  → 2048 raw features

    The 2048 values represent learned visual concepts:
    texture, weave pattern, color distribution, stitching style, shape.
    """

    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._load()
        return cls._instance

    def _load(self):
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

        backbone = models.resnet50(weights=models.ResNet50_Weights.IMAGENET1K_V2)
        # Replace FC with Identity — now forward() returns the 2048-d avgpool output
        backbone.fc = nn.Identity()

        self.model = backbone.to(self.device).eval()

        # IMPORTANT: use IDENTICAL transform to what index was built with.
        # If you change this transform later, the index is invalid — rebuild it.
        self.transform = transforms.Compose([
            transforms.Resize(256),
            transforms.CenterCrop(224),
            transforms.ToTensor(),
            transforms.Normalize(
                mean=[0.485, 0.456, 0.406],  # ImageNet stats — never change these
                std=[0.229, 0.224, 0.225],
            ),
        ])

        print(f"ResNetExtractor ready on {self.device}")

    @torch.no_grad()
    def extract(self, image_bytes: bytes) -> np.ndarray:
        """
        Single image → L2-normalised 2048-dim numpy vector.
        """
        img    = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        tensor = self.transform(img).unsqueeze(0).to(self.device)   # [1, 3, 224, 224]
        feat   = self.model(tensor).squeeze(0).cpu().numpy()        # [2048]
        return self._l2_normalise(feat)

    @torch.no_grad()
    def extract_batch(self, images_bytes: list[bytes], batch_size: int = 64) -> np.ndarray:
        """
        Many images → [N, 2048] matrix. Processes in batches for GPU efficiency.
        Used during offline index building.
        """
        all_feats = []

        for start in range(0, len(images_bytes), batch_size):
            chunk = images_bytes[start : start + batch_size]
            tensors = torch.stack([
                self.transform(Image.open(io.BytesIO(b)).convert('RGB'))
                for b in chunk
            ]).to(self.device)                               # [B, 3, 224, 224]

            feats = self.model(tensors).cpu().numpy()        # [B, 2048]
            all_feats.append(feats)

            if (start // batch_size) % 10 == 0:
                print(f"  Extracted {start + len(chunk)}/{len(images_bytes)} images")

        matrix = np.vstack(all_feats)                        # [N, 2048]
        return self._l2_normalise_matrix(matrix)

    @staticmethod
    def _l2_normalise(v: np.ndarray) -> np.ndarray:
        norm = np.linalg.norm(v)
        return v / norm if norm > 0 else v

    @staticmethod
    def _l2_normalise_matrix(M: np.ndarray) -> np.ndarray:
        norms = np.linalg.norm(M, axis=1, keepdims=True)
        norms = np.where(norms > 0, norms, 1.0)
        return M / norms