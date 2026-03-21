// services/visualSearch.service.js

const FormData = require('form-data');
const fetch    = require('node-fetch');

const ML_URL = process.env.ML_SERVICE_URL;

/**
 * Pattern 1: User uploads a photo → find similar bags.
 * imageBuffer: Buffer from multer
 */
exports.searchByImage = async (imageBuffer, filename, topK = 8) => {
  const form = new FormData();
  form.append('file', imageBuffer, { filename, contentType: 'image/jpeg' });

  const res = await fetch(`${ML_URL}/visual-search/by-image?top_k=${topK}`, {
    method:  'POST',
    body:    form,
    headers: form.getHeaders(),
    timeout: 8_000,
  });

  if (!res.ok) throw new Error(`Visual search error: ${await res.text()}`);
  return res.json();   // { results: [...], count: N }
};

/**
 * Pattern 2: Product detail page → "More like this".
 * No image upload needed — just the product ID.
 */
exports.searchByProductId = async (productId, topK = 6) => {
  const res = await fetch(
    `${ML_URL}/visual-search/by-product/${productId}?top_k=${topK}`,
    { timeout: 5_000 }
  );
  if (!res.ok) throw new Error(`Visual search error: ${await res.text()}`);
  return res.json();
};

/**
 * Pattern 3: Called from the product creation controller.
 * Adds the new product to the live index immediately.
 */
exports.indexNewProduct = async (product, imageBuffer, filename) => {
  const form = new FormData();
  form.append('file', imageBuffer, { filename });
  form.append('product_id',  product.id);
  form.append('name',        product.name);
  form.append('type',        product.type);
  form.append('base_price',  String(product.basePrice));

  const res = await fetch(`${ML_URL}/visual-search/add-product`, {
    method: 'POST', body: form, headers: form.getHeaders(), timeout: 15_000,
  });
  return res.ok;
};