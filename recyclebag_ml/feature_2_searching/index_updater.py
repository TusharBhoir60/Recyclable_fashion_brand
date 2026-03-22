# search/visual/index_updater.py

import faiss
import numpy as np
import json
from pathlib import Path
from extractor import ResNetExtractor

INDEX_FILE = Path('indexes/bags_flat.faiss')
META_FILE  = Path('indexes/bags_metadata.json')


def add_product_to_index(product: dict):
    """
    product: { product_id, image_url, image_bytes, name, type, base_price }

    Adds a single new product to the existing index without full rebuild.
    Called by the Node.js backend after a product is created.
    """
    extractor = ResNetExtractor()

    # 1. Extract embedding for the new product
    embedding = extractor.extract(product['image_bytes'])           # [2048], normalised
    embedding = embedding.reshape(1, -1).astype(np.float32)

    # 2. Load existing index + metadata
    index = faiss.read_index(str(INDEX_FILE))
    with open(META_FILE) as f:
        metadata = json.load(f)

    # 3. Add to index
    new_position = index.ntotal                     # append at end
    index.add(embedding)

    # 4. Append to metadata
    metadata.append({
        'position':   new_position,
        'product_id': product['product_id'],
        'image_url':  product['image_url'],
        'name':       product['name'],
        'type':       product['type'],
        'base_price': product['base_price'],
    })

    # 5. Save both back to disk
    faiss.write_index(index, str(INDEX_FILE))
    with open(META_FILE, 'w') as f:
        json.dump(metadata, f)

    print(f"Product {product['product_id']} added to index. Total: {index.ntotal}")


def remove_product_from_index(product_id: str):
    """
    FAISS Flat index doesn't support deletion natively.
    Strategy: mark as removed in metadata, rebuild nightly.
    For IVF index: use faiss.IndexIDMap wrapper (see below).
    """
    with open(META_FILE) as f:
        metadata = json.load(f)

    for m in metadata:
        if m['product_id'] == product_id:
            m['deleted'] = True
            break

    with open(META_FILE, 'w') as f:
        json.dump(metadata, f)

    # The searcher.search() will skip entries with deleted=True
    # Nightly cron job rebuilds the full index to purge deleted entries
    print(f"Product {product_id} marked as deleted. Rebuild index nightly.")