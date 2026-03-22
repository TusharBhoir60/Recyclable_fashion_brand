/**
 * Visual Search Service — Feature 2
 * Proxies image queries to the FastAPI ML service.
 */

const ML_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

async function searchByImage(imageBuffer, topK = 6) {
  const formData = new FormData();
  formData.append('file',  new Blob([imageBuffer], { type: 'image/jpeg' }), 'query.jpg');
  formData.append('top_k', String(topK));

  const res = await fetch(`${ML_URL}/search/image`, { method: 'POST', body: formData });
  if (!res.ok) throw new Error(`ML visual search error: ${await res.text()}`);
  return res.json(); // [{ product_id, score }]
}

async function findSimilar(productId, topK = 6) {
  const res = await fetch(`${ML_URL}/search/similar/${productId}?top_k=${topK}`);
  if (!res.ok) throw new Error(`ML similar search error: ${await res.text()}`);
  return res.json();
}

async function indexProduct(productId, imageUrl) {
  const res = await fetch(`${ML_URL}/search/index`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ product_id: productId, image_url: imageUrl }),
  });
  if (!res.ok) throw new Error(`ML index error: ${await res.text()}`);
  return res.json();
}

module.exports = { searchByImage, findSimilar, indexProduct };