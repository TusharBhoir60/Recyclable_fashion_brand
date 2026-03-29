/**
 * Recommender Service — Feature 6
 */

const env = require('../config/env');
const ML_URL = env.mlServiceUrl;

/**
 * @param {Object} params
 * @param {string} params.userId
 * @param {string} [params.segment='New']
 * @param {string[]} [params.boughtProductIds=[]]
 * @param {number} [params.topK=6]
 */
async function getRecommendations({ userId, segment = 'New', boughtProductIds = [], topK = 6 }) {
  const res = await fetch(`${ML_URL}/recommend/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id: userId,
      segment,
      bought_product_ids: boughtProductIds,
      top_k: topK,
    }),
  });

  if (!res.ok) throw new Error(`ML recommender error: ${await res.text()}`);

  const data = await res.json();
  // Expected: { recommendations: [...] }
  return data.recommendations ?? [];
}

module.exports = { getRecommendations };