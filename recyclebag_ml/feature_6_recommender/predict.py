# feature_6_recommender/predict.py

import numpy as np
import pandas as pd
import yaml

def load_config():
    with open('feature_6_recommender/configs/recommender_config.yaml') as f:
        return yaml.safe_load(f)

cfg = load_config()

# Load all artefacts once at module import
from collaborative import load_cf_model
from content_based import load_content_model
from hybrid        import get_alpha, hybrid_scores, get_top_k, normalise
from collaborative import get_cf_scores
from content_based import get_cb_scores

_svd            = None
_user_factors   = None
_user_idx       = None
_prod_idx       = None
_users          = None
_products       = None
_content_sim    = None


def _ensure_loaded():
    global _svd, _user_factors, _user_idx, _prod_idx, _users, _products, _content_sim
    if _svd is None:
        _svd, _user_factors, _user_idx, _prod_idx, _users, _products = load_cf_model()
        _content_sim = load_content_model()
        print(f"Recommender loaded: {len(_users)} users, {len(_products)} products")


def recommend(user_id: str,
               segment: str = 'New',
               bought_product_ids: list = None,
               top_k: int = None) -> list[dict]:
    """
    Main recommendation function.

    user_id:            the user to recommend for
    segment:            from Feature 4 (Champions/Loyal/Occasional/At risk/New)
    bought_product_ids: list of product IDs the user has already purchased
    top_k:              number of recommendations to return

    Returns list of { product_id, score, rank }
    """
    _ensure_loaded()

    if top_k is None:
        top_k = cfg['hybrid']['top_k']
    if bought_product_ids is None:
        bought_product_ids = []

    alpha = get_alpha(segment)

    # --- Collaborative signal ---
    if alpha > 0 and user_id in _user_idx:
        uid_int  = _user_idx[user_id]
        cf_scores = get_cf_scores(uid_int, _user_factors, _svd)
    else:
        # Unknown user or new user — zero CF signal
        cf_scores = np.zeros(len(_products))

    # --- Content-based signal ---
    cb_scores = get_cb_scores(bought_product_ids, _prod_idx, _content_sim)

    # --- Fuse ---
    scores = hybrid_scores(cf_scores, cb_scores, alpha)

    return get_top_k(scores, _products, bought_product_ids, _prod_idx, top_k)


def generate_synthetic_data(n_users: int = 300,
                              n_products: int = 50,
                              n_interactions: int = 800):
    """
    Bootstrap data for development — no real orders needed.
    """
    import random, json
    from pathlib import Path
    random.seed(42)
    np.random.seed(42)

    product_types = ['BASIC', 'PREMIUM', 'CUSTOMIZED']
    materials     = ['cotton', 'denim', 'polyester', 'silk_blend', 'synthetic']

    products = pd.DataFrame({
        'product_id': [f'prod_{i:03d}' for i in range(n_products)],
        'name':       [f'Bag {i}'       for i in range(n_products)],
        'type':       np.random.choice(product_types, n_products),
        'base_price': np.random.uniform(299, 4999, n_products).round(2),
        'material':   np.random.choice(materials, n_products),
    })

    interactions = []
    for _ in range(n_interactions):
        interactions.append({
            'user_id':    f'user_{np.random.randint(0, n_users):03d}',
            'product_id': f'prod_{np.random.randint(0, n_products):03d}',
            'purchased':  1,
            'created_at': pd.Timestamp.now() - pd.Timedelta(
                days=np.random.randint(1, 365)
            ),
        })
    interactions_df = pd.DataFrame(interactions).drop_duplicates(
        subset=['user_id', 'product_id']
    )

    Path('feature_6_recommender/data/processed').mkdir(parents=True, exist_ok=True)
    products.to_csv(
        'feature_6_recommender/data/processed/products.csv', index=False
    )
    interactions_df.to_csv(
        'feature_6_recommender/data/processed/interactions.csv', index=False
    )
    print(f"Synthetic data: {len(products)} products, "
          f"{len(interactions_df)} interactions from {n_users} users")
    return products, interactions_df