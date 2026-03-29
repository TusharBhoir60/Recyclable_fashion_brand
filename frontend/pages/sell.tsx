// @ts-nocheck
import Head from 'next/head';

export default function Sell() {
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
      <h1>List Your Item 🏷️</h1>
      <p>Turn your pre-loved clothing into cash and help the planet</p>
    </div>
  </div>
  <section className="section-sm">
    <div className="container">
      {/* How it works banner */}
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16, marginBottom: 36}}>
        <div style={{textAlign: 'center', padding: 20, background: 'var(--white)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)'}}>
          <div style={{fontSize: '1.8rem', marginBottom: 8}}>📸</div>
          <div style={{fontWeight: 700, color: 'var(--green-dark)'}}>1. Upload Photos</div>
          <div style={{fontSize: '.85rem', color: 'var(--text-muted)'}}>Add clear images of your item</div>
        </div>
        <div style={{textAlign: 'center', padding: 20, background: 'var(--white)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)'}}>
          <div style={{fontSize: '1.8rem', marginBottom: 8}}>✍️</div>
          <div style={{fontWeight: 700, color: 'var(--green-dark)'}}>2. Fill Details</div>
          <div style={{fontSize: '.85rem', color: 'var(--text-muted)'}}>Describe size, condition &amp; price</div>
        </div>
        <div style={{textAlign: 'center', padding: 20, background: 'var(--white)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)'}}>
          <div style={{fontSize: '1.8rem', marginBottom: 8}}>💰</div>
          <div style={{fontWeight: 700, color: 'var(--green-dark)'}}>3. Get Paid</div>
          <div style={{fontSize: '.85rem', color: 'var(--text-muted)'}}>Earn when your item sells</div>
        </div>
      </div>
      <div className="sell-layout">
        <form id="sell-form" className="card">
          <div className="card-header">
            <span className="card-title">Product Listing Form</span>
            <a href="/seller-dashboard" style={{fontSize: '.88rem', color: 'var(--green-mid)', fontWeight: 600}}>View Dashboard →</a>
          </div>
          {/* Image Upload */}
          <div id="upload-zone" className="upload-zone">
            <div className="upload-icon">📸</div>
            <p><strong>Click or drag</strong> to upload photos</p>
            <p style={{fontSize: '.82rem', marginTop: 6}}>JPG, PNG, WEBP · Up to 5 images · Max 5 MB each</p>
            <input type="file" id="product-images" multiple accept="image/*" style={{display: 'none'}} />
          </div>
          <div id="preview-strip" className="preview-strip" />
          <div className="form-group">
            <label className="form-label" htmlFor="title">Product Title <span style={{color: '#e53e3e'}}>*</span></label>
            <input className="form-control" type="text" id="title" name="title" placeholder="e.g. Levi's 501 Denim Jeans – Like New" required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="category">Category <span style={{color: '#e53e3e'}}>*</span></label>
              <select className="form-control" id="category" name="category" required>
                <option value>Select category</option>
                <option>Men's Clothing</option>
                <option>Women's Clothing</option>
                <option>Kids' Clothing</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="size">Size <span style={{color: '#e53e3e'}}>*</span></label>
              <select className="form-control" id="size" name="size" required>
                <option value>Select size</option>
                <option>XS</option><option>S</option><option>M</option>
                <option>L</option><option>XL</option><option>XXL</option>
                <option>Free Size</option><option>2-3Y</option><option>4-5Y</option>
                <option>6-7Y</option><option>8-9Y</option><option>10-12Y</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="condition">Condition <span style={{color: '#e53e3e'}}>*</span></label>
              <select className="form-control" id="condition" name="condition" required>
                <option value>Select condition</option>
                <option>Like New (9-10/10)</option>
                <option>Good (7-8/10)</option>
                <option>Fair (5-6/10)</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="brand">Brand (Optional)</label>
              <input className="form-control" type="text" id="brand" name="brand" placeholder="e.g. Zara, H&M, Fabindia" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="price">Selling Price (₹) <span style={{color: '#e53e3e'}}>*</span></label>
              <input className="form-control" type="number" id="price" name="price" placeholder="e.g. 499" min={50} required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="quantity">Quantity <span style={{color: '#e53e3e'}}>*</span></label>
              <input className="form-control" type="number" id="quantity" name="quantity" placeholder="e.g. 1" min={1} required />
              <span style={{fontSize: '.8rem', color: 'var(--text-muted)', marginTop: 4, display: 'block'}}>Quantity &gt;1 unlocks Bulk Discount</span>
            </div>
          </div>
          {/* Bulk Discount — shown via JS when qty > 1 */}
          <div id="bulk-field" className="bulk-field">
            <div className="bulk-title">🏷️ Bulk Discount (Optional)</div>
            <p style={{fontSize: '.88rem', color: 'var(--text-muted)', marginBottom: 14}}>Offer a discount when buyers purchase multiple units — attracts more buyers!</p>
            <div className="form-row">
              <div className="form-group" style={{marginBottom: 0}}>
                <label className="form-label">Minimum Quantity for Discount</label>
                <input className="form-control" type="number" name="bulk_min_qty" placeholder="e.g. 2" min={2} />
              </div>
              <div className="form-group" style={{marginBottom: 0}}>
                <label className="form-label">Discount Percentage (%)</label>
                <input className="form-control" type="number" name="bulk_discount" placeholder="e.g. 10" min={1} max={60} />
              </div>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="description">Description</label>
            <textarea className="form-control" id="description" name="description" rows={4} placeholder="Describe the item's style, fabric, any minor flaws, why you're selling it..." defaultValue={""} />
          </div>
          <div style={{display: 'flex', gap: 12, flexWrap: 'wrap'}}>
            <button type="submit" className="btn btn-primary btn-lg" style={{flex: 1}}>🚀 List Item for Sale</button>
            <a href="/seller-dashboard" className="btn btn-outline btn-lg">View Selled Items</a>
          </div>
        </form>
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
      <div className="footer-bottom"> 2025 GreenThreads. Made with for a greener planet.</div>
      <div className="footer-bottom">© 2025 GreenThreads. Made with 💚 for a greener planet.</div>
    </div>
  </footer>
</div>

    </>
  );
}
