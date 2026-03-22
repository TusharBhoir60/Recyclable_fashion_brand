const orderService = require('../services/order.service');

async function createOrder(req, res, next) {
  try {
    const { items, shippingAddress } = req.body;
    const order = await orderService.createOrder({ userId: req.user.id, items, shippingAddress });
    res.status(201).json(order);
  } catch (err) { next(err); }
}

async function getUserOrders(req, res, next) {
  try {
    const orders = await orderService.getUserOrders(req.user.id);
    res.json(orders);
  } catch (err) { next(err); }
}

async function getOrderById(req, res, next) {
  try {
    const order = await orderService.getOrderById(req.params.id, req.user.id);
    res.json(order);
  } catch (err) { next(err); }
}

module.exports = { createOrder, getUserOrders, getOrderById };