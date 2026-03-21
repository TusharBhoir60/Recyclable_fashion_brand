// services/analytics.service.js

function getTotalRevenue(orders) {
  return orders.reduce((sum, o) => sum + o.totalPrice, 0);
}

module.exports = {
  getTotalRevenue
};