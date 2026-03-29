/**
 * Forecast Service — Feature 5
 */

const env = require('../config/env');
const ML_URL = env.mlServiceUrl;

async function getForecast(productType, horizon = 30) {
  const res = await fetch(`${ML_URL}/forecast/${productType}?horizon=${horizon}`);
  if (!res.ok) throw new Error(`ML forecast error: ${await res.text()}`);
  return res.json();
}

async function getAllForecasts(horizon = 30) {
  const res = await fetch(`${ML_URL}/forecast/?horizon=${horizon}`);
  if (!res.ok) throw new Error(`ML forecast(all) error: ${await res.text()}`);
  return res.json();
}

module.exports = { getForecast, getAllForecasts };