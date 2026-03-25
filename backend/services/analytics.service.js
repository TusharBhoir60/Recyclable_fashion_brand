// services/analytics.service.js

const { verifyToken } = require('./auth.middleware');

function getTotalRevenue(token, orders) {
  // 🔐 Step 1: Verify token
  const user = verifyToken(token);

  if (!user) {
    return "Unauthorized ❌";
  }

  // 📊 Step 2: Calculate revenue
  const total = orders.reduce((sum, o) => {
    return sum + o.totalPrice;
  }, 0);

  return total;
}

module.exports = {
  getTotalRevenue
};