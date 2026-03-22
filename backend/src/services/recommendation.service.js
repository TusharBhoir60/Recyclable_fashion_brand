// services/recommendation.service.js

function recommendProducts(products) {
  return products.slice(0, 2); // simple logic
}

module.exports = {
  recommendProducts
};