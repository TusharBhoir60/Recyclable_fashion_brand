// routes/search.routes.js
const router  = require('express').Router();
const multer  = require('multer');
const upload  = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10e6 } });
const { searchByImage, searchByProductId } = require('../services/visualSearch.service');

// GET /api/search/similar/:productId  →  "More like this" on product page
router.get('/similar/:productId', async (req, res, next) => {
  try {
    const { top_k = 6 } = req.query;
    const data = await searchByProductId(req.params.productId, +top_k);
    res.json(data);
  } catch (err) { next(err); }
});

// POST /api/search/image  →  Upload any photo, get similar bags
router.post('/image', upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image uploaded' });
    const { top_k = 8 } = req.query;
    const data = await searchByImage(req.file.buffer, req.file.originalname, +top_k);
    res.json(data);
  } catch (err) { next(err); }
});

module.exports = router;