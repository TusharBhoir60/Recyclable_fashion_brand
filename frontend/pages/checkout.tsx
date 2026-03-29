// @ts-nocheck
import Head from 'next/head';

export default function Checkout() {
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
      <div className="breadcrumb"><a href="/cart">Cart</a><span className="breadcrumb-sep">›</span><span>Checkout</span></div>
      <h1>Checkout</h1>
      <p>Almost there! Complete your order below</p>
    </div>
  </div>
  <section className="section-sm">
    <div className="container">
      {/* Step Indicator */}
      <div className="step-indicator">
        <div className="step done"><div className="step-dot">✓</div><div className="step-label">Cart</div></div>
        <div className="step active"><div className="step-dot">2</div><div className="step-label">Delivery</div></div>
        <div className="step"><div className="step-dot">3</div><div className="step-label">Payment</div></div>
        <div className="step"><div className="step-dot">4</div><div className="step-label">Confirm</div></div>
      </div>
      <div className="checkout-layout">
        {/* Left: Form */}
        <div>
          {/* Delivery Address */}
          <div className="card" style={{marginBottom: 24}}>
            <div className="card-header"><span className="card-title">📍 Delivery Address</span></div>
            <form id="checkout-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="first-name">First Name</label>
                  <input className="form-control" type="text" id="first-name" placeholder="Priya" required />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="last-name">Last Name</label>
                  <input className="form-control" type="text" id="last-name" placeholder="Sharma" required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="co-phone">Phone Number</label>
                <input className="form-control" type="tel" id="co-phone" placeholder={9876543210} required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="addr-line1">Address Line 1</label>
                <input className="form-control" type="text" id="addr-line1" placeholder="House No. / Flat / Building" required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="addr-line2">Address Line 2 (Optional)</label>
                <input className="form-control" type="text" id="addr-line2" placeholder="Street / Area / Landmark" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="city">City</label>
                  <input className="form-control" type="text" id="city" placeholder="Mumbai" required />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="state">State</label>
                  <select className="form-control" id="state" required>
                    <option value>Select State</option>
                    <option>Maharashtra</option><option>Delhi</option><option>Karnataka</option>
                    <option>Tamil Nadu</option><option>Gujarat</option><option>Rajasthan</option>
                    <option>West Bengal</option><option>Telangana</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="pincode">PIN Code</label>
                <input className="form-control" type="text" id="pincode" placeholder={400001} maxLength={6} required />
              </div>
            </form>
          </div>
          {/* Payment */}
          <div className="card">
            <div className="card-header"><span className="card-title">💳 Payment Method</span></div>
            <div className="payment-options">
              <div className="payment-option selected"><span className="pay-icon">📱</span> UPI</div>
              <div className="payment-option"><span className="pay-icon">💳</span> Card</div>
              <div className="payment-option"><span className="pay-icon">🏦</span> Net Banking</div>
              <div className="payment-option"><span className="pay-icon">💵</span> Cash on Delivery</div>
            </div>
            {/* UPI */}
            <div style={{marginTop: 16, padding: 16, background: 'var(--green-bg)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)'}}>
              <label className="form-label">UPI ID</label>
              <input className="form-control" type="text" placeholder="yourname@upi" />
            </div>
          </div>
        </div>
        {/* Right: Summary */}
        <div>
          <div className="card" style={{marginBottom: 20}}>
            <div className="card-header"><span className="card-title">📦 Order Summary</span></div>
            {/* Items preview */}
            <div style={{display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '.9rem'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                  <img src="https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5?w=60&q=80" alt style={{width: 44, height: 44, borderRadius: 6, objectFit: 'cover'}} />
                  <span>Classic Denim Jacket × 1</span>
                </div>
                <span style={{fontWeight: 700}}>₹549</span>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '.9rem'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                  <img src="https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=60&q=80" alt style={{width: 44, height: 44, borderRadius: 6, objectFit: 'cover'}} />
                  <span>Floral Sundress × 1</span>
                </div>
                <span style={{fontWeight: 700}}>₹349</span>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '.9rem'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                  <img src="https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=60&q=80" alt style={{width: 44, height: 44, borderRadius: 6, objectFit: 'cover'}} />
                  <span>Woollen Sweater × 1</span>
                </div>
                <span style={{fontWeight: 700}}>₹699</span>
              </div>
            </div>
            <hr style={{border: 'none', borderTop: '1px solid var(--border)', marginBottom: 14}} />
            <div className="summary-row"><span>Subtotal</span><span>₹ 1,597</span></div>
            <div className="summary-row"><span>Delivery</span><span style={{color: 'var(--green-mid)', fontWeight: 700}}>FREE</span></div>
            <div className="summary-row"><span>Discount</span><span style={{color: '#e53e3e'}}>−₹ 150</span></div>
            <div className="summary-row"><span>Platform Fee</span><span>₹ 29</span></div>
            <div className="summary-row total"><span>Total</span><span>₹ 1,476</span></div>
          </div>
          <button className="btn btn-primary btn-block btn-lg" id="place-order">🎉 Place Order</button>
          <div style={{marginTop: 14, fontSize: '.8rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: '1.6'}}>
            🔒 Secured by SSL · 🔄 Easy Returns · ♻️ Every order plants a tree
          </div>
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
      <div className="footer-bottom">© 2026 GreenThreads. Made with 💚 for a greener planet.</div>
    </div>
  </footer>
</div>

    </>
  );
}
