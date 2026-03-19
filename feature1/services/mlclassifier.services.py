// services/mlClassifier.service.js

const FormData = require('form-data');
const fetch    = require('node-fetch');
const prisma   = require('../utils/prisma');

const ML_URL = process.env.ML_SERVICE_URL; // e.g. https://recyclabag-ml.onrender.com

/**
 * Classify a textile image and optionally persist the result.
 * imageBuffer: Buffer from multer / Cloudinary download
 * filename:    original filename
 * batchId:     optional — group images from the same incoming textile shipment
 */
exports.classifyTextile = async (imageBuffer, filename, batchId = null) => {
  const form = new FormData();
  form.append('file', imageBuffer, { filename, contentType: 'image/jpeg' });

  const res = await fetch(`${ML_URL}/classify`, {
    method:  'POST',
    body:    form,
    headers: form.getHeaders(),
    timeout: 10_000,  // 10s timeout — fail fast
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`ML service error: ${err}`);
  }

  const prediction = await res.json();
  // prediction = { material, confidence, grade, route_to, all_probs, flag_for_review }

  // Persist to DB for audit trail and active learning
  await prisma.mlTextileClassification.create({
    data: {
      filename,
      batchId,
      material:   prediction.material,
      confidence: prediction.confidence,
      grade:      prediction.grade,
      routeTo:    prediction.route_to,
      allProbs:   prediction.all_probs,
      flagged:    prediction.flag_for_review,
    },
  });

  return prediction;
};

/**
 * Classify a whole batch (e.g. 20 photos of incoming shipment).
 * Returns a summary: how much is grade A, B, reject.
 */
exports.classifyBatch = async (files) => {
  const batchId = `batch_${Date.now()}`;

  const results = await Promise.all(
    files.map(f => exports.classifyTextile(f.buffer, f.originalname, batchId))
  );

  const summary = results.reduce((acc, r) => {
    acc[r.grade] = (acc[r.grade] || 0) + 1;
    return acc;
  }, { A: 0, B: 0, reject: 0 });

  return { batchId, results, summary };
};