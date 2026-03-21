# classifiers/textile/active_learning.py

import json, os
from datetime import datetime
from pathlib import Path
import prisma_client  # your Node.js DB via a thin Python client or direct psycopg2

REVIEW_QUEUE_FILE = 'data/active_learning_queue.jsonl'

def flag_for_review(image_bytes: bytes, prediction: dict, source_path: str = None):
    """
    Called by predict() when confidence < threshold.
    Appends the sample to a review queue file + DB table.
    """
    if not prediction['flag_for_review']:
        return

    record = {
        'timestamp':   datetime.utcnow().isoformat(),
        'material_pred': prediction['material'],
        'confidence':  prediction['confidence'],
        'all_probs':   prediction['all_probs'],
        'source_path': source_path,
        'true_label':  None,     # filled in by admin
        'reviewed':    False,
    }

    with open(REVIEW_QUEUE_FILE, 'a') as f:
        f.write(json.dumps(record) + '\n')


def load_review_queue(reviewed_only: bool = False) -> list:
    if not Path(REVIEW_QUEUE_FILE).exists():
        return []
    with open(REVIEW_QUEUE_FILE) as f:
        records = [json.loads(line) for line in f if line.strip()]
    return [r for r in records if r['reviewed']] if reviewed_only else records


def add_labelled_sample_to_dataset(record: dict, dest_dir: str = 'data/processed/train'):
    """
    After admin labels a sample, copy it to the training directory.
    The labelled record has record['true_label'] filled in.
    """
    if not record.get('true_label'):
        raise ValueError("record must have true_label set before adding to dataset")

    dest = Path(dest_dir) / record['true_label']
    dest.mkdir(parents=True, exist_ok=True)

    ts   = datetime.utcnow().strftime('%Y%m%d_%H%M%S_%f')
    dest_path = dest / f"al_{ts}.jpg"

    # Copy image file from source_path
    import shutil
    shutil.copy2(record['source_path'], dest_path)
    print(f"Added {dest_path}")


def should_retrain() -> bool:
    """
    Check if enough new labels have accumulated to justify a retrain.
    """
    labelled = load_review_queue(reviewed_only=True)
    new_since_last_train = [r for r in labelled if not r.get('used_in_training')]
    threshold = 50  # from config
    return len(new_since_last_train) >= threshold