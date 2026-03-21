// services/order.service.js

let orders = [];

function createOrder(userId, product, customization) {
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

function getAllOrders() {
  return orders;
}

module.exports = {
  createOrder,
  getAllOrders
};