// @ts-nocheck
import Head from 'next/head';

export default function AdminManageProducts() {
  return (
    <>
      <Head>
        <title>Recycled Fashion</title>
      </Head>
      <div className="admin-layout">
  {/* SIDEBAR */}
  <aside className="admin-sidebar">
    <div className="admin-logo">
      <span className="leaf">🌿</span>
      <span>GreenThreads</span>
    </div>
    <nav className="admin-nav">
      <a href="/admin/dashboard" className="admin-nav-link"><span className="nav-icon">📊</span><span>Dashboard</span></a>
      <a href="/admin/manage-users" className="admin-nav-link"><span className="nav-icon">👥</span><span>Users</span></a>
      <a href="/admin/manage-products" className="admin-nav-link active"><span className="nav-icon">👕</span><span>Products</span></a>
      <a href="/admin/manage-orders" className="admin-nav-link"><span className="nav-icon">📦</span><span>Orders</span></a>
      <a href="/admin/earnings" className="admin-nav-link"><span className="nav-icon">💰</span><span>Earnings</span></a>
      <a href="/admin/reviews" className="admin-nav-link"><span className="nav-icon">⭐</span><span>Reviews</span></a>
      <a href="/" className="admin-nav-link" style={{color: 'rgba(255,100,100,.8)'}} onClick={(e) => { window.logout() }}><span className="nav-icon">🚪</span><span>Logout</span></a>
    </nav>
  </aside>
  {/* CONTENT */}
  <main className="admin-content">
    <div className="admin-header">
      <div>
        <h1>Manage Products</h1>
        <div className="admin-breadcrumb">Admin · Products Management</div>
      </div>
      <div className="admin-top-bar"><div className="admin-user-badge">🛡️ Super Admin</div></div>
    </div>
    {/* Stats */}
    <div className="admin-stats-grid" style={{gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))'}}>
      <div className="admin-stat-card"><div className="icon">👕</div><div className="value">45,230</div><div className="label">Total Listed</div></div>
      <div className="admin-stat-card"><div className="icon">✅</div><div className="value">42,810</div><div className="label">Approved</div></div>
      <div className="admin-stat-card"><div className="icon">⏳</div><div className="value">127</div><div className="label">Pending</div><div className="change" style={{color: '#e65100'}}>Action needed</div></div>
      <div className="admin-stat-card"><div className="icon">❌</div><div className="value">293</div><div className="label">Rejected</div></div>
    </div>
    <div className="card">
      <div className="card-header">
        <span className="card-title">All Products</span>
        <span style={{fontSize: '.85rem', color: 'var(--text-muted)'}}>45,230 listings</span>
      </div>
      {/* Search + Filter */}
      <div className="search-bar">
        <input className="search-input" type="text" placeholder="Search products…" />
        <select className="search-input" style={{flex: 0, width: 160}}>
          <option>All Status</option><option>Pending</option><option>Approved</option><option>Rejected</option>
        </select>
        <select className="search-input" style={{flex: 0, width: 140}}>
          <option>All Categories</option><option>Men's</option><option>Women's</option><option>Kids'</option>
        </select>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Product</th><th>Seller</th><th>Category</th>
              <th>Price</th><th>Qty</th><th>Status</th><th>Actions</th>
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
              <td>Priya S.</td><td>Men's</td><td>₹ 549</td><td>3</td>
              <td><span className="status-badge status-pending">⏳ Pending</span></td>
              <td>
                <div className="action-btns">
                  <button className="btn-approve approve-product">Approve</button>
                  <button className="btn-reject reject-product">Reject</button>
                  <button className="btn-del del-product">Delete</button>
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
              <td>Ananya K.</td><td>Women's</td><td>₹ 349</td><td>1</td>
              <td><span className="status-badge status-approved">✅ Approved</span></td>
              <td>
                <div className="action-btns">
                  <button className="btn-reject reject-product">Reject</button>
                  <button className="btn-del del-product">Delete</button>
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
              <td>Meera P.</td><td>Men's</td><td>₹ 699</td><td>5</td>
              <td><span className="status-badge status-pending">⏳ Pending</span></td>
              <td>
                <div className="action-btns">
                  <button className="btn-approve approve-product">Approve</button>
                  <button className="btn-reject reject-product">Reject</button>
                  <button className="btn-del del-product">Delete</button>
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
              <td>Vikram S.</td><td>Kids'</td><td>₹ 299</td><td>2</td>
              <td><span className="status-badge status-rejected">❌ Rejected</span></td>
              <td>
                <div className="action-btns">
                  <button className="btn-approve approve-product">Approve</button>
                  <button className="btn-del del-product">Delete</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>
</div>

    </>
  );
}
