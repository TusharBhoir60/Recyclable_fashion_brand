const productService = require('./product.service');
const orderService = require('./order.service');
const authService = require('./auth.service');
const paymentService = require('./payment.service');
const recommendationService = require('./recommendation.service');
const analyticsService = require('./analytics.service');

// 1. Register user
const user = authService.register({
  name: "Jagravee",
  email: "j@gmail.com",
  password: "123"
});

console.log("User:", user);

// 2. Get products
const products = productService.getAllProducts();
console.log("Products:", products);

// 3. Create order
const order = orderService.createOrder(
  user.id,
  products[0],
  { text: true }
);

console.log("Order:", order);

// 4. Payment
const payment = paymentService.processPayment(order.id, order.totalPrice);
console.log("Payment:", payment);

// 5. Recommendation
const recommended = recommendationService.recommendProducts(products);
console.log("Recommended:", recommended);

// 6. Analytics
const revenue = analyticsService.getTotalRevenue([order]);
console.log("Revenue:", revenue);