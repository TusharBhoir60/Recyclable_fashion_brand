// @ts-nocheck
import Head from 'next/head';

export default function ProductDetail() {
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
        <a href="/shop" className="active">Shop</a>
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
  <section className="section-sm">
    <div className="container">
      {/* Breadcrumb */}
      <div style={{display: 'flex', alignItems: 'center', gap: 8, fontSize: '.88rem', color: 'var(--text-muted)', marginBottom: 32}}>
        <a href="/shop" style={{color: 'var(--green-mid)'}}>Shop</a> ›
        <span>Classic Denim Jacket</span>
      </div>
      <div className="product-detail-grid">
        {/* Images */}
        <div>
          <div className="main-img">
            <img id="main-img" src="https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5?w=800&q=80" alt="Classic Denim Jacket" />
          </div>
          <div className="thumb-strip">
            <div className="thumb active">
              <img src="https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5?w=200&q=80" alt="View 1" />
            </div>
            <div className="thumb">
              <img src="https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=200&q=80" alt="View 2" />
            </div>
            <div className="thumb">
              <img src="https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=200&q=80" alt="View 3" />
            </div>
            <div className="thumb">
              <img src="https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=200&q=80" alt="View 4" />
            </div>
          </div>
        </div>
        {/* Info */}
        <div className="product-detail-info">
          <div style={{display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 14}}>
            <span className="badge badge-recycled">♻️ Recycled</span>
            <span className="badge badge-new">✅ Verified</span>
          </div>
          <h1>Classic Denim Jacket</h1>
          <div className="product-price-row">
            <span className="detail-price">₹ 549</span>
            <span className="detail-original">₹ 1,299</span>
            <span className="detail-discount">57% off</span>
          </div>
          <div className="detail-meta">
            <span className="detail-meta-item">👤 Men</span>
            <span className="detail-meta-item">📦 In Stock: 3</span>
            <span className="detail-meta-item">🌟 Condition: Like New</span>
            <span className="detail-meta-item">🏷️ Brand: Levi's</span>
          </div>
          <p style={{color: 'var(--text-mid)', fontSize: '.97rem', lineHeight: '1.75', marginBottom: 24}}>
            A timeless classic denim jacket sourced from a responsible seller. This piece is in excellent condition with no visible wear, tears, or fading. Perfect for layering over tees or casual shirts. Pre-owned, thoroughly cleaned and quality-checked.
          </p>
          {/* Size */}
          <div className="size-select-group">
            <label className="form-label">Select Size</label>
            <div className="size-options">
              <button className="size-btn">XS</button>
              <button className="size-btn">S</button>
              <button className="size-btn active">M</button>
              <button className="size-btn">L</button>
              <button className="size-btn">XL</button>
            </div>
          </div>
          {/* Quantity */}
          <div className="qty-row">
            <label className="form-label" style={{margin: 0}}>Quantity</label>
            <div className="qty-control">
              <button className="qty-btn" id="qty-minus">−</button>
              <input className="qty-display" id="qty-display" type="text" defaultValue={1} readOnly />
              <button className="qty-btn" id="qty-plus">+</button>
            </div>
            <span style={{fontSize: '.85rem', color: 'var(--text-muted)'}}>3 available</span>
          </div>
          {/* Buttons */}
          <div className="detail-btns">
            <button className="btn btn-primary btn-lg" id="add-to-cart" style={{flex: 1}}>🛒 Add to Cart</button>
            <button className="btn btn-outline" id="add-to-wishlist" style={{padding: '16px 18px'}}>♡</button>
          </div>
          {/* Seller Info */}
          <div style={{marginTop: 28, padding: '18px 20px', background: 'var(--green-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 16}}>
            <div style={{width: 48, height: 48, borderRadius: '50%', background: 'var(--green-mid)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '1.1rem'}}>P</div>
            <div>
              <div style={{fontWeight: 700, fontSize: '.95rem'}}>Priya Sharma</div>
              <div style={{fontSize: '.82rem', color: 'var(--text-muted)'}}>⭐ 4.8 · 127 sales · Member since 2023</div>
            </div>
            <a href="#" className="btn btn-outline btn-sm" style={{marginLeft: 'auto'}}>View Seller</a>
          </div>
        </div>
      </div>
      {/* Description Tabs */}
      <div style={{marginTop: 56}}>
        <div style={{borderBottom: '2px solid var(--border)', display: 'flex', gap: 24, marginBottom: 28}}>
          <button style={{padding: '12px 4px', border: 'none', background: 'none', fontWeight: 700, color: 'var(--green-dark)', borderBottom: '2px solid var(--green-mid)', marginBottom: '-2px', cursor: 'pointer', fontSize: '.97rem'}}>Description</button>
          <button style={{padding: '12px 4px', border: 'none', background: 'none', fontWeight: 600, color: 'var(--text-muted)', cursor: 'pointer', fontSize: '.97rem'}}>Condition Notes</button>
          <button style={{padding: '12px 4px', border: 'none', background: 'none', fontWeight: 600, color: 'var(--text-muted)', cursor: 'pointer', fontSize: '.97rem'}}>Sustainability Impact</button>
        </div>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32}}>
          <div>
            <h3 style={{fontSize: '1rem', fontWeight: 700, color: 'var(--green-dark)', marginBottom: 10}}>Product Details</h3>
            <table style={{fontSize: '.9rem'}}>
              <tbody><tr><td style={{padding: '7px 0', color: 'var(--text-muted)', width: 140}}>Category</td><td style={{fontWeight: 600}}>Men's Outerwear</td></tr>
                <tr><td style={{padding: '7px 0', color: 'var(--text-muted)'}}>Brand</td><td style={{fontWeight: 600}}>Levi's</td></tr>
                <tr><td style={{padding: '7px 0', color: 'var(--text-muted)'}}>Material</td><td style={{fontWeight: 600}}>100% Cotton Denim</td></tr>
                <tr><td style={{padding: '7px 0', color: 'var(--text-muted)'}}>Condition</td><td style={{fontWeight: 600}}>Like New (9/10)</td></tr>
                <tr><td style={{padding: '7px 0', color: 'var(--text-muted)'}}>Available Qty</td><td style={{fontWeight: 600}}>3</td></tr>
                <tr><td style={{padding: '7px 0', color: 'var(--text-muted)'}}>Listed On</td><td style={{fontWeight: 600}}>10 Mar 2025</td></tr>
              </tbody></table>
          </div>
          <div style={{background: 'var(--green-bg)', borderRadius: 'var(--radius-md)', padding: 24, border: '1px solid var(--border)'}}>
            <h3 style={{fontSize: '1rem', fontWeight: 700, color: 'var(--green-dark)', marginBottom: 14}}>🌎 Your Impact</h3>
            <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 12}}><span style={{fontSize: '1.6rem'}}>💧</span><div><div style={{fontWeight: 700}}>7,500 L</div><div style={{fontSize: '.82rem', color: 'var(--text-muted)'}}>Water saved vs. buying new</div></div></div>
              <div style={{display: 'flex', alignItems: 'center', gap: 12}}><span style={{fontSize: '1.6rem'}}>☁️</span><div><div style={{fontWeight: 700}}>2.5 kg CO₂</div><div style={{fontSize: '.82rem', color: 'var(--text-muted)'}}>Carbon footprint avoided</div></div></div>
              <div style={{display: 'flex', alignItems: 'center', gap: 12}}><span style={{fontSize: '1.6rem'}}>🌱</span><div><div style={{fontWeight: 700}}>1 garment saved</div><div style={{fontSize: '.82rem', color: 'var(--text-muted)'}}>From landfill</div></div></div>
            </div>
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
      <div className="footer-bottom">© 2025 GreenThreads. Made with 💚 for a greener planet.</div>
    </div>
  </footer>
</div>

    </>
  );
}
