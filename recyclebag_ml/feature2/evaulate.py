# search/visual/evaluate.py

"""
How to evaluate visual search quality without user labels:

Precision@K: of the K results returned, how many are the same product type as the query?
  e.g. query is a denim bag → 6/8 results are denim bags → P@8 = 0.75

This is a proxy metric. Real metric = user click-through on search results (log it).
"""

import numpy as np
from pathlib import Path
from extractor import ResNetExtractor
from searcher  import VisualSearcher
import json


def precision_at_k(searcher: VisualSearcher, test_images: list[dict], k: int = 8) -> float:
    """
    test_images: [{ image_bytes, true_type }]
    Returns mean P@K across all test queries.
    """
    precisions = []

    for sample in test_images:
        results = searcher.search_by_image(sample['image_bytes'], top_k=k)
        relevant = sum(1 for r in results if r['type'] == sample['true_type'])
        precisions.append(relevant / k)

    mean_pk = np.mean(precisions)
    print(f"Mean Precision@{k}: {mean_pk:.4f}")
    return float(mean_pk)


def latency_benchmark(searcher: VisualSearcher, test_image_bytes: bytes, n=100):
    """Measure p50 and p95 query latency."""
    import time
    times = []
    for _ in range(n):
        t0 = time.perf_counter()
        searcher.search_by_image(test_image_bytes, top_k=8)
        times.append((time.perf_counter() - t0) * 1000)  # ms

    times.sort()
    print(f"Latency (n={n}): p50={times[n//2]:.1f}ms  p95={times[int(n*0.95)]:.1f}ms")