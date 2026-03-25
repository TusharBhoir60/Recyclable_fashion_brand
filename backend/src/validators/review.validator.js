function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function validateCreateReview(req) {
  const { productId, text, rating } = req.body || {};
  const errors = [];

  if (!isNonEmptyString(productId)) errors.push('productId is required');
  if (!isNonEmptyString(text)) errors.push('text is required');

  const numericRating = Number(rating);
  if (!Number.isFinite(numericRating) || numericRating < 1 || numericRating > 5) {
    errors.push('rating must be a number between 1 and 5');
  }

  return errors;
}

module.exports = { validateCreateReview };
