// components/ImageSearchUpload.tsx
'use client';
import { useState, useCallback } from 'react';
import { apiFetch } from '@/services/api';

interface SearchResult {
  product_id: string; name: string; type: string;
  base_price: number; image_url: string; similarity: number;
}

export default function ImageSearchUpload() {
  const [results,  setResults]  = useState<SearchResult[]>([]);
  const [preview,  setPreview]  = useState<string | null>(null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview immediately
    setPreview(URL.createObjectURL(file));
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/search/image?top_k=8`, {
        method:  'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body:    formData,
      });
      if (!res.ok) throw new Error('Search failed');
      const data = await res.json();
      setResults(data.results);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div style={{ padding: '1rem 0' }}>
      <label style={{
        display: 'flex', alignItems: 'center', gap: 12,
        border: '0.5px solid var(--color-border-secondary)',
        borderRadius: 'var(--border-radius-lg)',
        padding: '12px 16px', cursor: 'pointer',
        background: 'var(--color-background-secondary)',
      }}>
        <input type="file" accept="image/*" onChange={handleFileChange}
               style={{ display: 'none' }} />
        <span style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>
          {preview ? 'Change photo' : 'Upload any bag photo to find similar styles'}
        </span>
      </label>

      {preview && (
        <img src={preview} alt="Query"
             style={{ width: 120, height: 120, objectFit: 'cover',
                      borderRadius: 8, marginTop: 12 }} />
      )}

      {loading && (
        <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 12 }}>
          Searching...
        </p>
      )}

      {error && (
        <p style={{ fontSize: 13, color: 'var(--color-text-danger)', marginTop: 12 }}>
          {error}
        </p>
      )}

      {results.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: 12, marginTop: 20,
        }}>
          {results.map(r => (
            <a key={r.product_id} href={`/products/${r.product_id}`}
               style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{
                border: '0.5px solid var(--color-border-tertiary)',
                borderRadius: 'var(--border-radius-lg)',
                overflow: 'hidden',
              }}>
                <img src={r.image_url} alt={r.name}
                     style={{ width: '100%', aspectRatio: '1', objectFit: 'cover' }} />
                <div style={{ padding: '8px 10px' }}>
                  <p style={{ fontSize: 13, fontWeight: 500, margin: 0 }}>{r.name}</p>
                  <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', margin: '2px 0 0' }}>
                    ₹{r.base_price} · {Math.round(r.similarity * 100)}% match
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}