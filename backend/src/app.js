require('dotenv').config();
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes');
const env = require('./config/env');
const app = express();

// Core middleware
app.use(cors({ origin: env.clientUrl }));
app.use(express.json());

// API routes
app.use('/api', apiRoutes);

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok', time: new Date() }));

// Global error handler
app.use((err, _req, res, _next) => {
  console.error('[error]', err.message);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

module.exports = app;