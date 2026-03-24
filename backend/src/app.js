require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const authRoutes          = require('./routes/auth.routes');
const productRoutes       = require('./routes/product.routes');
const customizationRoutes = require('./routes/customization.routes');
const orderRoutes         = require('./routes/order.routes');
const paymentRoutes       = require('./routes/payment.routes');
const reviewRoutes        = require('./routes/review.routes');
const searchRoutes        = require('./routes/search.routes');
const adminRoutes         = require('./routes/admin.routes');

const app = express();

// ── Core middleware ──────────────────────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());

// ── API routes ───────────────────────────────────────────────────────────────
app.use('/api/auth',      authRoutes);
app.use('/api/products',  productRoutes);
app.use('/api/customize', customizationRoutes);
app.use('/api/orders',    orderRoutes);
app.use('/api/payments',  paymentRoutes);
app.use('/api/reviews',   reviewRoutes);
app.use('/api/search',    searchRoutes);
app.use('/api/admin',     adminRoutes);

// ── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok', time: new Date() }));

// ── Global error handler ─────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('[error]', err.message);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

module.exports = app;
