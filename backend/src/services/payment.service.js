const prisma = require('../utils/prisma');

// ================= INITIATE PAYMENT =================
async function initiatePayment(userId, orderId) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    throw Object.assign(new Error("Order not found"), { status: 404 });
  }

  if (order.userId !== userId) {
    throw Object.assign(new Error("Forbidden"), { status: 403 });
  }

  // Mock payment response
  return {
    orderId: order.id,
    paymentId: "mock_payment_" + Date.now(),
    amount: order.totalAmount,
    currency: "INR",
    status: "CREATED",
  };
}

// ================= VERIFY PAYMENT =================
async function verifyPayment({ orderId, userId }) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    throw Object.assign(new Error("Order not found"), { status: 404 });
  }

  if (order.userId !== userId) {
    throw Object.assign(new Error("Forbidden"), { status: 403 });
  }

  // Simulate successful payment
  return prisma.order.update({
    where: { id: orderId },
    data: {
      status: "PAID",
      paymentId: "mock_verified_" + Date.now(),
    },
  });
}

module.exports = { initiatePayment, verifyPayment };