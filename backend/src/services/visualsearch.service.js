/**
 * Visual Search Service — Feature 2
 * Proxies image queries to the FastAPI ML service.
 */

const env = require('../config/env');
const ML_URL = env.mlServiceUrl;

async function searchByImage(imageBuffer, topK = 6, exclude = null) {
  const formData = new FormData();
  formData.append('file', new Blob([imageBuffer], { type: 'image/jpeg' }), 'query.jpg');

  const qs = new URLSearchParams({ top_k: String(topK) });
  if (exclude) qs.set('exclude', exclude);

  const res = await fetch(`${ML_URL}/search/by-image?${qs.toString()}`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) throw new Error(`ML visual search error: ${await res.text()}`);
  const data = await res.json();
  return data.results ?? [];
}

async function findSimilar(productId, topK = 6) {
  const res = await fetch(`${ML_URL}/search/by-product/${productId}?top_k=${topK}`);
  if (!res.ok) throw new Error(`ML similar search error: ${await res.text()}`);
  const data = await res.json();
  return data.results ?? [];
}

async function addProductToIndex({ productId, name, type, basePrice, imageBuffer, filename = 'product.jpg' }) {
  const formData = new FormData();
  formData.append('product_id', productId);
  formData.append('name', name);
  formData.append('type', type);
  formData.append('base_price', String(basePrice));
  formData.append('file', new Blob([imageBuffer], { type: 'image/jpeg' }), filename);

  const res = await fetch(`${ML_URL}/search/add-product`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) throw new Error(`ML index error: ${await res.text()}`);
  return res.json();
}

module.exports = { searchByImage, findSimilar, addProductToIndex };