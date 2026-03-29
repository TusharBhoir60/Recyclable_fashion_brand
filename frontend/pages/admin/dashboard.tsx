// @ts-nocheck
import Head from 'next/head';

export default function AdminDashboard() {
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
      <a href="/admin/dashboard" className="admin-nav-link active"><span className="nav-icon">📊</span><span>Dashboard</span></a>
      <a href="/admin/manage-users" className="admin-nav-link"><span className="nav-icon">👥</span><span>Users</span></a>
      <a href="/admin/manage-products" className="admin-nav-link"><span className="nav-icon">👕</span><span>Products</span></a>
      <a href="/admin/manage-orders" className="admin-nav-link"><span className="nav-icon">📦</span><span>Orders</span></a>
      <a href="/admin/earnings" className="admin-nav-link"><span className="nav-icon">💰</span><span>Earnings</span></a>
      <a href="/admin/reviews" className="admin-nav-link"><span className="nav-icon">⭐</span><span>Reviews</span></a>
      <a href="/" className="admin-nav-link" style={{marginTop: 'auto', color: 'rgba(255,100,100,.8)'}} onClick={(e) => { window.logout() }}><span className="nav-icon">🚪</span><span>Logout</span></a>
    </nav>
  </aside>
  {/* CONTENT */}
  <main className="admin-content">
    <div className="admin-header">
      <div>
        <h1>Dashboard Overview</h1>
        <div className="admin-breadcrumb">GreenThreads Admin · Welcome back, Admin</div>
      </div>
      <div className="admin-top-bar">
        <div className="admin-user-badge">🛡️ Super Admin</div>
      </div>
    </div>
    {/* Stats */}
    <div className="admin-stats-grid">
      <div className="admin-stat-card">
        <div className="icon">👥</div>
        <div className="value">12,480</div>
        <div className="label">Total Users</div>
        <div className="change">↑ +340 this week</div>
      </div>
      <div className="admin-stat-card">
        <div className="icon">👕</div>
        <div className="value">45,230</div>
        <div className="label">Total Products</div>
        <div className="change">↑ +1,200 this week</div>
      </div>
      <div className="admin-stat-card">
        <div className="icon">📦</div>
        <div className="value">8,940</div>
        <div className="label">Total Orders</div>
        <div className="change">↑ +530 this week</div>
      </div>
      <div className="admin-stat-card">
        <div className="icon">💰</div>
        <div className="value">₹ 62L</div>
        <div className="label">Platform Revenue</div>
        <div className="change">↑ +8% this month</div>
      </div>
      <div className="admin-stat-card">
        <div className="icon">⏳</div>
        <div className="value">127</div>
        <div className="label">Pending Approvals</div>
        <div className="change" style={{color: '#e65100'}}>Needs attention</div>
      </div>
      <div className="admin-stat-card">
        <div className="icon">🌍</div>
        <div className="value">1.2M kg</div>
        <div className="label">CO₂ Saved</div>
        <div className="change">↑ Platform impact</div>
      </div>
    </div>
    {/* Charts row */}
    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 28}}>
      <div className="card">
        <div className="card-header"><span className="card-title">Orders (Last 30 days)</span></div>
        <div className="chart-placeholder">
          <div className="chart-icon">📈</div>
          <div style={{fontWeight: 600}}>Chart: Orders trend</div>
          <div style={{fontSize: '.82rem'}}>(Connect to analytics API)</div>
        </div>
      </div>
      <div className="card">
        <div className="card-header"><span className="card-title">Revenue Breakdown</span></div>
        <div className="chart-placeholder">
          <div className="chart-icon">🥧</div>
          <div style={{fontWeight: 600}}>Chart: Revenue pie</div>
          <div style={{fontSize: '.82rem'}}>(Connect to analytics API)</div>
        </div>
      </div>
    </div>
    {/* Recent activity */}
    <div className="card">
      <div className="card-header">
        <span className="card-title">Recent Activity</span>
        <a href="/admin/manage-orders" style={{fontSize: '.88rem', color: 'var(--green-mid)', fontWeight: 600}}>View All →</a>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>User</th><th>Action</th><th>Item</th><th>Time</th><th>Status</th></tr></thead>
          <tbody>
            <tr><td>Priya S.</td><td>New Listing</td><td>Denim Jacket</td><td>5 min ago</td><td><span className="status-badge status-pending">Pending</span></td></tr>
            <tr><td>Ananya K.</td><td>Order Placed</td><td>Floral Dress</td><td>20 min ago</td><td><span className="status-badge status-approved">Confirmed</span></td></tr>
            <tr><td>Rohan M.</td><td>New Signup</td><td>—</td><td>1 hr ago</td><td><span className="status-badge status-active">Active</span></td></tr>
            <tr><td>Seller99</td><td>New Listing</td><td>Kids Hoodie</td><td>2 hr ago</td><td><span className="status-badge status-pending">Pending</span></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>
</div>

    </>
  );
}
