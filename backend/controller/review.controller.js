// controllers/review.controller.js

const sentimentService = require('../services/sentiment.service');

exports.createReview = async (req, res, next) => {
  try {
    const review = await prisma.review.create({
      data: {
        productId: req.body.productId,
        userId:    req.user.id,
        text:      req.body.text,
        rating:    req.body.rating,
      },
    });

    res.status(201).json(review);

    // Async — runs after response is already sent
    sentimentService.analyzeReview(review.id, review.text, review.productId)
      .catch(err => console.error('Sentiment analysis failed:', err));

  } catch (err) { next(err); }
};