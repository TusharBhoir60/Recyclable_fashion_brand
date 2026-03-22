
# classifiers/textile/predict.py

import torch
from torchvision import transforms
from PIL import Image
import io, yaml
from model import build_model

def load_config():
    with open('configs/textile_config.yaml') as f:
        return yaml.safe_load(f)

cfg     = load_config()
CLASSES = cfg['classes']['material']

INFERENCE_TRANSFORM = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(cfg['data']['mean'], cfg['data']['std']),
])

class TextileClassifier:
    """
    Singleton — load once at startup, reuse across requests.
    Thread-safe for read-only inference.
    """
    _instance = None

    def __new__(cls, weights_path: str = 'weights/textile_v1.pt'):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._load(weights_path)
        return cls._instance

    def _load(self, weights_path: str):
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.model  = build_model(num_classes=len(CLASSES), freeze_backbone=False)
        self.model.load_state_dict(torch.load(weights_path, map_location=self.device))
        self.model.to(self.device).eval()
        print(f"Classifier loaded on {self.device}")

    @torch.no_grad()
    def predict(self, image_bytes: bytes) -> dict:
        img    = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        tensor = INFERENCE_TRANSFORM(img).unsqueeze(0).to(self.device)  # [1, 3, 224, 224]

        logits = self.model(tensor)
        probs  = torch.softmax(logits, dim=1)[0]                        # [5]

        pred_idx    = probs.argmax().item()
        confidence  = probs[pred_idx].item()
        material    = CLASSES[pred_idx]

        # Quality gate logic
        A_thresh = cfg['classes']['grade_A_threshold']
        B_thresh = cfg['classes']['grade_B_threshold']
        if confidence >= A_thresh:
            grade = 'A'             # premium bag production
        elif confidence >= B_thresh:
            grade = 'B'             # basic bag production
        else:
            grade = 'reject'        # manual review queue

        return {
            'material':    material,
            'confidence':  round(confidence, 4),
            'grade':       grade,
            'route_to':    'premium' if grade == 'A' else ('basic' if grade == 'B' else 'manual_review'),
            'all_probs':   {cls: round(p.item(), 4) for cls, p in zip(CLASSES, probs)},
            'flag_for_review': confidence < cfg['active_learning']['confidence_threshold'],
        }