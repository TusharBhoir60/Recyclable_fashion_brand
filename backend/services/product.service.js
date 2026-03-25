const { verifyToken } = require('./auth.middleware');

let products = [
  {
    id: 1,
    name: "T-Shirt Recycled Cotton",
    type: "basic",
    basePrice: 500,
    stock: 10
  },
  {
    id: 2,
    name: "Denim Jacket Upcycled",
    type: "premium",
    basePrice: 900,
    stock: 5
  }
];

// ✅ FIXED FUNCTION
function getAllProducts(token) {
  const user = verifyToken(token);
  if (!user) return "Unauthorized ❌";

  return products;
}

module.exports = {
  getAllProducts
};