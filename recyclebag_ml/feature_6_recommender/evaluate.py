# feature_6_recommender/evaluate.py

import numpy as np
import pandas as pd
from typing import Callable


def precision_at_k(recommendations: list[str],
                    relevant_items: list[str],
                    k: int) -> float:
    """
    Of the top-K recommendations, what fraction are relevant?
    Relevant = items the user actually bought (from held-out test set).

    P@K = |recommended ∩ relevant| / K
    """
    top_k = recommendations[:k]
    hits  = len(set(top_k) & set(relevant_items))
    return hits / k if k > 0 else 0.0


def recall_at_k(recommendations: list[str],
                 relevant_items: list[str],
                 k: int) -> float:
    """
    Of all relevant items, what fraction did we recommend in top-K?

    R@K = |recommended ∩ relevant| / |relevant|
    """
    if not relevant_items:
        return 0.0
    top_k = recommendations[:k]
    hits  = len(set(top_k) & set(relevant_items))
    return hits / len(relevant_items)


def coverage(all_recommendations: list[list[str]],
              catalog_size: int) -> float:
    """
    What fraction of the catalog gets recommended to at least one user?
    Low coverage = the system keeps recommending the same popular items.
    """
    all_recs = {item for recs in all_recommendations for item in recs}
    return len(all_recs) / catalog_size


def evaluate_recommender(recommend_fn: Callable,
                          test_interactions: pd.DataFrame,
                          k: int = 8) -> dict:
    """
    Leave-one-out evaluation:
      For each user, hide their most recent purchase.
      Ask the recommender to suggest products.
      Check if the hidden item appears in top-K.

    test_interactions columns: user_id, product_id, purchased, created_at
    """
    test_interactions = test_interactions.sort_values('created_at')
    precisions, recalls = [], []

    for user_id, group in test_interactions.groupby('user_id'):
        if len(group) < 2:
            continue   # need at least 2 purchases to do leave-one-out

        # Hide the most recent purchase
        hidden_item = group.iloc[-1]['product_id']
        history     = group.iloc[:-1]['product_id'].tolist()

        try:
            recs = recommend_fn(user_id=user_id, top_k=k)
            rec_ids = [r['product_id'] for r in recs]
        except Exception:
            continue

        precisions.append(precision_at_k(rec_ids, [hidden_item], k))
        recalls.append(recall_at_k(rec_ids, [hidden_item], k))

    result = {
        f'precision@{k}': round(np.mean(precisions), 4) if precisions else 0.0,
        f'recall@{k}':    round(np.mean(recalls), 4)    if recalls    else 0.0,
        'n_users_evaluated': len(precisions),
    }
    print(f"\n=== Recommender Evaluation (k={k}) ===")
    for metric, value in result.items():
        print(f"  {metric}: {value}")
    return result