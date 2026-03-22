/**
 * Sentiment Service — Feature 3
 * Always call without await — fire-and-forget, never blocks a response.
 */

const prisma = require('../utils/prisma');
const ML_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

async function analyseAndStore(reviewId, text) {
  try {
    const res = await fetch(`${ML_URL}/sentiment/analyse`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ text }),
    });

    if (!res.ok) { console.error(`[sentiment] ML returned ${res.status}`); return; }

    const data = await res.json();
    // { overall: { label, confidence }, aspects: {...}, summary: string }

    await prisma.review.update({
      where: { id: reviewId },
      data: {
        sentimentLabel:    data.overall?.label,
        sentimentScore:    data.overall?.confidence,
        sentimentAspects:  data.aspects ?? {},
        sentimentSummary:  data.summary,
        sentimentAnalyzed: true,
      },
    });
  } catch (err) {
    console.error(`[sentiment] Failed for review ${reviewId}:`, err.message);
  }
}

module.exports = { analyseAndStore };