// @ts-nocheck
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>Recycled Fashion</title>
      </Head>
      <div>
  {/* ── NAVBAR ── */}
  <nav className="navbar">
    <div className="container nav-inner">
      <a href="#shop-section" className="nav-logo" onClick={(e) => { window.scrollToSection('shop-section') }}><span className="leaf" />🌿 GreenThreads</a>
      <div className="nav-links">
        <a href="/">Home</a>
        <a href="#shop-section" onClick={(e) => { window.scrollToSection('shop-section') }}>Shop</a>
        <a href="#about-section" onClick={(e) => { window.scrollToSection('about-section') }}>About</a>
        <a href="/login" className="btn btn-primary btn-sm" onClick={() => { window.location.href = '/login'; }}>Login</a>
        <a href="/signup" className="btn btn-outline btn-sm" onClick={() => { window.location.href = '/signup'; }}>Sign Up</a>
      </div>
      <div className="hamburger" id="hamburger"><span /><span /><span /></div>
    </div>
    <div className="mobile-menu" id="mobile-menu">
      <a href="/">🏠 Home</a>
      <a href="#shop-section" onClick={(e) => { window.scrollToSection('shop-section') }}>🛍️ Shop</a>
      <a href="#about-section" onClick={(e) => { window.scrollToSection('about-section') }}>ℹ️ About</a>
      <a href="/login" onClick={() => { window.location.href = '/login'; }}>🔐 Login</a>
      <a href="/signup" onClick={() => { window.location.href = '/signup'; }}>📝 Sign Up</a>
    </div>
  </nav>
  {/* ── HERO ── */}
  <section className="hero">
    <div className="container hero-inner">
      <div className="hero-content">
        <div className="hero-tag">♻️ Sustainable Fashion Marketplace</div>
        <h1>Wear It Again.<br />Save the Planet.</h1>
        <p>Discover pre-loved clothing that looks amazing and fights fast fashion. Every purchase reduces waste and CO₂ emissions.</p>
        <div className="hero-btns">
          <a href="/login" className="btn btn-outline btn-lg" onClick={(e) => { window.checkLoginAndRedirect('login') }}>Shop Now</a>
          <a href="/login" className="btn btn-outline btn-lg" onClick={(e) => { window.checkLoginAndRedirect('login') }}>Start Selling</a>
        </div>
        <div className="hero-stats">
          <div><div className="hero-stat-num">50K+</div><div className="hero-stat-lbl">Eco Shoppers</div></div>
          <div><div className="hero-stat-num">200K+</div><div className="hero-stat-lbl">Items Listed</div></div>
          <div><div className="hero-stat-num">1.2M kg</div><div className="hero-stat-lbl">CO₂ Saved</div></div>
        </div>
      </div>
      <div className="hero-img">
        <img src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&q=80" alt="Sustainable fashion clothing rack" />
      </div>
    </div>
  </section>
  {/* ── CATEGORIES ── */}
  <section className="section" style={{background: 'var(--green-bg)'}} id="shop-section">
    <div className="container text-center">
      <h2 className="section-heading">Shop by Category</h2>
      <p className="section-sub">Curated recycled clothing for everyone in the family</p>
      <div className="cat-grid">
        <div className="cat-card">
          <img src="https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=600&q=80" alt="Men's clothing" className="cat-card__img" />
          <div className="cat-card__overlay">
            <div>
              <div className="cat-card__label">Men</div>
              <div className="cat-card__count">2,340 items</div>
            </div>
          </div>
        </div>
        <div className="cat-card">
          <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80" alt="Women's clothing" className="cat-card__img" />
          <div className="cat-card__overlay">
            <div>
              <div className="cat-card__label">Women</div>
              <div className="cat-card__count">5,102 items</div>
            </div>
          </div>
        </div>
        <div className="cat-card">
          <img src="https://images.unsplash.com/photo-1519278409-1f56fdda7fe5?w=600&q=80" alt="Kids' clothing" className="cat-card__img" />
          <div className="cat-card__overlay">
            <div>
              <div className="cat-card__label">Kids</div>
              <div className="cat-card__count">1,870 items</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  {/* ── FEATURED PRODUCTS ── */}
  <section className="section">
    <div className="container">
      <h2 className="section-heading text-center">Featured Items</h2>
      <p className="section-sub text-center">Hand-picked pre-loved fashion, quality verified</p>
      <div className="product-grid">
        {/* Card 1 */}
        <a href="/login" className="product-card">
          <div className="product-card__img">
            <img src="https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5?w=500&q=80" alt="Denim Jacket" />
            <div className="product-card__badge"><span className="badge badge-recycled">♻️ Recycled</span></div>
          </div>
          <div className="product-card__body">
            <div className="product-card__name">Classic Denim Jacket</div>
            <div className="product-card__meta">
              <span className="product-card__price">₹ 549</span>
              <span className="product-card__condition">Like New</span>
            </div>
            <button className="btn btn-primary btn-sm btn-block">Add to Cart</button>
          </div>
        </a>
        {/* Card 2 */}
        <a href="/login" className="product-card">
          <div className="product-card__img">
            <img src="https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500&q=80" alt="Floral Sundress" />
            <div className="product-card__badge"><span className="badge badge-recycled">♻️ Recycled</span></div>
          </div>
          <div className="product-card__body">
            <div className="product-card__name">Floral Sundress</div>
            <div className="product-card__meta">
              <span className="product-card__price">₹ 349</span>
              <span className="product-card__condition">Good</span>
            </div>
            <button className="btn btn-primary btn-sm btn-block">Add to Cart</button>
          </div>
        </a>
        {/* Card 3 */}
        <a href="/login" className="product-card">
          <div className="product-card__img">
            <img src="https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&q=80" alt="Striped T-Shirt" />
            <div className="product-card__badge"><span className="badge badge-recycled">♻️ Recycled</span></div>
          </div>
          <div className="product-card__body">
            <div className="product-card__name">Striped Cotton T-Shirt</div>
            <div className="product-card__meta">
              <span className="product-card__price">₹ 199</span>
              <span className="product-card__condition">Good</span>
            </div>
            <button className="btn btn-primary btn-sm btn-block">Add to Cart</button>
          </div>
        </a>
        {/* Card 4 */}
        <a href="/login" className="product-card">
          <div className="product-card__img">
            <img src="https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=500&q=80" alt="Woollen Sweater" />
            <div className="product-card__badge"><span className="badge badge-recycled">♻️ Recycled</span></div>
          </div>
          <div className="product-card__body">
            <div className="product-card__name">Woollen Sweater</div>
            <div className="product-card__meta">
              <span className="product-card__price">₹ 699</span>
              <span className="product-card__condition">Like New</span>
            </div>
            <button className="btn btn-primary btn-sm btn-block">Add to Cart</button>
          </div>
        </a>
      </div>
      <div className="text-center mt-8">
        <a href="/login" className="btn btn-outline btn-lg">View All Items</a>
      </div>
    </div>
  </section>
  {/* ── ABOUT ── */}
  <section className="section" id="about-section">
    <div className="container text-center">
      <h2 className="section-heading">About GreenThreads 🌿</h2>
      <p className="section-sub">Making fashion sustainable, one garment at a time</p>
      <div className="sustain-grid">
        <div className="sustain-card">
          <div className="sustain-icon">🌍</div>
          <h3>Reduce Carbon Footprint</h3>
          <p>Buying recycled clothing saves up to 70% of CO₂ compared to buying new. Small choices, big impact.</p>
        </div>
        <div className="sustain-card">
          <div className="sustain-icon">💧</div>
          <h3>Save Water</h3>
          <p>One pair of jeans takes 7,500 litres to produce. Pre-loved fashion keeps that water in nature.</p>
        </div>
        <div className="sustain-card">
          <div className="sustain-icon">♻️</div>
          <h3>Circular Economy</h3>
          <p>Clothes get a second, third, even fourth life. Less waste. More value. A truly circular closet.</p>
        </div>
      </div>
    </div>
  </section>
  <section className="section">
    <div className="container">
      {/* Mission Section */}
      <div className="about-mission">
        <div className="about-content">
          <h2>Our Mission 🌍</h2>
          <p>GreenThreads is on a mission to revolutionize the fashion industry by creating a sustainable marketplace for pre-loved clothing. We believe that every garment deserves a second chance, and every purchase can make a positive impact on our planet.</p>
          <div className="mission-stats">
            <div className="mission-stat">
              <div className="stat-icon">♻️</div>
              <div className="stat-content">
                <div className="stat-number">50,000+</div>
                <div className="stat-label">Active Users</div>
              </div>
            </div>
            <div className="mission-stat">
              <div className="stat-icon">👗</div>
              <div className="stat-content">
                <div className="stat-number">125,000+</div>
                <div className="stat-label">Items Recycled</div>
              </div>
            </div>
            <div className="mission-stat">
              <div className="stat-icon">💧</div>
              <div className="stat-content">
                <div className="stat-number">2.5M L</div>
                <div className="stat-label">Water Saved</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* How It Works */}
      <div className="about-section">
        <h2>How It Works 🔄</h2>
        <div className="works-grid">
          <div className="works-card">
            <div className="works-icon">📸</div>
            <h3>List Your Items</h3>
            <p>Take photos of your pre-loved clothes and list them on our platform. Set your price and describe the condition.</p>
          </div>
          <div className="works-card">
            <div className="works-icon">🛍️</div>
            <h3>Shop Sustainable</h3>
            <p>Browse thousands of recycled fashion items. Find unique pieces while reducing your environmental impact.</p>
          </div>
          <div className="works-card">
            <div className="works-icon">🤝</div>
            <h3>Connect &amp; Trade</h3>
            <p>Connect with eco-conscious buyers and sellers. Join the sustainable fashion movement.</p>
          </div>
        </div>
      </div>
      {/* Impact Section */}
      <div className="about-section">
        <h2>Environmental Impact 🌱</h2>
        <div className="impact-grid">
          <div className="impact-card">
            <div className="impact-icon">💧</div>
            <h3>Water Conservation</h3>
            <p>Every recycled t-shirt saves 2,700 liters of water - enough for one person to drink for 900 days.</p>
          </div>
          <div className="impact-card">
            <div className="impact-icon">⚡</div>
            <h3>Energy Savings</h3>
            <p>Recycling clothes uses 95% less energy than producing new garments from raw materials.</p>
          </div>
          <div className="impact-card">
            <div className="impact-icon">🗑️</div>
            <h3>Waste Reduction</h3>
            <p>Fashion accounts for 10% of global carbon emissions. We're helping reduce textile waste.</p>
          </div>
          <div className="impact-card">
            <div className="impact-icon">🌍</div>
            <h3>Carbon Footprint</h3>
            <p>Extending clothing life reduces CO₂ emissions by up to 82% compared to buying new.</p>
          </div>
        </div>
      </div>
      {/* Values Section */}
      <div className="about-section">
        <h2>Our Values 💚</h2>
        <div className="values-grid">
          <div className="value-card">
            <h3>🌿 Sustainability</h3>
            <p>We prioritize environmental impact in every decision, from packaging to platform operations.</p>
          </div>
          <div className="value-card">
            <h3>🤝 Community</h3>
            <p>Building a community of eco-conscious fashion lovers who support sustainable choices.</p>
          </div>
          <div className="value-card">
            <h3>💰 Affordability</h3>
            <p>Making sustainable fashion accessible to everyone through fair pricing and quality items.</p>
          </div>
          <div className="value-card">
            <h3>✨ Quality</h3>
            <p>Ensuring all listed items meet quality standards for a trustworthy marketplace.</p>
          </div>
        </div>
      </div>
      {/* Role Selection Modal */}
      <div className="role-modal" id="roleModal">
        <div className="role-modal-content">
          <div className="role-modal-header">
            <h3>Choose Your Account Type</h3>
            <button className="modal-close" onClick={(e) => { window.closeRoleModal() }}>×</button>
          </div>
          <div className="role-modal-body">
            <p>Select how you want to use GreenThreads:</p>
            <div className="role-options">
              <div className="role-option-card" onClick={(e) => { window.selectRoleAndRedirect('user') }}>
                <div className="role-icon">👤</div>
                <div className="role-info">
                  <h4>User Account</h4>
                  <p>Shop, sell, and manage your sustainable fashion journey</p>
                </div>
              </div>
              <div className="role-option-card" onClick={(e) => { window.selectRoleAndRedirect('admin') }}>
                <div className="role-icon">🛡️</div>
                <div className="role-info">
                  <h4>Admin Account</h4>
                  <p>Manage platform, users, and analytics</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ── FOOTER ── */}
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
              <a href="#">Blog</a>
              <a href="#">Contact</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2026 GreenThreads. Made with 💚 for a greener planet. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div></section></div>

    </>
  );
}
