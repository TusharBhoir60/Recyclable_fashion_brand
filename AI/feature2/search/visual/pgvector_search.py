# search/visual/pgvector_store.py

import psycopg2, numpy as np
from extractor import ResNetExtractor

def upsert_product_embedding(product_id: str, image_bytes: bytes, conn_str: str):
    extractor  = ResNetExtractor()
    embedding  = extractor.extract(image_bytes)          # [2048], normalised

    with psycopg2.connect(conn_str) as conn:
        with conn.cursor() as cur:
            # pgvector accepts Python lists as the vector literal
            cur.execute("""
                INSERT INTO "ProductEmbedding" ("id", "productId", "embedding")
                VALUES (gen_random_uuid(), %s, %s::vector)
                ON CONFLICT ("productId") DO UPDATE SET embedding = EXCLUDED.embedding
            """, (product_id, embedding.tolist()))
        conn.commit()


def search_similar_pgvector(image_bytes: bytes, top_k: int, conn_str: str,
                             product_type: str = None, max_price: float = None):
    extractor = ResNetExtractor()
    query_vec = extractor.extract(image_bytes).tolist()  # pgvector takes list

    # Build dynamic WHERE clause — this is the key advantage over FAISS
    conditions = ['TRUE']
    params     = [query_vec, top_k]

    if product_type:
        conditions.append('p.type = %s')
        params.append(product_type)
    if max_price:
        conditions.append('p."basePrice" <= %s')
        params.append(max_price)

    where = ' AND '.join(conditions)

    sql = f"""
        SELECT
            p.id,
            p.name,
            p.type,
            p."basePrice",
            p.images[1]            AS image_url,
            1 - (e.embedding <#> %s::vector) AS similarity
        FROM "ProductEmbedding" e
        JOIN "Product" p ON p.id = e."productId"
        WHERE {where}
        ORDER BY e.embedding <#> %s::vector   -- <#> = negative inner product
        LIMIT %s
    """
    # Note: <#> returns negative IP, so ORDER BY <#> ASC = highest similarity first

    with psycopg2.connect(conn_str) as conn:
        with conn.cursor() as cur:
            # Add query_vec again for the ORDER BY
            cur.execute(sql, [query_vec] + params[1:] + [query_vec, top_k])
            rows = cur.fetchall()
            cols = ['product_id', 'name', 'type', 'base_price', 'image_url', 'similarity']
            return [dict(zip(cols, row)) for row in rows]