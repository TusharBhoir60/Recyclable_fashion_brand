const Razorpay = require('razorpay');
const crypto   = require('crypto');
const prisma   = require('../utils/prisma');
const env      = require('../config/env');

const razorpay = new Razorpay({
  key_id:     env.razorpay.keyId,
  key_secret: env.razorpay.keySecret,
});

async function initiatePayment({ orderId, userId }) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order)                     throw Object.assign(new Error('Order not found'),    { status: 404 });
  if (order.userId !== userId)    throw Object.assign(new Error('Forbidden'),          { status: 403 });
  if (order.status !== 'PENDING') throw Object.assign(new Error('Order already paid'), { status: 400 });

  const rzpOrder = await razorpay.orders.create({
    amount:   Math.round(order.totalAmount * 100),
    currency: 'INR',
    receipt:  orderId,
  });

  await prisma.order.update({ where: { id: orderId }, data: { razorpayOrderId: rzpOrder.id } });

  return {
    razorpayOrderId: rzpOrder.id,
    amount:          rzpOrder.amount,
    currency:        rzpOrder.currency,
    keyId:           env.razorpay.keyId,
  };
}

async function verifyPayment({ orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature, userId }) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order)                  throw Object.assign(new Error('Order not found'), { status: 404 });
  if (order.userId !== userId) throw Object.assign(new Error('Forbidden'),       { status: 403 });

  const expected = crypto
    .createHmac('sha256', env.razorpay.keySecret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex');

  if (expected !== razorpaySignature) {
    throw Object.assign(new Error('Payment signature mismatch'), { status: 400 });
  }

  return prisma.order.update({
    where: { id: orderId },
    data:  { status: 'PAID', paymentId: razorpayPaymentId },
  });
}

module.exports = { initiatePayment, verifyPayment };