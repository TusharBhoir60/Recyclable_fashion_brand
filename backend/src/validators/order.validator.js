function isPositiveInteger(value) {
  return Number.isInteger(value) && value > 0;
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function validateCreateOrder(req) {
  const { items, shippingAddress } = req.body || {};
  const errors = [];

  if (!Array.isArray(items) || items.length === 0) {
    errors.push('items must be a non-empty array');
  } else {
    items.forEach((item, index) => {
      if (!isNonEmptyString(item?.productId)) {
        errors.push(`items[${index}].productId is required`);
      }
      if (!isPositiveInteger(item?.quantity)) {
        errors.push(`items[${index}].quantity must be a positive integer`);
      }
      if (
        item?.customizationId !== undefined &&
        item?.customizationId !== null &&
        !isNonEmptyString(item.customizationId)
      ) {
        errors.push(`items[${index}].customizationId must be a non-empty string when provided`);
      }
    });
  }

  if (!shippingAddress || typeof shippingAddress !== 'object' || Array.isArray(shippingAddress)) {
    errors.push('shippingAddress must be an object');
  }

  return errors;
}

module.exports = { validateCreateOrder };
