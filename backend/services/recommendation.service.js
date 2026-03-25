const { verifyToken } = require('./auth.middleware');

function recommendProducts(token, products) {
  const user = verifyToken(token);
  if (!user) return "Unauthorized ❌";

  // simple logic: return first product
  return products.slice(0, 1);
}

module.exports = {
  recommendProducts
};