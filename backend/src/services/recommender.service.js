/**
 * Recommender Service — Feature 6
 */

const env = require('../config/env');

const ML_URL = env.mlServiceUrl;

async function getRecommendations(userId, topK = 6) {
  const res = await fetch(`${ML_URL}/recommend/${userId}?top_k=${topK}`);
  if (!res.ok) throw new Error(`ML recommender error: ${await res.text()}`);
  const data = await res.json();
  return data.product_ids ?? [];
}

module.exports = { getRecommendations };