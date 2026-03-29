// @ts-nocheck
import Head from 'next/head';

export default function AdminManageUsers() {
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
      <a href="/admin/manage-users" className="admin-nav-link active"><span className="nav-icon">👥</span><span>Users</span></a>
      <a href="/admin/manage-products" className="admin-nav-link"><span className="nav-icon">👕</span><span>Products</span></a>
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
        <h1>Manage Users</h1>
        <div className="admin-breadcrumb">Admin · Users Management</div>
      </div>
      <div className="admin-top-bar"><div className="admin-user-badge">🛡️ Super Admin</div></div>
    </div>
    {/* Stats */}
    <div className="admin-stats-grid" style={{gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))'}}>
      <div className="admin-stat-card"><div className="icon">👥</div><div className="value">12,480</div><div className="label">Total Users</div></div>
      <div className="admin-stat-card"><div className="icon">✅</div><div className="value">12,210</div><div className="label">Active</div></div>
      <div className="admin-stat-card"><div className="icon">🚫</div><div className="value">270</div><div className="label">Blocked</div></div>
      <div className="admin-stat-card"><div className="icon">🆕</div><div className="value">340</div><div className="label">New This Week</div></div>
    </div>
    <div className="card">
      <div className="card-header">
        <span className="card-title">All Users</span>
        <span style={{fontSize: '.85rem', color: 'var(--text-muted)'}}>12,480 registered users</span>
      </div>
      {/* Search */}
      <div className="search-bar">
        <input className="search-input" type="text" placeholder="Search by name or email…" />
        <select className="search-input" style={{flex: 0, width: 160}}>
          <option>All Users</option><option>Active</option><option>Blocked</option><option>Sellers</option>
        </select>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>#</th><th>Name</th><th>Email</th><th>Mobile</th>
              <th>Role</th><th>Joined</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td><td><strong>Priya Sharma</strong></td><td>priya@example.com</td><td>9876543210</td>
              <td><span style={{fontSize: '.8rem', background: '#e3f2fd', color: '#1565c0', padding: '3px 8px', borderRadius: 99, fontWeight: 700}}>Buyer</span></td>
              <td>10 Jan 2025</td>
              <td><span className="status-badge status-active">Active</span></td>
              <td><div className="action-btns"><button className="btn-block toggle-block">Block</button></div></td>
            </tr>
            <tr>
              <td>2</td><td><strong>Ananya Krishnan</strong></td><td>ananya@example.com</td><td>9812345678</td>
              <td><span style={{fontSize: '.8rem', background: '#e8f5e9', color: '#2e7d32', padding: '3px 8px', borderRadius: 99, fontWeight: 700}}>Seller</span></td>
              <td>5 Feb 2025</td>
              <td><span className="status-badge status-active">Active</span></td>
              <td><div className="action-btns"><button className="btn-block toggle-block">Block</button></div></td>
            </tr>
            <tr>
              <td>3</td><td><strong>Rajesh Kumar</strong></td><td>raj@example.com</td><td>9871234567</td>
              <td><span style={{fontSize: '.8rem', background: '#e3f2fd', color: '#1565c0', padding: '3px 8px', borderRadius: 99, fontWeight: 700}}>Buyer</span></td>
              <td>18 Feb 2025</td>
              <td><span className="status-badge status-blocked">Blocked</span></td>
              <td><div className="action-btns"><button className="btn-unblock toggle-block">Unblock</button></div></td>
            </tr>
            <tr>
              <td>4</td><td><strong>Meera Patel</strong></td><td>meera@example.com</td><td>9867891234</td>
              <td><span style={{fontSize: '.8rem', background: '#e8f5e9', color: '#2e7d32', padding: '3px 8px', borderRadius: 99, fontWeight: 700}}>Seller</span></td>
              <td>1 Mar 2025</td>
              <td><span className="status-badge status-active">Active</span></td>
              <td><div className="action-btns"><button className="btn-block toggle-block">Block</button></div></td>
            </tr>
            <tr>
              <td>5</td><td><strong>Vikram Singh</strong></td><td>vikram@example.com</td><td>9845678901</td>
              <td><span style={{fontSize: '.8rem', background: '#e3f2fd', color: '#1565c0', padding: '3px 8px', borderRadius: 99, fontWeight: 700}}>Buyer</span></td>
              <td>12 Mar 2025</td>
              <td><span className="status-badge status-active">Active</span></td>
              <td><div className="action-btns"><button className="btn-block toggle-block">Block</button></div></td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div style={{display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24}}>
        <button className="btn btn-outline btn-sm" disabled>‹</button>
        <button className="btn btn-primary btn-sm">1</button>
        <button className="btn btn-outline btn-sm">2</button>
        <button className="btn btn-outline btn-sm">3</button>
        <span style={{padding: '8px 12px', color: 'var(--text-muted)'}}>…</span>
        <button className="btn btn-outline btn-sm">125</button>
        <button className="btn btn-outline btn-sm">›</button>
      </div>
    </div>
  </main>
</div>

    </>
  );
}
