// @ts-nocheck
import Head from 'next/head';

export default function Orders() {
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
        <a href="/dashboard">Dashboard</a>
        <a href="/shop">Shop</a>
        <a href="/sell">Sell</a>
        <a href="/orders" className="active">Orders</a>
        <a href="/profile">Profile</a>
        <a href="/cart" className="btn-nav nav-cart-icon">🛒 <span className="cart-badge">3</span></a>
        <a href="/" className="btn btn-outline btn-sm" onClick={(e) => { window.logout() }} style={{marginLeft: 6}}>Logout</a>
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
      <a href="/" onClick={(e) => { window.logout() }}>🔐 Logout</a>
    </div>
  </nav>
  {/* PAGE HEADER */}
  <div className="page-header">
    <div className="container">
      <h1>My Orders 📦</h1>
      <p>Track and manage all your purchases</p>
    </div>
  </div>
  <section className="section-sm">
    <div className="container" style={{maxWidth: 860}}>
      {/* Filter tabs */}
      <div style={{display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28}}>
        <button className="btn btn-outline btn-sm">All Orders</button>
        <button className="btn btn-outline btn-sm">Active</button>
        <button className="btn btn-outline btn-sm">Delivered</button>
        <button className="btn btn-outline btn-sm">Cancelled</button>
      </div>
      {/* Order 1 — Shipped */}
      <div className="order-card">
        <div className="order-card-header">
          <div>
            <div className="order-id">Order #RW-2025-00842</div>
            <div className="order-date">Placed: 15 Mar 2025 &nbsp;·&nbsp; 3 items</div>
          </div>
          <span className="badge badge-status-shipped">🚚 Shipped</span>
        </div>
        <div className="order-card-body">
          {/* Timeline */}
          <div className="timeline">
            <div className="tl-step done"><div className="tl-dot" /><div className="tl-label">Confirmed</div></div>
            <div className="tl-step done"><div className="tl-dot" /><div className="tl-label">Packed</div></div>
            <div className="tl-step done"><div className="tl-dot" /><div className="tl-label">Shipped</div></div>
            <div className="tl-step"><div className="tl-dot" /><div className="tl-label">Delivered</div></div>
          </div>
          <div style={{fontSize: '.85rem', color: 'var(--text-muted)', marginBottom: 16}}>📍 Expected delivery: <strong>19 Mar 2025</strong> &nbsp;·&nbsp; Tracking: IN827346501</div>
          <div className="order-items-list">
            <div className="order-item-row">
              <div className="order-item-img"><img src="https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5?w=120&q=80" alt="Denim Jacket" /></div>
              <div><div style={{fontWeight: 600}}>Classic Denim Jacket</div><div style={{fontSize: '.82rem', color: 'var(--text-muted)'}}>Size: M · ₹549</div></div>
            </div>
            <div className="order-item-row">
              <div className="order-item-img"><img src="https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=120&q=80" alt="Floral Sundress" /></div>
              <div><div style={{fontWeight: 600}}>Floral Sundress</div><div style={{fontSize: '.82rem', color: 'var(--text-muted)'}}>Size: S · ₹349</div></div>
            </div>
          </div>
        </div>
        <div className="order-footer">
          <span className="order-total">Total: ₹ 1,476</span>
          <div style={{display: 'flex', gap: 10}}>
            <button className="btn btn-outline btn-sm">Track Order</button>
            <a href="/product-detail" className="btn btn-primary btn-sm">Buy Again</a>
          </div>
        </div>
      </div>
      {/* Order 2 — Delivered */}
      <div className="order-card">
        <div className="order-card-header">
          <div>
            <div className="order-id">Order #RW-2025-00719</div>
            <div className="order-date">Placed: 2 Mar 2025 &nbsp;·&nbsp; 1 item</div>
          </div>
          <span className="badge badge-status-delivered">✅ Delivered</span>
        </div>
        <div className="order-card-body">
          <div className="timeline">
            <div className="tl-step done"><div className="tl-dot" /><div className="tl-label">Confirmed</div></div>
            <div className="tl-step done"><div className="tl-dot" /><div className="tl-label">Packed</div></div>
            <div className="tl-step done"><div className="tl-dot" /><div className="tl-label">Shipped</div></div>
            <div className="tl-step done"><div className="tl-dot" /><div className="tl-label">Delivered</div></div>
          </div>
          <div style={{fontSize: '.85rem', color: 'var(--green-mid)', marginBottom: 16, fontWeight: 600}}>✅ Delivered on 8 Mar 2025</div>
          <div className="order-items-list">
            <div className="order-item-row">
              <div className="order-item-img"><img src="https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=120&q=80" alt="Woollen Sweater" /></div>
              <div><div style={{fontWeight: 600}}>Woollen Sweater</div><div style={{fontSize: '.82rem', color: 'var(--text-muted)'}}>Size: L · ₹699</div></div>
            </div>
          </div>
        </div>
        <div className="order-footer">
          <span className="order-total">Total: ₹ 728</span>
          <div style={{display: 'flex', gap: 10}}>
            <button className="btn btn-outline btn-sm">⭐ Rate Product</button>
            <button className="btn btn-outline btn-sm">Return/Exchange</button>
          </div>
        </div>
      </div>
      {/* Order 3 — Confirmed */}
      <div className="order-card">
        <div className="order-card-header">
          <div>
            <div className="order-id">Order #RW-2025-00901</div>
            <div className="order-date">Placed: 18 Mar 2025 &nbsp;·&nbsp; 2 items</div>
          </div>
          <span className="badge badge-status-confirmed">✔️ Confirmed</span>
        </div>
        <div className="order-card-body">
          <div className="timeline">
            <div className="tl-step done"><div className="tl-dot" /><div className="tl-label">Confirmed</div></div>
            <div className="tl-step"><div className="tl-dot" /><div className="tl-label">Packed</div></div>
            <div className="tl-step"><div className="tl-dot" /><div className="tl-label">Shipped</div></div>
            <div className="tl-step"><div className="tl-dot" /><div className="tl-label">Delivered</div></div>
          </div>
          <div style={{fontSize: '.85rem', color: 'var(--text-muted)', marginBottom: 16}}>🕐 Being prepared by seller</div>
          <div className="order-items-list">
            <div className="order-item-row">
              <div className="order-item-img"><img src="https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=120&q=80" alt="Tee" /></div>
              <div><div style={{fontWeight: 600}}>Striped Cotton Tee</div><div style={{fontSize: '.82rem', color: 'var(--text-muted)'}}>Size: L · ₹199</div></div>
            </div>
          </div>
        </div>
        <div className="order-footer">
          <span className="order-total">Total: ₹ 228</span>
          <button className="btn btn-danger btn-sm">Cancel Order</button>
        </div>
      </div>
    </div>
  </section>
  <footer className="footer">
    <div className="container">
      <div className="footer-grid">
        <div className="footer-brand"><a href="/" className="nav-logo"><span className="leaf">🌿</span> GreenThreads</a><p>India's leading recycled clothing marketplace.</p></div>
        <div className="footer-col"><h4>Shop</h4><a href="/shop?cat=men">Men</a><a href="/shop?cat=women">Women</a><a href="/shop?cat=kids">Kids</a></div>
        <div className="footer-col"><h4>Sellers</h4><a href="/sell">List Item</a><a href="/seller-dashboard">Dashboard</a></div>
        <div className="footer-col"><h4>Company</h4><a href="#">About</a><a href="#">Blog</a><a href="#">Contact</a></div>
      </div>
      <div className="footer-bottom">© 2025 GreenThreads. Made with 💚 for a greener planet.</div>
    </div>
  </footer>
</div>

    </>
  );
}
