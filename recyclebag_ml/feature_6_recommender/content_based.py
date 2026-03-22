# feature_6_recommender/content_based.py

import numpy as np
import pandas as pd
import json
from pathlib import Path
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import MinMaxScaler
import yaml

def load_config():
    with open('feature_6_recommender/configs/recommender_config.yaml') as f:
        return yaml.safe_load(f)

cfg  = load_config()
ccfg = cfg['content']


def build_product_feature_matrix(products_df: pd.DataFrame):
    """
    Convert product catalogue into a numeric feature matrix.

    products_df columns:
      product_id, name, type, base_price, material (optional)

    Feature engineering:
      type        → one-hot encode (BASIC=1,0,0 | PREMIUM=0,1,0 | CUSTOMIZED=0,0,1)
      base_price  → bin into 5 price ranges, then one-hot
      material    → one-hot (if available from Feature 1 classifier)

    Each product becomes a vector. Cosine similarity between
    two vectors = how similar those products are by attributes.
    """
    features = []

    # 1. Product type — one-hot
    if ccfg['use_type']:
        type_dummies = pd.get_dummies(
            products_df['type'], prefix='type'
        ).astype(float) * ccfg['type_weight']
        features.append(type_dummies)

    # 2. Price bins — one-hot
    if ccfg['use_price_bin']:
        products_df = products_df.copy()
        products_df['price_bin'] = pd.qcut(
            products_df['base_price'],
            q=5, labels=['budget', 'low', 'mid', 'high', 'premium'],
            duplicates='drop'
        )
        price_dummies = pd.get_dummies(
            products_df['price_bin'], prefix='price'
        ).astype(float) * ccfg['price_weight']
        features.append(price_dummies)

    # 3. Material — one-hot (if column exists)
    if ccfg['use_material'] and 'material' in products_df.columns:
        mat_dummies = pd.get_dummies(
            products_df['material'].fillna('unknown'), prefix='mat'
        ).astype(float) * ccfg['material_weight']
        features.append(mat_dummies)

    feature_matrix = pd.concat(features, axis=1).fillna(0).values
    print(f"Product feature matrix: {feature_matrix.shape}")
    return feature_matrix


def compute_content_similarity(feature_matrix: np.ndarray) -> np.ndarray:
    """
    Compute pairwise cosine similarity between all products.

    Returns [n_products, n_products] matrix where
    sim[i, j] = how similar product i and product j are.
    sim[i, i] = 1.0 always (a product is identical to itself).

    Stored on disk — expensive to recompute, cheap to load.
    """
    sim = cosine_similarity(feature_matrix)   # [n_products, n_products]
    print(f"Content similarity matrix: {sim.shape}")
    return sim


def get_cb_scores(product_ids_bought: list,
                   prod_idx: dict,
                   content_sim: np.ndarray) -> np.ndarray:
    """
    Content-based score for all products given what a user has bought.

    Strategy: average the similarity rows of all bought products.
    Products similar to many of the user's past purchases score higher.
    """
    n_products = content_sim.shape[0]

    if not product_ids_bought:
        # New user — uniform scores (no preference signal)
        return np.ones(n_products) / n_products

    bought_positions = [
        prod_idx[pid] for pid in product_ids_bought
        if pid in prod_idx
    ]
    if not bought_positions:
        return np.ones(n_products) / n_products

    # Average similarity to all bought products
    scores = content_sim[bought_positions].mean(axis=0)  # [n_products]
    return scores


def save_content_model(content_sim: np.ndarray):
    Path('feature_6_recommender/weights').mkdir(parents=True, exist_ok=True)
    np.save(cfg['weights']['content_sim'], content_sim)
    print("Content similarity matrix saved.")


def load_content_model() -> np.ndarray:
    return np.load(cfg['weights']['content_sim'])