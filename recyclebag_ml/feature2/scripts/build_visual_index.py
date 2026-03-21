# scripts/build_visual_index.py

import sys, asyncio, httpx
sys.path.append('search/visual')

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
            img_bytes = await client.get(img_url)
            products.append({
                'product_id':  p['id'],
                'image_url':   img_url,
                'image_bytes': img_bytes.content,
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