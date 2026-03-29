// @ts-nocheck
import Head from 'next/head';

export default function SellerDashboard() {
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
        <a href="/sell" className="active">Sell</a>
        <a href="/orders">Orders</a>
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
      <h1>Seller Dashboard 📊</h1>
      <p>Track your listings, earnings, and performance</p>
    </div>
  </div>
  <section className="section-sm">
    <div className="container">
      {/* Stats */}
      <div className="stat-cards">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-label">Total Listings</div>
          <div className="stat-value">12</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-label">Sold Items</div>
          <div className="stat-value">47</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-label">Total Earnings</div>
          <div className="stat-value">₹ 18,240</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-label">Seller Rating</div>
          <div className="stat-value">4.8</div>
        </div>
      </div>
      {/* Manage Listings */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">My Listings</span>
          <a href="/sell" className="btn btn-primary btn-sm">+ List New Item</a>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                    <img src="https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5?w=60&q=80" alt style={{width: 42, height: 42, borderRadius: 6, objectFit: 'cover'}} />
                    <span style={{fontWeight: 600}}>Classic Denim Jacket</span>
                  </div>
                </td>
                <td>Men's</td><td>₹ 549</td><td>3</td>
                <td><span className="badge badge-recycled">✅ Active</span></td>
                <td>
                  <div style={{display: 'flex', gap: 6}}>
                    <button className="btn btn-outline btn-sm">✏️ Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={(e) => { window.deleteRow(this) }}>🗑 Delete</button>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                    <img src="https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=60&q=80" alt style={{width: 42, height: 42, borderRadius: 6, objectFit: 'cover'}} />
                    <span style={{fontWeight: 600}}>Floral Sundress</span>
                  </div>
                </td>
                <td>Women's</td><td>₹ 349</td><td>1</td>
                <td><span className="badge badge-recycled">✅ Active</span></td>
                <td>
                  <div style={{display: 'flex', gap: 6}}>
                    <button className="btn btn-outline btn-sm">✏️ Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={(e) => { window.deleteRow(this) }}>🗑 Delete</button>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                    <img src="https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=60&q=80" alt style={{width: 42, height: 42, borderRadius: 6, objectFit: 'cover'}} />
                    <span style={{fontWeight: 600}}>Woollen Sweater</span>
                  </div>
                </td>
                <td>Men's</td><td>₹ 699</td><td>5</td>
                <td><span className="badge" style={{background: '#fff3e0', color: '#e65100', border: '1px solid #ffcc80'}}>⏳ Pending</span></td>
                <td>
                  <div style={{display: 'flex', gap: 6}}>
                    <button className="btn btn-outline btn-sm">✏️ Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={(e) => { window.deleteRow(this) }}>🗑 Delete</button>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                    <img src="https://images.unsplash.com/photo-1519278409-1f56fdda7fe5?w=60&q=80" alt style={{width: 42, height: 42, borderRadius: 6, objectFit: 'cover'}} />
                    <span style={{fontWeight: 600}}>Kids Hoodie – Blue</span>
                  </div>
                </td>
                <td>Kids'</td><td>₹ 299</td><td>2</td>
                <td><span className="badge badge-recycled">✅ Active</span></td>
                <td>
                  <div style={{display: 'flex', gap: 6}}>
                    <button className="btn btn-outline btn-sm">✏️ Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={(e) => { window.deleteRow(this) }}>🗑 Delete</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      {/* Recent Sales */}
      <div className="card" style={{marginTop: 24}}>
        <div className="card-header"><span className="card-title">Recent Sales</span></div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Order ID</th><th>Product</th><th>Buyer</th><th>Amount</th><th>Status</th></tr>
            </thead>
            <tbody>
              <tr>
                <td style={{fontWeight: 600, color: 'var(--green-dark)'}}>#RW-2025-00842</td>
                <td>Classic Denim Jacket</td><td>Meera P.</td><td>₹ 549</td>
                <td><span className="badge badge-status-shipped">🚚 Shipped</span></td>
              </tr>
              <tr>
                <td style={{fontWeight: 600, color: 'var(--green-dark)'}}>#RW-2025-00719</td>
                <td>Woollen Sweater</td><td>Raj K.</td><td>₹ 699</td>
                <td><span className="badge badge-status-delivered">✅ Delivered</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>
  <footer className="footer">
    <div className="container">
      <div className="footer-grid">
        <div className="footer-brand">
          <a href="/" className="nav-logo"><span className="leaf">🌿</span> GreenThreads</a>
          <p>India's leading recycled clothing marketplace.</p>
        </div>
        <div className="footer-col"><h4>Shop</h4><a href="/shop">Men</a><a href="/shop">Women</a><a href="/shop">Kids</a></div>
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
