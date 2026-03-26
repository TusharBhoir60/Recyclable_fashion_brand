const cron = require('node-cron');
const env = require('../config/env');

const ML_URL      = env.mlServiceUrl;
const PORT        = env.port;
const BACKEND_URL = `http://localhost:${PORT}`;
const ADMIN_TOKEN = env.adminJwtToken;

/**
 * Weekly segmentation pipeline (Feature 4)
 * 1. Pull all order history from backend
 * 2. POST to ML service — triggers RFM computation + K-Means
 * 3. ML returns { updates: [{ userId, segment }] }
 * 4. Write segments back via admin endpoint
 */
async function runSegmentation() {
  console.log('[segmentation] Starting weekly run…');
  try {
    // Step 1 — fetch orders
    const ordersRes = await fetch(`${BACKEND_URL}/api/admin/orders/all`, {
      headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
    });
    if (!ordersRes.ok) throw new Error(`Orders fetch failed: ${ordersRes.status}`);
    const orders = await ordersRes.json();

    // Step 2 — call ML service
    const mlRes = await fetch(`${ML_URL}/segment`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ orders }),
    });
    if (!mlRes.ok) throw new Error(`ML segmentation failed: ${mlRes.status}`);
    const { updates } = await mlRes.json();

    // Step 3 — write segments back
    const writeRes = await fetch(`${BACKEND_URL}/api/admin/users/segments`, {
      method:  'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization:  `Bearer ${ADMIN_TOKEN}`,
      },
      body: JSON.stringify({ updates }),
    });
    if (!writeRes.ok) throw new Error(`Segment write-back failed: ${writeRes.status}`);

    console.log(`[segmentation] Done — ${updates.length} users updated.`);
  } catch (err) {
    console.error('[segmentation] Error:', err.message);
  }
}

function startJobs() {
  // Every Monday at 02:00 IST
  cron.schedule('0 2 * * 1', runSegmentation, { timezone: 'Asia/Kolkata' });
  console.log('[jobs] Segmentation cron scheduled — Mon 02:00 IST');
}

module.exports = { startJobs, runSegmentation };