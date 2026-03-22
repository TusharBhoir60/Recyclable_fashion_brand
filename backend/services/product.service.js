// services/product.service.js

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

// 🔹 Get all products
function getAllProducts() {
  return products;
}

// 🔹 Get product by ID
function getProductById(id) {
  return products.find(p => p.id === id);
}

// 🔹 Add new product
function addProduct(product) {
  const newProduct = {
    id: products.length + 1,
    ...product
  };
  products.push(newProduct);
  return newProduct;
}

// 🔹 Calculate price (important for your project)
function calculatePrice(product, customization) {
  let price = product.basePrice;

  if (customization) {
    if (customization.text) price += 100;
    if (customization.image) price += 200;
  }

  return price;
}

module.exports = {
  getAllProducts,
  getProductById,
  addProduct,
  calculatePrice
};