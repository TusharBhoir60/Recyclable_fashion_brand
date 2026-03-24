/**
 * Recommender Service — Feature 6
 */

const ML_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

async function getRecommendations(userId, topK = 6) {
  const res = await fetch(`${ML_URL}/recommend/${userId}?top_k=${topK}`);
  if (!res.ok) throw new Error(`ML recommender error: ${await res.text()}`);
  const data = await res.json();
  return data.product_ids ?? [];
}

module.exports = { getRecommendations };