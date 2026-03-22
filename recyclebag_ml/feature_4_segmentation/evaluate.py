# feature_4_segmentation/evaluate.py

import numpy as np
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
from sklearn.preprocessing import StandardScaler
import pandas as pd
import yaml

def load_config():
    with open('feature_4_segmentation/configs/segmentation_config.yaml') as f:
        return yaml.safe_load(f)

cfg = load_config()


def find_optimal_k(rfm: pd.DataFrame, save_plot: bool = True):
    """
    Run K-Means for k = 2..8, compute two metrics per k:

    Inertia (elbow method):
      Sum of squared distances from each point to its centroid.
      Always decreases as k increases. Look for the "elbow" —
      the k where adding another cluster stops meaningfully reducing inertia.

    Silhouette score:
      How similar each point is to its own cluster vs neighbouring clusters.
      Range: -1 (wrong cluster) to +1 (perfect cluster).
      Higher is better. Peak = optimal k.
    """
    X = rfm[['recency', 'frequency', 'monetary']].values
    scaler   = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    k_range    = range(cfg['evaluation']['k_range_min'],
                       cfg['evaluation']['k_range_max'])
    inertias   = []
    silhouettes = []

    print("Testing k values...")
    for k in k_range:
        km  = KMeans(n_clusters=k, random_state=42, n_init=10)
        lbl = km.fit_predict(X_scaled)
        inertias.append(km.inertia_)
        sil = silhouette_score(X_scaled, lbl)
        silhouettes.append(sil)
        print(f"  k={k} | inertia={km.inertia_:.0f} | silhouette={sil:.4f}")

    best_k_sil = k_range.start + np.argmax(silhouettes)
    print(f"\nBest k by silhouette: {best_k_sil}")
    print(f"(Config uses k={cfg['kmeans']['n_clusters']} — "
          f"{'matches' if cfg['kmeans']['n_clusters'] == best_k_sil else 'consider adjusting'})")

    if save_plot:
        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 4))

        ax1.plot(list(k_range), inertias, 'o-', color='#1D9E75')
        ax1.set_xlabel('Number of clusters (k)')
        ax1.set_ylabel('Inertia')
        ax1.set_title('Elbow method — look for the bend')
        ax1.axvline(x=cfg['kmeans']['n_clusters'], color='#D85A30',
                    linestyle='--', alpha=0.7, label=f"Current k={cfg['kmeans']['n_clusters']}")
        ax1.legend()

        ax2.plot(list(k_range), silhouettes, 'o-', color='#534AB7')
        ax2.set_xlabel('Number of clusters (k)')
        ax2.set_ylabel('Silhouette score')
        ax2.set_title('Silhouette score — higher is better')
        ax2.axvline(x=best_k_sil, color='#D85A30',
                    linestyle='--', alpha=0.7, label=f"Best k={best_k_sil}")
        ax2.legend()

        plt.tight_layout()
        path = 'feature_4_segmentation/notebooks/elbow_silhouette.png'
        plt.savefig(path, dpi=150)
        print(f"Plot saved: {path}")

    return list(k_range), inertias, silhouettes


def cluster_profile(results: list[dict]):
    """
    Print a readable summary of what each segment looks like.
    Call this after train() with the returned records.
    """
    df = pd.DataFrame(results)
    profile = df.groupby('segment').agg(
        count     = ('user_id',   'count'),
        avg_recency   = ('recency',   'mean'),
        avg_frequency = ('frequency', 'mean'),
        avg_monetary  = ('monetary',  'mean'),
        total_revenue = ('monetary',  'sum'),
    ).round(1)

    print("\n=== Segment profiles ===")
    print(profile.to_string())
    print(f"\nTotal customers: {df['user_id'].nunique()}")
    print(f"Total revenue:   ₹{df['monetary'].sum():,.0f}")