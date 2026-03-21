// services/sentiment.service.js

const fetch  = require('node-fetch');
const prisma = require('../utils/prisma');

const ML_URL = process.env.ML_SERVICE_URL;

/**
 * Called immediately when a user submits a review.
 * Runs async — doesn't block the review save response.
 */
exports.analyzeReview = async (reviewId, text, productId) => {
  const res = await fetch(`${ML_URL}/sentiment/analyze`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ text, product_id: productId, run_aspects: true }),
    timeout: 8_000,
  });

  if (!res.ok) throw new Error(`Sentiment error: ${await res.text()}`);
  const analysis = await res.json();

  // Persist the analysis alongside the review
  await prisma.review.update({
    where: { id: reviewId },
    data: {
      sentimentLabel:      analysis.overall.label,
      sentimentScore:      analysis.overall.confidence,
      sentimentAspects:    analysis.aspects,   // stored as JSON
      sentimentSummary:    analysis.summary,
      sentimentAnalyzed:   true,
    },
  });

  return analysis;
};

/**
 * Called nightly by a cron job to process older reviews.
 */
exports.backfillReviews = async () => {
  const unanalyzed = await prisma.review.findMany({
    where:  { sentimentAnalyzed: false },
    select: { id: true, text: true, productId: true },
    take:   100,
  });

  if (!unanalyzed.length) return;

  for (const review of unanalyzed) {
    await exports.analyzeReview(review.id, review.text, review.productId)
      .catch(err => console.error(`Review ${review.id} failed:`, err));
  }

  console.log(`Backfilled ${unanalyzed.length} reviews`);
};