// services/payment.service.js

function processPayment(orderId, amount) {
  return {
    orderId,
    amount,
    status: "SUCCESS"
  };
}

module.exports = {
  processPayment
};