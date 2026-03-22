/**
 * Forecast Service — Feature 5
 */

const ML_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

async function getForecast(productType) {
  const res = await fetch(`${ML_URL}/forecast/${productType}`);
  if (!res.ok) throw new Error(`ML forecast error: ${await res.text()}`);
  return res.json();
  // { product_type, forecasts: [{ date, predicted, lower, upper }] }
}

module.exports = { getForecast };