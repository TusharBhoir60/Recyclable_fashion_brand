const router       = require('express').Router();
const upload       = require('../middleware/upload.middleware');
const auth         = require('../middleware/auth.middleware');
const prisma       = require('../utils/prisma');
const visualSearch = require('../services/visualsearch.service');
const recommender  = require('../services/recommender.services');

/**
 * POST /api/search/image
 * Upload any photo → visually similar products (Feature 2)
 */
router.post('/image', upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image provided' });

    const topK    = Number(req.query.top_k) || 6;
    const results = await visualSearch.searchByImage(req.file.buffer, topK);

    const productIds = results.map(r => r.product_id);
    const products   = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
    });

    const map     = Object.fromEntries(products.map(p => [p.id, p]));
    const ordered = productIds
      .map(id => ({ ...map[id], score: results.find(r => r.product_id === id)?.score }))
      .filter(p => p.id);

    res.json(ordered);
  } catch (err) { next(err); }
});

/**
 * GET /api/search/similar/:productId
 * "More like this" on product detail page (Feature 2)
 */
router.get('/similar/:productId', async (req, res, next) => {
  try {
    const topK    = Number(req.query.top_k) || 6;
    const results = await visualSearch.findSimilar(req.params.productId, topK);

    const productIds = results.map(r => r.product_id);
    const products   = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
    });

    const map     = Object.fromEntries(products.map(p => [p.id, p]));
    const ordered = productIds
      .map(id => ({ ...map[id], score: results.find(r => r.product_id === id)?.score }))
      .filter(p => p.id);

    res.json(ordered);
  } catch (err) { next(err); }
});

/**
 * GET /api/search/recommendations
 * Personalised recommendations for logged-in user (Feature 6)
 */
router.get('/recommendations', auth, async (req, res, next) => {
  try {
    const topK       = Number(req.query.top_k) || 6;
    const productIds = await recommender.getRecommendations(req.user.id, topK);

    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
    });

    const map     = Object.fromEntries(products.map(p => [p.id, p]));
    const ordered = productIds.map(id => map[id]).filter(Boolean);

    res.json(ordered);
  } catch (err) { next(err); }
});

module.exports = router;