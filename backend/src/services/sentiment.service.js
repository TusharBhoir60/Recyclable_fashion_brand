/**
 * Sentiment Service — Feature 3
 * Always call without await — fire-and-forget, never blocks a response.
 */

const prisma = require('../utils/prisma');
const env = require('../config/env');
const ML_URL = env.mlServiceUrl;

async function analyseAndStore(reviewId, text, productId = null) {
  try {
    const res = await fetch(`${ML_URL}/sentiment/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, run_aspects: true, product_id: productId }),
    });

    if (!res.ok) {
      console.error(`[sentiment] ML returned ${res.status}: ${await res.text()}`);
      return;
    }

    const data = await res.json();
    // Expected: { overall: {label, confidence}, aspects: {...}, summary?: string, product_id?: string }

    await prisma.review.update({
      where: { id: reviewId },
      data: {
        sentimentLabel: data.overall?.label ?? null,
        sentimentScore: data.overall?.confidence ?? null,
        sentimentAspects: data.aspects ?? {},
        sentimentSummary: data.summary ?? null,
        sentimentAnalyzed: true,
      },
    });
  } catch (err) {
    console.error(`[sentiment] Failed for review ${reviewId}:`, err.message);
  }
}

module.exports = { analyseAndStore };