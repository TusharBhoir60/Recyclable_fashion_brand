const ALLOWED_TYPES = ['BASIC', 'PREMIUM', 'CUSTOMIZED'];

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isNonNegativeNumber(value) {
  return Number.isFinite(Number(value)) && Number(value) >= 0;
}

function isNonNegativeInteger(value) {
  const num = Number(value);
  return Number.isInteger(num) && num >= 0;
}

function validateCreateProduct(req) {
  const { name, description, type, basePrice, stock } = req.body || {};
  const errors = [];

  if (!isNonEmptyString(name)) errors.push('name is required');
  if (!isNonEmptyString(description)) errors.push('description is required');
  if (!isNonEmptyString(type) || !ALLOWED_TYPES.includes(type.toUpperCase())) {
    errors.push('type must be one of BASIC, PREMIUM, CUSTOMIZED');
  }
  if (!isNonNegativeNumber(basePrice)) errors.push('basePrice must be a non-negative number');
  if (!isNonNegativeInteger(stock)) errors.push('stock must be a non-negative integer');

  return errors;
}

module.exports = { validateCreateProduct };
