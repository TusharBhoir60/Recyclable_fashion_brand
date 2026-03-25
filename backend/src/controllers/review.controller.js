const prisma    = require('../utils/prisma');
const sentiment = require('../services/sentiment.service');

async function createReview(req, res, next) {
  try {
    const { productId, text, rating } = req.body;

    if (!productId || !text || !rating) {
      return res.status(400).json({ error: 'productId, text, and rating are required' });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const review = await prisma.review.create({
      data: { productId, userId: req.user.id, text, rating: Number(rating) },
    });

    // Fire-and-forget — never blocks the response
    sentiment.analyseAndStore(review.id, text);

    res.status(201).json(review);
  } catch (err) { next(err); }
}

async function getReviews(req, res, next) {
  try {
    const reviews = await prisma.review.findMany({
      where:   { productId: req.params.productId },
      include: { user: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(reviews);
  } catch (err) { next(err); }
}

module.exports = { createReview, getReviews };