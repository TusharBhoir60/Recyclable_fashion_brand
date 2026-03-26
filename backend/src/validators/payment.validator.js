function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function validateInitiatePayment(req) {
  const { orderId } = req.body || {};
  const errors = [];

  if (!isNonEmptyString(orderId)) errors.push('orderId is required');

  return errors;
}

function validateVerifyPayment(req) {
  const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body || {};
  const errors = [];

  if (!isNonEmptyString(orderId)) errors.push('orderId is required');
  if (!isNonEmptyString(razorpayOrderId)) errors.push('razorpayOrderId is required');
  if (!isNonEmptyString(razorpayPaymentId)) errors.push('razorpayPaymentId is required');
  if (!isNonEmptyString(razorpaySignature)) errors.push('razorpaySignature is required');

  return errors;
}

module.exports = { validateInitiatePayment, validateVerifyPayment };
