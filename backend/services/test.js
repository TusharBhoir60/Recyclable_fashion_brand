const authService = require('./auth.service');
const productService = require('./product.service');
const orderService = require('./order.service');
const paymentService = require('./payment.service');
const recommendationService = require('./recommendation.service');
const analyticsService = require('./analytics.service');

// 1️⃣ Register User
const user = authService.register({
  name: "Jagravee",
  email: "j@gmail.com",
  password: "123"
});

console.log("User:", user);

// 2️⃣ Login → Get Token
const token = authService.login({
  email: "j@gmail.com",
  password: "123"
});
console.log("Token:", token);


// 3️⃣ Get Products (with token)
const products = productService.getAllProducts(token);
console.log("Products:", products);

// 4️⃣ Create Order (with token)
const order = orderService.createOrder(
  token,
  user.id,
  products[0],
  { text: true }
);

console.log("Order:", order);

// 5️⃣ Process Payment (with token)
const payment = paymentService.processPayment(
  token,
  order.id,
  order.totalPrice
);

console.log("Payment:", payment);

// 6️⃣ Get Recommendations (with token)
const recommended = recommendationService.recommendProducts(
  token,
  products
);

console.log("Recommended:", recommended);

// 7️⃣ Analytics (with token)
const revenue = analyticsService.getTotalRevenue(
  token,
  [order]
);

console.log("Revenue:", revenue);