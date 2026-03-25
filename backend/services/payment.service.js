const { verifyToken } = require('./auth.middleware');

function processPayment(token, orderId, amount) {
  const user = verifyToken(token);
  if (!user) return "Unauthorized ❌";

  return {
    paymentId: Date.now(),
    orderId,
    amount,
    status: "Success"
  };
}

module.exports = {
  processPayment
};