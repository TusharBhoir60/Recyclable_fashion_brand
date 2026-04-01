// @ts-nocheck
import Head from 'next/head';

export default function Profile() {
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
        <a href="/profile" className="active">Profile</a>
        <a href="/cart" className="btn-nav nav-cart-icon">🛒 <span className="cart-badge">3</span></a>
        <a href="/" className="btn btn-outline btn-sm" onClick={(e) => { window.logout() }} style={{marginLeft: 6}}>Logout</a>
      </div>
      <div className="hamburger"><span /><span /><span /></div>
    </div>
    <div className="mobile-menu">
      <a href="/dashboard">📊 Dashboard</a>
      <a href="/shop">🛍️ Shop</a>
      <a href="/sell">💰 Sell</a>
      <a href="/profile">👤 Profile</a>
      <a href="/cart">🛒 Cart</a>
      <a href="/" onClick={(e) => { window.logout() }}>🔐 Logout</a>
    </div>
  </nav>
  {/* PAGE HEADER */}
  <div className="page-header">
    <div className="container">
      <h1>My Profile 👤</h1>
      <p>Manage your account details and preferences</p>
    </div>
  </div>
  <section className="section-sm">
    <div className="container">
      <div className="profile-layout">
        {/* Sidebar */}
        <div className="profile-sidebar card" style={{padding: 0, overflow: 'hidden'}}>
          <div className="profile-avatar-wrap">
            <div className="profile-avatar">P</div>
            <div className="profile-name">Priya Sharma</div>
            <div className="profile-email">priya@example.com</div>
            <div style={{fontSize: '.8rem', color: 'var(--green-mid)', marginTop: 6, fontWeight: 600}}>⭐ Eco Shopper · Member since 2023</div>
          </div>
          <nav className="profile-nav">
            <div className="profile-nav-link active"><span className="link-icon">👤</span> Account Details</div>
            <a href="/orders" className="profile-nav-link"><span className="link-icon">📦</span> My Orders</a>
            <a href="/sell" className="profile-nav-link"><span className="link-icon">🏷️</span> My Listings</a>
            <div className="profile-nav-link"><span className="link-icon">❤️</span> Wishlist</div>
            <div className="profile-nav-link"><span className="link-icon">📍</span> Saved Addresses</div>
            <div className="profile-nav-link"><span className="link-icon">🔔</span> Notifications</div>
            <div className="profile-nav-link"><span className="link-icon">🔒</span> Privacy &amp; Security</div>
            <div className="profile-nav-link" style={{color: '#e53e3e'}}><span className="link-icon">🚪</span> Logout</div>
          </nav>
        </div>
        {/* Main content */}
        <div style={{display: 'flex', flexDirection: 'column', gap: 24}}>
          {/* Green Impact Card */}
          <div style={{background: 'linear-gradient(135deg,var(--green-dark),var(--green-mid))', borderRadius: 'var(--radius-md)', padding: 28, color: '#fff', display: 'flex', gap: 32, flexWrap: 'wrap'}}>
            <div style={{flex: 1}}>
              <div style={{fontSize: '.85rem', opacity: '.75', marginBottom: 4}}>Your Eco Impact</div>
              <div style={{fontSize: '1.8rem', fontWeight: 800, marginBottom: 2}}>12.4 kg CO₂</div>
              <div style={{fontSize: '.85rem', opacity: '.8'}}>Saved by buying recycled</div>
            </div>
            <div style={{flex: 1, borderLeft: '1px solid rgba(255,255,255,.2)', paddingLeft: 32}}>
              <div style={{fontSize: '.85rem', opacity: '.75', marginBottom: 4}}>Garments Saved</div>
              <div style={{fontSize: '1.8rem', fontWeight: 800, marginBottom: 2}}>7</div>
              <div style={{fontSize: '.85rem', opacity: '.8'}}>Items given a second life</div>
            </div>
            <div style={{flex: 1, borderLeft: '1px solid rgba(255,255,255,.2)', paddingLeft: 32}}>
              <div style={{fontSize: '.85rem', opacity: '.75', marginBottom: 4}}>Money Saved</div>
              <div style={{fontSize: '1.8rem', fontWeight: 800, marginBottom: 2}}>₹ 4,200</div>
              <div style={{fontSize: '.85rem', opacity: '.8'}}>Vs. buying new</div>
            </div>
          </div>
          {/* Account Details */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Account Details</span>
              <button className="btn btn-outline btn-sm" id="edit-btn" onClick={(e) => { window.toggleEdit() }}>✏️ Edit</button>
            </div>
            <form id="profile-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className="form-control" type="text" defaultValue="Priya Sharma" disabled id="prof-name" />
                </div>
                <div className="form-group">
                  <label className="form-label">Mobile</label>
                  <input className="form-control" type="text" defaultValue={9876543210} disabled id="prof-phone" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-control" type="email" defaultValue="priya@example.com" disabled id="prof-email" />
              </div>
              <div className="form-group">
                <label className="form-label">Default Delivery Address</label>
                <textarea className="form-control" rows={2} disabled id="prof-addr" defaultValue={"Flat 4B, Green Residency, Bandra West, Mumbai – 400050"} />
              </div>
              <div id="save-btn-wrap" style={{display: 'none'}}>
                <button type="button" className="btn btn-primary" onClick={(e) => { window.saveProfile() }}>Save Changes</button>
                <button type="button" className="btn btn-outline" onClick={(e) => { window.toggleEdit() }} style={{marginLeft: 10}}>Cancel</button>
              </div>
            </form>
          </div>
          {/* Order History (mini) */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Recent Orders</span>
              <a href="/orders" style={{fontSize: '.88rem', color: 'var(--green-mid)', fontWeight: 600}}>View All →</a>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th><th>Date</th><th>Items</th><th>Total</th><th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{fontWeight: 600, color: 'var(--green-dark)'}}>#RW-2025-00842</td>
                    <td>15 Mar 2025</td><td>3 items</td><td>₹ 1,476</td>
                    <td><span className="badge badge-status-shipped">🚚 Shipped</span></td>
                  </tr>
                  <tr>
                    <td style={{fontWeight: 600, color: 'var(--green-dark)'}}>#RW-2025-00719</td>
                    <td>2 Mar 2025</td><td>1 item</td><td>₹ 728</td>
                    <td><span className="badge badge-status-delivered">✅ Delivered</span></td>
                  </tr>
                  <tr>
                    <td style={{fontWeight: 600, color: 'var(--green-dark)'}}>#RW-2025-00901</td>
                    <td>18 Mar 2025</td><td>2 items</td><td>₹ 228</td>
                    <td><span className="badge badge-status-confirmed">✔️ Confirmed</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
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
