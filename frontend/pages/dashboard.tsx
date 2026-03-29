// @ts-nocheck
import Head from 'next/head';

export default function Dashboard() {
  return (
    <>
      <Head>
        <title>Recycled Fashion</title>
      </Head>
      <div>
  {/* NAVBAR */}
  <nav className="navbar">
    <div className="container nav-inner">
      <a href="/" className="nav-logo"><span className="leaf">🌿</span> GreenThreads</a>
      <div className="nav-links">
        <a href="/dashboard" className="active">Dashboard</a>
        <a href="/shop">Shop</a>
        <a href="/sell">Sell</a>
        <a href="/orders">Orders</a>
        <a href="/profile">Profile</a>
        <a href="/cart" className="btn-nav nav-cart-icon">🛒 <span className="cart-badge">0</span></a>
        <a href="/" onClick={(e) => { window.logout() }} className="btn btn-outline btn-sm" style={{marginLeft: 6}}>Logout</a>
      </div>
      <div className="hamburger"><span /><span /><span /></div>
    </div>
    <div className="mobile-menu">
      <a href="/dashboard">📊 Dashboard</a>
      <a href="/shop">🛍️ Shop</a>
      <a href="/sell">💰 Sell</a>
      <a href="/orders">📦 Orders</a>
      <a href="/profile">👤 Profile</a>
      <a href="/cart">🛒 Cart</a>
      <a href="/" onClick={(e) => { window.logout() }}>🚪 Logout</a>
    </div>
  </nav>
  {/* PAGE HEADER */}
  <div className="page-header">
    <div className="container">
      <h1>My Dashboard 📊</h1>
      <p>Manage your account and track your sustainable fashion impact</p>
    </div>
  </div>
  <section className="section-sm">
    <div className="container">
      {/* Main Content */}
      <main className="dashboard-main">
        {/* Welcome Section */}
        <div className="dashboard-welcome card">
          <h2 id="welcome-message">Welcome back! 👋</h2>
          <p>Here's your sustainable fashion journey at a glance.</p>
        </div>
        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🛒</div>
            <div className="stat-content">
              <div className="stat-number">3</div>
              <div className="stat-label">Items in Cart</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-content">
              <div className="stat-number">12</div>
              <div className="stat-label">Orders Placed</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <div className="stat-number">5</div>
              <div className="stat-label">Items Sold</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">♻️</div>
            <div className="stat-content">
              <div className="stat-number">8</div>
              <div className="stat-label">Items Recycled</div>
            </div>
          </div>
        </div>
        {/* Recent Activity */}
        <div className="dashboard-section">
          <h3>Recent Activity</h3>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon">🛒</div>
              <div className="activity-content">
                <div className="activity-title">Added "Classic Denim Jacket" to cart</div>
                <div className="activity-time">2 hours ago</div>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">📦</div>
              <div className="activity-content">
                <div className="activity-title">Order #1234 - Shipped</div>
                <div className="activity-time">Yesterday</div>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">💰</div>
              <div className="activity-content">
                <div className="activity-title">Listed "Cotton T-Shirt" for sale</div>
                <div className="activity-time">3 days ago</div>
              </div>
            </div>
          </div>
        </div>
        {/* Quick Actions */}
        <div className="dashboard-section">
          <h3>Quick Actions</h3>
          <div className="quick-actions">
            <a href="/shop" className="action-card">
              <div className="action-icon">🛍️</div>
              <div className="action-title">Browse Shop</div>
              <div className="action-desc">Discover recycled fashion</div>
            </a>
            <a href="/sell" className="action-card">
              <div className="action-icon">💰</div>
              <div className="action-title">Sell Items</div>
              <div className="action-desc">List your pre-loved clothes</div>
            </a>
            <a href="/orders" className="action-card">
              <div className="action-icon">📦</div>
              <div className="action-title">View Orders</div>
              <div className="action-desc">Track your purchases</div>
            </a>
            <a href="/profile" className="action-card">
              <div className="action-icon">👤</div>
              <div className="action-title">Edit Profile</div>
              <div className="action-desc">Update your information</div>
            </a>
          </div>
        </div>
      </main>
    </div>
  </section>
  {/* FOOTER */}
  <footer className="footer">
    <div className="container">
      <div className="footer-grid">
        <div className="footer-brand">
          <a href="/" className="nav-logo"><span className="leaf">🌿</span> GreenThreads</a>
          <p>India's leading recycled clothing marketplace. Shop sustainably, sell easily, and make a difference.</p>
        </div>
        <div className="footer-col">
          <h4>Shop</h4>
          <a href="/shop?cat=men">Men's Clothing</a>
          <a href="/shop?cat=women">Women's Clothing</a>
          <a href="/shop?cat=kids">Kids' Clothing</a>
          <a href="/shop">All Items</a>
        </div>
        <div className="footer-col">
          <h4>Sellers</h4>
          <a href="/sell">List an Item</a>
          <a href="/seller-dashboard">Seller Dashboard</a>
          <a href="#">Seller Guide</a>
          <a href="#">Pricing</a>
        </div>
        <div className="footer-col">
          <h4>Company</h4>
          <a href="#">About Us</a>
          <a href="#">Our Mission</a>
          <a href="#">Contact</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 GreenThreads. Made with 💚 for a greener planet. All rights reserved.</p>
      </div>
    </div>
  </footer>
</div>

    </>
  );
}
