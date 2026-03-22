# feature_6_recommender/collaborative.py

import numpy as np
import pandas as pd
import pickle
import json
from pathlib import Path
from scipy.sparse import csr_matrix
from sklearn.decomposition import TruncatedSVD
import yaml

def load_config():
    with open('feature_6_recommender/configs/recommender_config.yaml') as f:
        return yaml.safe_load(f)

cfg = load_config()


def build_interaction_matrix(interactions_df: pd.DataFrame):
    """
    Convert purchase records into a sparse user × product matrix.

    interactions_df columns:
      user_id, product_id, purchased (1 = bought, 0 = not)

    We use implicit feedback — purchased = 1, not purchased = 0.
    No ratings. Binary signal only.

    Why sparse matrix?
      With 1,000 users × 500 products = 500,000 cells.
      Most are 0 (users haven't bought most products).
      Sparse matrix stores only the non-zero entries — 10-100× less memory.
    """
    # Map IDs to integer positions
    users    = interactions_df['user_id'].unique().tolist()
    products = interactions_df['product_id'].unique().tolist()
    user_idx = {u: i for i, u in enumerate(users)}
    prod_idx = {p: i for i, p in enumerate(products)}

    rows = interactions_df['user_id'].map(user_idx).values
    cols = interactions_df['product_id'].map(prod_idx).values
    data = interactions_df['purchased'].values.astype(float)

    matrix = csr_matrix(
        (data, (rows, cols)),
        shape=(len(users), len(products))
    )

    print(f"Interaction matrix: {matrix.shape} | "
          f"density={matrix.nnz / (matrix.shape[0] * matrix.shape[1]):.4f}")
    return matrix, user_idx, prod_idx, users, products


def train_svd(interaction_matrix: csr_matrix) -> TruncatedSVD:
    """
    Matrix factorisation via Truncated SVD.

    What SVD does:
      Decomposes the user × product matrix into:
        U  [n_users, n_factors]    — user latent factors
        Σ  [n_factors]             — importance of each factor
        Vt [n_factors, n_products] — product latent factors

      Each user and product is represented as a dense vector
      of n_factors numbers. Users and products that often appear
      together end up with similar vectors.

      Recommendation = find products whose vectors are
      closest to the user's vector.

    TruncatedSVD keeps only the top n_factors components —
    this acts as regularisation, filtering noise.
    """
    n_factors = cfg['collaborative']['n_factors']
    svd = TruncatedSVD(n_components=n_factors, random_state=42)

    # Fit on the interaction matrix
    # user_factors[i] = latent vector for user i
    user_factors = svd.fit_transform(interaction_matrix)   # [n_users, n_factors]

    explained = svd.explained_variance_ratio_.sum()
    print(f"SVD: {n_factors} factors explain "
          f"{explained * 100:.1f}% of variance")

    return svd, user_factors


def get_cf_scores(user_idx_int: int,
                   user_factors: np.ndarray,
                   svd: TruncatedSVD) -> np.ndarray:
    """
    Compute collaborative filtering score for all products for one user.

    Score = dot(user_vector, product_vectors.T)
    Higher dot product = user and product are more "aligned" in latent space.
    """
    user_vec      = user_factors[user_idx_int]           # [n_factors]
    product_vecs  = svd.components_.T                    # [n_products, n_factors]
    scores        = user_vec @ product_vecs.T            # [n_products]
    return scores


def save_cf_model(svd, user_factors, user_idx, prod_idx, users, products):
    wdir = Path('feature_6_recommender/weights')
    wdir.mkdir(parents=True, exist_ok=True)

    with open(cfg['weights']['svd_model'], 'wb') as f:
        pickle.dump({'svd': svd, 'user_factors': user_factors}, f)

    with open(cfg['weights']['user_index'], 'w') as f:
        json.dump({'user_idx': user_idx, 'users': users}, f)

    with open(cfg['weights']['product_index'], 'w') as f:
        json.dump({'prod_idx': prod_idx, 'products': products}, f)

    print("CF model saved.")


def load_cf_model():
    with open(cfg['weights']['svd_model'], 'rb') as f:
        data = pickle.load(f)
    with open(cfg['weights']['user_index']) as f:
        ui = json.load(f)
    with open(cfg['weights']['product_index']) as f:
        pi = json.load(f)
    return (data['svd'], data['user_factors'],
            ui['user_idx'], pi['prod_idx'],
            ui['users'], pi['products'])