# feature_6_recommender/hybrid.py

import numpy as np
import yaml

def load_config():
    with open('feature_6_recommender/configs/recommender_config.yaml') as f:
        return yaml.safe_load(f)

cfg  = load_config()
hcfg = cfg['hybrid']


def get_alpha(segment: str) -> float:
    """
    Determine collaborative vs content weight based on user segment.

    The logic:
      Champions / Loyal  → lots of history → trust collaborative signal more
      Occasional / At risk → sparse history → lean on content similarity
      New                → no history at all → pure content (α = 0)
    """
    return hcfg['alpha_by_segment'].get(segment, hcfg['default_alpha'])


def normalise(scores: np.ndarray) -> np.ndarray:
    """Scale scores to [0, 1]. Prevents one signal from dominating."""
    min_s, max_s = scores.min(), scores.max()
    if max_s - min_s < 1e-10:
        return np.zeros_like(scores)
    return (scores - min_s) / (max_s - min_s)


def hybrid_scores(cf_scores: np.ndarray,
                   cb_scores: np.ndarray,
                   alpha: float) -> np.ndarray:
    """
    Fuse collaborative and content signals.

    final = α × norm(CF) + (1−α) × norm(CB)

    Both signals are normalised first so neither dominates
    due to scale differences.
    """
    return alpha * normalise(cf_scores) + (1 - alpha) * normalise(cb_scores)


def get_top_k(scores: np.ndarray,
               products: list,
               already_bought: list,
               prod_idx: dict,
               top_k: int = None) -> list[dict]:
    """
    Return top-K products by score, excluding already purchased items.

    Returns list of:
      { product_id, score, rank }
    """
    if top_k is None:
        top_k = hcfg['top_k']

    # Zero out already-bought products
    bought_positions = {prod_idx[pid] for pid in already_bought if pid in prod_idx}
    for pos in bought_positions:
        scores[pos] = -1.0

    # Rank by descending score
    ranked_positions = np.argsort(scores)[::-1]

    results = []
    for pos in ranked_positions:
        if pos in bought_positions:
            continue
        if scores[pos] < 0:
            continue
        results.append({
            'product_id': products[pos],
            'score':      round(float(scores[pos]), 4),
            'rank':       len(results) + 1,
        })
        if len(results) >= top_k:
            break

    return results