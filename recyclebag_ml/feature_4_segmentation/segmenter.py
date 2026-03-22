# feature_4_segmentation/segmenter.py

import pandas as pd
import numpy as np
import pickle
import json
import yaml
from pathlib import Path
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans

def load_config():
    with open('feature_4_segmentation/configs/segmentation_config.yaml') as f:
        return yaml.safe_load(f)

cfg = load_config()


def train(rfm: pd.DataFrame) -> dict:
    """
    Full training pipeline:
      1. Scale RFM features (StandardScaler)
      2. Fit K-Means
      3. Label clusters by their business meaning
      4. Save model + scaler + cluster map to disk

    Returns dict of { user_id → segment_name }
    """
    Path('feature_4_segmentation/weights').mkdir(parents=True, exist_ok=True)

    X = rfm[['recency', 'frequency', 'monetary']].values

    # StandardScaler: subtract mean, divide by std
    # WHY: K-Means uses Euclidean distance. Without scaling, monetary
    # (₹100–50,000 range) completely dominates recency (1–365 range).
    # After scaling all three features have mean=0, std=1 — equal influence.
    scaler  = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    km_cfg = cfg['kmeans']
    kmeans = KMeans(
        n_clusters=km_cfg['n_clusters'],
        random_state=km_cfg['random_state'],
        n_init=km_cfg['n_init'],        # multiple restarts prevent bad centroids
        max_iter=km_cfg['max_iter'],
    )
    rfm = rfm.copy()
    rfm['cluster'] = kmeans.fit_predict(X_scaled)

    # Label clusters by business meaning
    # Strategy: rank clusters by a composite score
    #   score = -recency + frequency + monetary (all scaled back to original)
    # Highest score = Champions (bought recently, often, and spent the most)
    centres_original = scaler.inverse_transform(kmeans.cluster_centers_)
    centres_df = pd.DataFrame(centres_original,
                               columns=['recency', 'frequency', 'monetary'])
    centres_df['score'] = (
        -centres_df['recency']           # lower recency = better
        + centres_df['frequency'] * 10   # weight frequency more
        + centres_df['monetary'] / 100   # scale monetary down
    )

    # Sort clusters worst → best, assign segment names in that order
    ranked       = centres_df['score'].rank(method='first').astype(int) - 1
    segment_names = cfg['segment_names']   # ["At risk", "Occasional", "Loyal", "Champions"]
    cluster_map  = {int(cluster_id): segment_names[rank]
                    for cluster_id, rank in ranked.items()}

    rfm['segment'] = rfm['cluster'].map(cluster_map)

    print("\n=== Cluster centres (original scale) ===")
    for cid, name in cluster_map.items():
        row = centres_df.iloc[cid]
        print(f"  {name:<15} | recency: {row.recency:.0f}d | "
              f"frequency: {row.frequency:.1f} | monetary: ₹{row.monetary:.0f}")

    print("\n=== Segment distribution ===")
    print(rfm['segment'].value_counts())

    # Persist model artefacts
    with open(cfg['weights']['kmeans_model'], 'wb') as f:
        pickle.dump(kmeans, f)
    with open(cfg['weights']['scaler'], 'wb') as f:
        pickle.dump(scaler, f)
    with open(cfg['weights']['cluster_map'], 'w') as f:
        json.dump(cluster_map, f)

    print(f"\nSaved model artefacts to feature_4_segmentation/weights/")
    return rfm[['user_id', 'recency', 'frequency', 'monetary',
                 'cluster', 'segment']].to_dict(orient='records')


def load_model():
    """Load saved model + scaler + cluster map for inference."""
    with open(cfg['weights']['kmeans_model'], 'rb') as f:
        kmeans = pickle.load(f)
    with open(cfg['weights']['scaler'], 'rb') as f:
        scaler = pickle.load(f)
    with open(cfg['weights']['cluster_map']) as f:
        # JSON keys are always strings — convert back to int
        cluster_map = {int(k): v for k, v in json.load(f).items()}
    return kmeans, scaler, cluster_map