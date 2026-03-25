// services/order.service.js

const { verifyToken } = require('./auth.middleware');

let orders = [];

// 🔐 Create Order
function createOrder(token, userId, product, customization) {
  const user = verifyToken(token);
  if (!user) return "Unauthorized ❌";

  let totalPrice = product.basePrice;

  if (customization?.text) totalPrice += 100;
  if (customization?.image) totalPrice += 200;

  const order = {
    id: orders.length + 1,
    userId,
    product,
    customization,
    totalPrice,
    status: "PLACED"
  };

  orders.push(order);
  return order;
}

// 🔐 Get All Orders
function getAllOrders(token) {
  const user = verifyToken(token);
  if (!user) return "Unauthorized ❌";

  return orders;
}

module.exports = {
  createOrder,
  getAllOrders
};