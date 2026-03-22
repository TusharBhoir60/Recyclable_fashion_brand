# scripts/build_visual_index.py

import sys
import asyncio
from pathlib import Path
import httpx

ROOT_DIR = Path(__file__).resolve().parents[1]
FEATURE2_DIR = ROOT_DIR / 'feature2'
if str(FEATURE2_DIR) not in sys.path:
    sys.path.append(str(FEATURE2_DIR))

from index_builder import build_flat_index

async def fetch_products_from_db():
    """
    Call our own Node.js API to get all active products with their images.
    In production, call Prisma directly via a Python psycopg2 connection.
    """
    async with httpx.AsyncClient() as client:
        res  = await client.get('http://localhost:5000/api/products?limit=9999')
        data = res.json()

        products = []
        for p in data['items']:
            for img_url in p['images'][:1]:   # use first image per product
                # Support relative URLs returned by local backend.
                if img_url.startswith('/'):
                    img_url = f"http://localhost:5000{img_url}"

                img_res = await client.get(img_url)
                img_res.raise_for_status()

                products.append({
                    'product_id':  p['id'],
                    'image_url':   img_url,
                    'image_bytes': img_res.content,
                    'name':        p['name'],
                    'type':        p['type'],
                    'base_price':  p['basePrice'],
                })
        return products

async def main():
    print("Fetching products from DB...")
    products = await fetch_products_from_db()
    print(f"Found {len(products)} product images")
    build_flat_index(products)
    print("Done.")

asyncio.run(main())