/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: __dirname,
  },
  async rewrites() {
    return [
      { source: "/index.html", destination: "/" },
      { source: "/login.html", destination: "/login" },
      { source: "/signup.html", destination: "/signup" },
      { source: "/dashboard.html", destination: "/dashboard" },
      { source: "/shop.html", destination: "/shop" },
      { source: "/sell.html", destination: "/sell" },
      { source: "/orders.html", destination: "/orders" },
      { source: "/profile.html", destination: "/profile" },
      { source: "/cart.html", destination: "/cart" },
      { source: "/checkout.html", destination: "/checkout" },
      { source: "/seller-dashboard.html", destination: "/seller-dashboard" },
      { source: "/product-detail.html", destination: "/product-detail" },
      { source: "/admin/dashboard.html", destination: "/admin/dashboard" },
      { source: "/admin/manage-users.html", destination: "/admin/manage-users" },
      { source: "/admin/manage-products.html", destination: "/admin/manage-products" },
      { source: "/admin/manage-orders.html", destination: "/admin/manage-orders" },
      { source: "/admin/earnings.html", destination: "/admin/earnings" },
      { source: "/admin/reviews.html", destination: "/admin/reviews" }
    ];
  }
};

module.exports = nextConfig;
