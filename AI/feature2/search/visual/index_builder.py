# search/visual/index_builder.py

import faiss
import numpy as np
import json
from pathlib import Path
from extractor import ResNetExtractor

INDEX_DIR  = Path('indexes')
INDEX_FILE = INDEX_DIR / 'bags_flat.faiss'
META_FILE  = INDEX_DIR / 'bags_metadata.json'
DIM        = 2048

def build_flat_index(products: list[dict]) -> faiss.IndexFlatIP:
    """
    products: list of { product_id, image_url, image_bytes, name, type, base_price }

    Returns a FAISS IndexFlatIP where:
      - position i  →  products[i]
      - metadata file maps i → { product_id, image_url, ... }
    """
    extractor = ResNetExtractor()
    INDEX_DIR.mkdir(exist_ok=True)

    print(f"Building index for {len(products)} products...")

    # 1. Extract all embeddings in one batched pass
    all_bytes  = [p['image_bytes'] for p in products]
    embeddings = extractor.extract_batch(all_bytes)          # [N, 2048], L2-normalised
    assert embeddings.shape == (len(products), DIM)

    # 2. Build FAISS index
    index = faiss.IndexFlatIP(DIM)                           # Inner Product = cosine (post L2-norm)
    index.add(embeddings.astype(np.float32))
    print(f"Index built: {index.ntotal} vectors @ {DIM} dims")

    # 3. Save index to disk
    faiss.write_index(index, str(INDEX_FILE))

    # 4. Save metadata (position → product info)
    metadata = [
        {
            'position':   i,
            'product_id': p['product_id'],
            'image_url':  p['image_url'],
            'name':       p['name'],
            'type':       p['type'],
            'base_price': p['base_price'],
        }
        for i, p in enumerate(products)
    ]
    with open(META_FILE, 'w') as f:
        json.dump(metadata, f, indent=2)

    print(f"Index saved: {INDEX_FILE}")
    print(f"Metadata saved: {META_FILE}")
    return index


def build_ivf_index(products: list[dict], n_lists: int = 100) -> faiss.IndexIVFFlat:
    """
    Approximate index for large catalogs (5,000+ products).
    n_lists: number of Voronoi cells. Rule of thumb: sqrt(N).
    """
    extractor  = ResNetExtractor()
    all_bytes  = [p['image_bytes'] for p in products]
    embeddings = extractor.extract_batch(all_bytes).astype(np.float32)

    quantiser = faiss.IndexFlatIP(DIM)
    index     = faiss.IndexIVFFlat(quantiser, DIM, n_lists, faiss.METRIC_INNER_PRODUCT)

    # IVF index MUST be trained before adding vectors
    print(f"Training IVF index with {n_lists} lists on {len(products)} vectors...")
    index.train(embeddings)
    index.add(embeddings)

    # nprobe: how many cells to search. Higher = more accurate but slower.
    # Default 1 is too low. 10 is a good starting point.
    index.nprobe = 10

    faiss.write_index(index, str(INDEX_DIR / 'bags_ivf.faiss'))
    return index