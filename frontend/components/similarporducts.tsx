// components/SimilarProducts.tsx
'use client';
import { useEffect, useState } from 'react';

export default function SimilarProducts({ productId }: { productId: string }) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/search/similar/${productId}?top_k=4`)
      .then(r => r.json())
      .then(d => setResults(d.results ?? []))
      .catch(console.error);
  }, [productId]);

  if (!results.length) return null;

  return (
    <section style={{ marginTop: '2rem' }}>
      <h3 style={{ fontWeight: 500, fontSize: 16, marginBottom: '1rem' }}>
        Similar bags
      </h3>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 12,
      }}>
        {results.map((r: any) => (
          <a key={r.product_id} href={`/products/${r.product_id}`}
             style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{
              border: '0.5px solid var(--color-border-tertiary)',
              borderRadius: 'var(--border-radius-md)', overflow: 'hidden',
            }}>
              <img src={r.image_url} alt={r.name}
                   style={{ width: '100%', aspectRatio: '1', objectFit: 'cover' }} />
              <div style={{ padding: '8px 10px' }}>
                <p style={{ fontSize: 13, fontWeight: 500, margin: 0 }}>{r.name}</p>
                <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', margin: '2px 0 0' }}>
                  ₹{r.base_price}
                </p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}