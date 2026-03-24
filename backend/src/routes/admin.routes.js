const router    = require('express').Router();
const prisma    = require('../utils/prisma');
const auth      = require('../middleware/auth.middleware');
const isAdmin   = require('../middleware/isadmin.middleware');
const forecast  = require('../services/forecast.services');
const analytics = require('../services/analytics.service');

// Every admin route requires JWT + ADMIN role
router.use(auth, isAdmin);

/**
 * GET /api/admin/analytics
 * Dashboard overview — total users, orders, products, revenue
 */
router.get('/analytics', async (req, res, next) => {
  try {
    res.json(await analytics.getOverview());
  } catch (err) { next(err); }
});

/**
 * GET /api/admin/analytics/revenue?days=30
 */
router.get('/analytics/revenue', async (req, res, next) => {
  try {
    res.json(await analytics.getRevenueByDay(Number(req.query.days) || 30));
  } catch (err) { next(err); }
});

/**
 * GET /api/admin/analytics/segments
 */
router.get('/analytics/segments', async (req, res, next) => {
  try {
    res.json(await analytics.getSegmentBreakdown());
  } catch (err) { next(err); }
});

/**
 * GET /api/admin/analytics/orders
 */
router.get('/analytics/orders', async (req, res, next) => {
  try {
    res.json(await analytics.getOrdersByStatus());
  } catch (err) { next(err); }
});

/**
 * GET /api/admin/orders/all
 * Full order history for ML segmentation + forecasting jobs
 */
router.get('/orders/all', async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      where:   { status: { not: 'CANCELLED' } },
      select: {
        id: true, userId: true, totalAmount: true, status: true, createdAt: true,
        items: {
          select: {
            productId: true, quantity: true, unitPrice: true,
            product:   { select: { type: true } },
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
    res.json(orders);
  } catch (err) { next(err); }
});

/**
 * POST /api/admin/users/segments
 * ML write-back — bulk update customer segments
 * Body: { updates: [{ userId, segment }] }
 */
router.post('/users/segments', async (req, res, next) => {
  try {
    const { updates } = req.body;
    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({ error: 'updates array required' });
    }

    await prisma.$transaction(
      updates.map(({ userId, segment }) =>
        prisma.user.update({ where: { id: userId }, data: { segment } })
      )
    );

    res.json({ updated: updates.length });
  } catch (err) { next(err); }
});

/**
 * GET /api/admin/forecast/:type
 * 30-day demand forecast per product type (Feature 5)
 */
router.get('/forecast/:type', async (req, res, next) => {
  try {
    const type = req.params.type.toUpperCase();
    if (!['BASIC', 'PREMIUM', 'CUSTOMIZED'].includes(type)) {
      return res.status(400).json({ error: 'type must be BASIC, PREMIUM, or CUSTOMIZED' });
    }
    res.json(await forecast.getForecast(type));
  } catch (err) { next(err); }
});

/**
 * GET /api/admin/ml/review-queue
 * Low-confidence textile predictions awaiting admin label (Feature 1)
 */
router.get('/ml/review-queue', async (req, res, next) => {
  try {
    const queue = await prisma.mlReviewQueue.findMany({
      where:   { reviewed: false },
      orderBy: { createdAt: 'desc' },
    });
    res.json(queue);
  } catch (err) { next(err); }
});

/**
 * PATCH /api/admin/ml/review-queue/:id
 * Admin labels a flagged textile prediction
 * Body: { trueLabel: string }
 */
router.patch('/ml/review-queue/:id', async (req, res, next) => {
  try {
    const { trueLabel } = req.body;
    if (!trueLabel) return res.status(400).json({ error: 'trueLabel required' });

    const entry = await prisma.mlReviewQueue.update({
      where: { id: req.params.id },
      data:  { trueLabel, reviewed: true, reviewedAt: new Date() },
    });
    res.json(entry);
  } catch (err) { next(err); }
});

module.exports = router;