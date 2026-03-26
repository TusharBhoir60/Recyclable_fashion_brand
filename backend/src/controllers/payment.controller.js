const paymentService = require('../services/payment.service');

async function initiatePayment(req, res, next) {
  try {
    const result = await paymentService.initiatePayment({
      orderId: req.body.orderId,
      userId:  req.user.id,
    });
    res.json(result);
  } catch (err) { next(err); }
}

async function verifyPayment(req, res, next) {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
    const order = await paymentService.verifyPayment({
      orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature,
      userId: req.user.id,
    });
    res.json({ success: true, order });
  } catch (err) { next(err); }
}

module.exports = { initiatePayment, verifyPayment };