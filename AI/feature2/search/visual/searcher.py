# search/visual/searcher.py

import faiss
import numpy as np
import json
from pathlib import Path
from extractor import ResNetExtractor

INDEX_FILE = Path('indexes/bags_flat.faiss')
META_FILE  = Path('indexes/bags_metadata.json')


class VisualSearcher:
    """
    Singleton: index loads once at startup, shared across all requests.
    Thread-safe for read-only FAISS searches.
    """
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._load()
        return cls._instance

    def _load(self):
        if not INDEX_FILE.exists():
            raise FileNotFoundError(
                f"FAISS index not found at {INDEX_FILE}. "
                "Run: python scripts/build_visual_index.py"
            )

        self.extractor = ResNetExtractor()
        self.index     = faiss.read_index(str(INDEX_FILE))

        with open(META_FILE) as f:
            self.metadata = json.load(f)           # list, position i → product info

        # Build a product_id → position reverse map for fast lookups
        self.id_to_pos = {m['product_id']: m['position'] for m in self.metadata}

        print(f"VisualSearcher loaded: {self.index.ntotal} products in index")

    def search_by_image(self, image_bytes: bytes, top_k: int = 8,
                        exclude_product_id: str = None) -> list[dict]:
        """
        Upload an image → find the K most visually similar products.

        exclude_product_id: when searching on a product detail page,
          exclude the product itself from results.
        """
        query_vec = self.extractor.extract(image_bytes)               # [2048], L2-normalised
        query_vec = query_vec.reshape(1, -1).astype(np.float32)       # [1, 2048]

        # FAISS search: returns scores (cosine similarity) and positions
        k_fetch = top_k + 5   # fetch extra so we have room to filter
        scores, positions = self.index.search(query_vec, k_fetch)     # [1, K] each

        results = []
        for score, pos in zip(scores[0], positions[0]):
            if pos == -1:                            # FAISS returns -1 for empty slots
                continue
            meta = self.metadata[pos]
            if exclude_product_id and meta['product_id'] == exclude_product_id:
                continue                             # skip the query product itself
            results.append({
                **meta,
                'similarity': round(float(score), 4),  # cosine similarity [0, 1]
            })
            if len(results) >= top_k:
                break

        return results

    def search_by_product_id(self, product_id: str, top_k: int = 8) -> list[dict]:
        """
        "More like this" — no image upload needed. Uses the already-indexed
        embedding of an existing product as the query vector.
        """
        if product_id not in self.id_to_pos:
            raise ValueError(f"Product {product_id} not in index. Has it been indexed?")

        pos       = self.id_to_pos[product_id]
        query_vec = self.index.reconstruct(pos)                       # pull vector from index
        query_vec = query_vec.reshape(1, -1).astype(np.float32)

        scores, positions = self.index.search(query_vec, top_k + 1)  # +1 to exclude self

        results = []
        for score, p in zip(scores[0], positions[0]):
            if p == -1 or p == pos:   # skip self
                continue
            results.append({ **self.metadata[p], 'similarity': round(float(score), 4) })
            if len(results) >= top_k:
                break

        return results

    def reload_index(self):
        """Hot-reload after index update — no server restart needed."""
        self.index    = faiss.read_index(str(INDEX_FILE))
        with open(META_FILE) as f:
            self.metadata = json.load(f)
        self.id_to_pos = {m['product_id']: m['position'] for m in self.metadata}
        print(f"Index reloaded: {self.index.ntotal} vectors")   