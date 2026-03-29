// @ts-nocheck
import Head from 'next/head';

export default function Cart() {
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
        <a href="/cart" className="btn-nav nav-cart-icon active">🛒 <span className="cart-badge">3</span></a>
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
      <h1>Your Cart 🛒</h1>
      <p>Review your items before checkout</p>
    </div>
  </div>
  <section className="section-sm">
    <div className="container">
      <div className="cart-layout">
        {/* Cart Items */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Cart Items (3)</span>
            <a href="/shop" style={{fontSize: '.88rem', color: 'var(--green-mid)', fontWeight: 600}}>+ Add More</a>
          </div>
          {/* Item 1 */}
          <div className="cart-item">
            <div className="cart-item-img">
              <img src="https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5?w=200&q=80" alt="Denim Jacket" />
            </div>
            <div className="cart-item-info">
              <div className="cart-item-name">Classic Denim Jacket</div>
              <div className="cart-item-meta">Size: M &nbsp;|&nbsp; Condition: Like New &nbsp;|&nbsp; Seller: Priya S.</div>
              <div className="cart-item-actions">
                <div className="qty-control">
                  <button className="qty-btn" onClick={(e) => { window.changeQty(this,-1) }}>−</button>
                  <input className="qty-display" defaultValue={1} type="text" readOnly />
                  <button className="qty-btn" onClick={(e) => { window.changeQty(this,1) }}>+</button>
                </div>
                <span className="cart-item-price">₹ 549</span>
                <button className="remove-btn">🗑 Remove</button>
              </div>
            </div>
          </div>
          {/* Item 2 */}
          <div className="cart-item">
            <div className="cart-item-img">
              <img src="https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=200&q=80" alt="Floral Sundress" />
            </div>
            <div className="cart-item-info">
              <div className="cart-item-name">Floral Sundress</div>
              <div className="cart-item-meta">Size: S &nbsp;|&nbsp; Condition: Good &nbsp;|&nbsp; Seller: Ananya K.</div>
              <div className="cart-item-actions">
                <div className="qty-control">
                  <button className="qty-btn" onClick={(e) => { window.changeQty(this,-1) }}>−</button>
                  <input className="qty-display" defaultValue={1} type="text" readOnly />
                  <button className="qty-btn" onClick={(e) => { window.changeQty(this,1) }}>+</button>
                </div>
                <span className="cart-item-price">₹ 349</span>
                <button className="remove-btn">🗑 Remove</button>
              </div>
            </div>
          </div>
          {/* Item 3 */}
          <div className="cart-item">
            <div className="cart-item-img">
              <img src="https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=200&q=80" alt="Woollen Sweater" />
            </div>
            <div className="cart-item-info">
              <div className="cart-item-name">Woollen Sweater</div>
              <div className="cart-item-meta">Size: L &nbsp;|&nbsp; Condition: Like New &nbsp;|&nbsp; Seller: Ritu M.</div>
              <div className="cart-item-actions">
                <div className="qty-control">
                  <button className="qty-btn" onClick={(e) => { window.changeQty(this,-1) }}>−</button>
                  <input className="qty-display" defaultValue={1} type="text" readOnly />
                  <button className="qty-btn" onClick={(e) => { window.changeQty(this,1) }}>+</button>
                </div>
                <span className="cart-item-price">₹ 699</span>
                <button className="remove-btn">🗑 Remove</button>
              </div>
            </div>
          </div>
          {/* Eco impact */}
          <div style={{marginTop: 20, padding: 16, background: 'var(--green-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 16}}>
            <span style={{fontSize: '1.8rem'}}>🌍</span>
            <div>
              <div style={{fontWeight: 700, color: 'var(--green-dark)'}}>Your cart saves 7.5 kg CO₂</div>
              <div style={{fontSize: '.85rem', color: 'var(--text-muted)'}}>Compared to buying 3 new items — great choice!</div>
            </div>
          </div>
        </div>
        {/* Order Summary */}
        <div className="order-summary">
          <div className="card">
            <div className="card-header"><span className="card-title">Order Summary</span></div>
            <div className="promo-row">
              <input className="form-control promo-input" type="text" placeholder="Promo code" />
              <button className="btn btn-outline btn-sm">Apply</button>
            </div>
            <div className="summary-row"><span>Subtotal (3 items)</span><span>₹ 1,597</span></div>
            <div className="summary-row"><span>Delivery</span><span style={{color: 'var(--green-mid)', fontWeight: 700}}>FREE</span></div>
            <div className="summary-row"><span>Discount</span><span style={{color: '#e53e3e'}}>− ₹ 150</span></div>
            <div className="summary-row"><span>Platform Fee</span><span>₹ 29</span></div>
            <div className="summary-row total"><span>Total</span><span>₹ 1,476</span></div>
            <div style={{marginTop: 20, padding: 12, background: 'var(--green-pale)', borderRadius: 'var(--radius-sm)', fontSize: '.85rem', color: 'var(--green-dark)', fontWeight: 600, textAlign: 'center'}}>
              🎉 You saved ₹ 150 on this order!
            </div>
            <a href="/checkout" className="btn btn-primary btn-block btn-lg" style={{marginTop: 20}}>Proceed to Checkout →</a>
            <a href="/shop" className="btn btn-outline btn-block" style={{marginTop: 10}}>Continue Shopping</a>
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
