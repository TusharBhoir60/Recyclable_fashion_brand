import express from 'express';
import axios from 'axios';

const router = express.Router();
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';
const express = require("express");
const mlController = require("../controllers/ml.controller");
const ml = axios.create({
  baseURL: ML_SERVICE_URL,
  timeout: 12000,
});
router.post("/price", mlController.pricePredict);

// POST /api/ml/demand
router.post("/demand", mlController.demandForecast);

module.exports = router;
router.post('/price', async (req, res) => {
  try {
    const { data } = await ml.post('/api/price/predict', req.body);
    return res.status(200).json(data);
  } catch (err) {
    const status = err.response?.status || 500;
    return res.status(status).json({
      success: false,
      message: err.response?.data?.detail || err.response?.data?.message || 'ML price service failed',
    });
  }
});

router.post('/demand', async (req, res) => {
  try {
    const { data } = await ml.post('/api/demand/forecast', req.body);
    return res.status(200).json(data);
  } catch (err) {
    const status = err.response?.status || 500;
    return res.status(status).json({
      success: false,
      message: err.response?.data?.detail || err.response?.data?.message || 'ML demand service failed',
    });
  }
});

export default router;