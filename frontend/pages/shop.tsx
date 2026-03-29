// @ts-nocheck
import Head from 'next/head';

export default function Shop() {
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
        <a href="/" className="btn btn-primary btn-sm" style={{marginLeft: 6}}>Logout</a>
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
      <h1>Shop Recycled Clothing</h1>
      <p>Discover pre-loved fashion at incredible prices</p>
    </div>
  </div>
  {/* SHOP LAYOUT */}
  <section className="section-sm">
    <div className="container">
      <div className="shop-layout">
        {/* FILTERS SIDEBAR */}
        <aside className="filters">
          <h3>🔍 Filters</h3>
          {/* Category */}
          <div className="filter-group">
            <label>Category</label>
            <label className="filter-option"><input type="checkbox" defaultChecked /> All Items</label>
            <label className="filter-option"><input type="checkbox" /> 👔 Men</label>
            <label className="filter-option"><input type="checkbox" /> 👗 Women</label>
            <label className="filter-option"><input type="checkbox" /> 🧒 Kids</label>
          </div>
          {/* Size */}
          <div className="filter-group">
            <label>Size</label>
            <label className="filter-option"><input type="checkbox" /> XS</label>
            <label className="filter-option"><input type="checkbox" defaultChecked /> S</label>
            <label className="filter-option"><input type="checkbox" defaultChecked /> M</label>
            <label className="filter-option"><input type="checkbox" /> L</label>
            <label className="filter-option"><input type="checkbox" /> XL</label>
            <label className="filter-option"><input type="checkbox" /> XXL</label>
          </div>
          {/* Condition */}
          <div className="filter-group">
            <label>Condition</label>
            <label className="filter-option"><input type="checkbox" defaultChecked /> Like New</label>
            <label className="filter-option"><input type="checkbox" defaultChecked /> Good</label>
            <label className="filter-option"><input type="checkbox" /> Fair</label>
          </div>
          {/* Price Range */}
          <div className="filter-group filter-range">
            <label>Price Range</label>
            <input type="range" id="price-range" min={0} max={5000} defaultValue={3000} />
            <div className="price-range-label">
              <span>₹0</span>
              <span id="price-label">₹3,000</span>
            </div>
          </div>
          <button className="btn btn-primary btn-block">Apply Filters</button>
          <button className="btn btn-outline btn-block" style={{marginTop: 10}}>Reset</button>
        </aside>
        {/* PRODUCTS GRID */}
        <div>
          {/* Sort Bar */}
          <div className="shop-header">
            <span className="shop-count">Showing <strong>48</strong> of 9,312 items</span>
            <select className="sort-select">
              <option>Sort: Newest First</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Best Match</option>
            </select>
          </div>
          <div className="product-grid">
            {/* Products list */}
            <a href="/product-detail" className="product-card">
              <div className="product-card__img">
                <img src="https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5?w=500&q=80" alt="Denim Jacket" />
                <div className="product-card__badge"><span className="badge badge-recycled">♻️ Recycled</span></div>
              </div>
              <div className="product-card__body">
                <div className="product-card__name">Classic Denim Jacket</div>
                <div className="product-card__meta"><span className="product-card__price">₹ 549</span><span className="product-card__condition">Like New • M</span></div>
                <button className="btn btn-primary btn-sm btn-block" onClick={(e) => { window.checkLoginAndAddToCart() }}>Add to Cart</button>
              </div>
            </a>
            <a href="/product-detail" className="product-card">
              <div className="product-card__img">
                <img src="https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500&q=80" alt="Floral Sundress" />
                <div className="product-card__badge"><span className="badge badge-recycled">♻️ Recycled</span></div>
              </div>
              <div className="product-card__body">
                <div className="product-card__name">Floral Sundress</div>
                <div className="product-card__meta"><span className="product-card__price">₹ 349</span><span className="product-card__condition">Good • S</span></div>
                <button className="btn btn-primary btn-sm btn-block" onClick={(e) => { window.checkLoginAndAddToCart() }}>Add to Cart</button>
              </div>
            </a>
            <a href="/product-detail" className="product-card">
              <div className="product-card__img">
                <img src="https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&q=80" alt="Striped T-Shirt" />
                <div className="product-card__badge"><span className="badge badge-recycled">♻️ Recycled</span></div>
              </div>
              <div className="product-card__body">
                <div className="product-card__name">Striped Cotton Tee</div>
                <div className="product-card__meta"><span className="product-card__price">₹ 199</span><span className="product-card__condition">Good • L</span></div>
                <button className="btn btn-primary btn-sm btn-block" onClick={(e) => { window.checkLoginAndAddToCart() }}>Add to Cart</button>
              </div>
            </a>
            <a href="/product-detail" className="product-card">
              <div className="product-card__img">
                <img src="https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=500&q=80" alt="Woollen Sweater" />
                <div className="product-card__badge"><span className="badge badge-recycled">♻️ Recycled</span></div>
              </div>
              <div className="product-card__body">
                <div className="product-card__name">Woollen Sweater</div>
                <div className="product-card__meta"><span className="product-card__price">₹ 699</span><span className="product-card__condition">Like New • M</span></div>
                <button className="btn btn-primary btn-sm btn-block" onClick={(e) => { window.checkLoginAndAddToCart() }}>Add to Cart</button>
              </div>
            </a>
            <a href="/product-detail" className="product-card">
              <div className="product-card__img">
                <img src="https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=500&q=80" alt="Chinos" />
                <div className="product-card__badge"><span className="badge badge-recycled">♻️ Recycled</span></div>
              </div>
              <div className="product-card__body">
                <div className="product-card__name">Slim Fit Chinos</div>
                <div className="product-card__meta"><span className="product-card__price">₹ 449</span><span className="product-card__condition">Good • 32</span></div>
                <button className="btn btn-primary btn-sm btn-block" onClick={(e) => { window.checkLoginAndAddToCart() }}>Add to Cart</button>
              </div>
            </a>
            <a href="/product-detail" className="product-card">
              <div className="product-card__img">
                <img src="https://images.unsplash.com/photo-1519278409-1f56fdda7fe5?w=500&q=80" alt="Kids Hoodie" />
                <div className="product-card__badge"><span className="badge badge-recycled">♻️ Recycled</span></div>
              </div>
              <div className="product-card__body">
                <div className="product-card__name">Kids Hoodie – Blue</div>
                <div className="product-card__meta"><span className="product-card__price">₹ 299</span><span className="product-card__condition">Like New • 4-5Y</span></div>
                <button className="btn btn-primary btn-sm btn-block" onClick={(e) => { window.checkLoginAndAddToCart() }}>Add to Cart</button>
              </div>
            </a>
            <a href="/product-detail" className="product-card">
              <div className="product-card__img">
                <img src="https://images.unsplash.com/photo-1514995669114-6081e934b693?w=500&q=80" alt="Kurta" />
                <div className="product-card__badge"><span className="badge badge-recycled">♻️ Recycled</span></div>
              </div>
              <div className="product-card__body">
                <div className="product-card__name">Cotton Kurta – Beige</div>
                <div className="product-card__meta"><span className="product-card__price">₹ 479</span><span className="product-card__condition">Good • XL</span></div>
                <button className="btn btn-primary btn-sm btn-block" onClick={(e) => { window.checkLoginAndAddToCart() }}>Add to Cart</button>
              </div>
            </a>
            <a href="/product-detail" className="product-card">
              <div className="product-card__img">
                <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&q=80" alt="Formal Blazer" />
                <div className="product-card__badge"><span className="badge badge-recycled">♻️ Recycled</span></div>
              </div>
              <div className="product-card__body">
                <div className="product-card__name">Women's Formal Blazer</div>
                <div className="product-card__meta"><span className="product-card__price">₹ 899</span><span className="product-card__condition">Like New • M</span></div>
                <button className="btn btn-primary btn-sm btn-block" onClick={(e) => { window.checkLoginAndAddToCart() }}>Add to Cart</button>
              </div>
            </a>
          </div>
          {/* Pagination */}
          <div style={{display: 'flex', justifyContent: 'center', gap: 8, marginTop: 48}}>
            <button className="btn btn-outline btn-sm" disabled>‹</button>
            <button className="btn btn-primary btn-sm">1</button>
            <button className="btn btn-outline btn-sm">2</button>
            <button className="btn btn-outline btn-sm">3</button>
            <span style={{padding: '8px 12px', color: 'var(--text-muted)'}}>…</span>
            <button className="btn btn-outline btn-sm">12</button>
            <button className="btn btn-outline btn-sm">›</button>
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
