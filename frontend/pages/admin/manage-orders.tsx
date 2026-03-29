// @ts-nocheck
import Head from 'next/head';

export default function AdminManageOrders() {
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
      <a href="/admin/manage-products" className="admin-nav-link"><span className="nav-icon">👕</span><span>Products</span></a>
      <a href="/admin/manage-orders" className="admin-nav-link active"><span className="nav-icon">📦</span><span>Orders</span></a>
      <a href="/admin/earnings" className="admin-nav-link"><span className="nav-icon">💰</span><span>Earnings</span></a>
      <a href="/admin/reviews" className="admin-nav-link"><span className="nav-icon">⭐</span><span>Reviews</span></a>
      <a href="/" className="admin-nav-link" style={{marginTop: 'auto', color: 'rgba(255,100,100,.8)'}} onClick={(e) => { window.logout() }}><span className="nav-icon">🚪</span><span>Logout</span></a>
    </nav>
  </aside>
  {/* CONTENT */}
  <main className="admin-content">
    <div className="admin-header">
      <div>
        <h1>Manage Orders</h1>
        <div className="admin-breadcrumb">Admin · Orders Management</div>
      </div>
      <div className="admin-top-bar"><div className="admin-user-badge">🛡️ Super Admin</div></div>
    </div>
    {/* Stats */}
    <div className="admin-stats-grid" style={{gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))'}}>
      <div className="admin-stat-card"><div className="icon">📦</div><div className="value">8,940</div><div className="label">Total Orders</div></div>
      <div className="admin-stat-card"><div className="icon">✔️</div><div className="value">3,210</div><div className="label">Confirmed</div></div>
      <div className="admin-stat-card"><div className="icon">🚚</div><div className="value">2,840</div><div className="label">Shipped</div></div>
      <div className="admin-stat-card"><div className="icon">✅</div><div className="value">2,580</div><div className="label">Delivered</div></div>
      <div className="admin-stat-card"><div className="icon">❌</div><div className="value">310</div><div className="label">Cancelled</div></div>
    </div>
    <div className="card">
      <div className="card-header">
        <span className="card-title">All Orders</span>
        <span style={{fontSize: '.85rem', color: 'var(--text-muted)'}}>8,940 orders</span>
      </div>
      {/* Search */}
      <div className="search-bar">
        <input className="search-input" type="text" placeholder="Search by Order ID or buyer name…" />
        <select className="search-input" style={{flex: 0, width: 180}}>
          <option>All Statuses</option><option>Confirmed</option>
          <option>Shipped</option><option>Delivered</option><option>Cancelled</option>
        </select>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Order ID</th><th>Buyer</th><th>Items</th><th>Total</th>
              <th>Date</th><th>Status</th><th>Update Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{fontWeight: 700, color: 'var(--green-dark)'}}>#RW-2025-00842</td>
              <td>Priya Sharma</td><td>3 items</td><td>₹ 1,476</td>
              <td>15 Mar 2025</td>
              <td><span className="status-badge status-active">🚚 Shipped</span></td>
              <td>
                <select className="search-input update-status" style={{width: 150, fontSize: '.82rem', padding: '5px 10px'}}>
                  <option>Confirmed</option>
                  <option selected>Shipped</option>
                  <option>Out for Delivery</option>
                  <option>Delivered</option>
                  <option>Cancelled</option>
                </select>
              </td>
            </tr>
            <tr>
              <td style={{fontWeight: 700, color: 'var(--green-dark)'}}>#RW-2025-00719</td>
              <td>Ananya K.</td><td>1 item</td><td>₹ 728</td>
              <td>2 Mar 2025</td>
              <td><span className="status-badge status-approved">✅ Delivered</span></td>
              <td>
                <select className="search-input update-status" style={{width: 150, fontSize: '.82rem', padding: '5px 10px'}}>
                  <option>Confirmed</option><option>Shipped</option>
                  <option>Out for Delivery</option>
                  <option selected>Delivered</option>
                  <option>Cancelled</option>
                </select>
              </td>
            </tr>
            <tr>
              <td style={{fontWeight: 700, color: 'var(--green-dark)'}}>#RW-2025-00901</td>
              <td>Rohan M.</td><td>2 items</td><td>₹ 228</td>
              <td>18 Mar 2025</td>
              <td><span className="status-badge status-pending">✔️ Confirmed</span></td>
              <td>
                <select className="search-input update-status" style={{width: 150, fontSize: '.82rem', padding: '5px 10px'}}>
                  <option selected>Confirmed</option><option>Shipped</option>
                  <option>Out for Delivery</option>
                  <option>Delivered</option><option>Cancelled</option>
                </select>
              </td>
            </tr>
            <tr>
              <td style={{fontWeight: 700, color: 'var(--green-dark)'}}>#RW-2025-00798</td>
              <td>Meera P.</td><td>1 item</td><td>₹ 899</td>
              <td>10 Mar 2025</td>
              <td><span className="status-badge status-approved">✅ Delivered</span></td>
              <td>
                <select className="search-input update-status" style={{width: 150, fontSize: '.82rem', padding: '5px 10px'}}>
                  <option>Confirmed</option><option>Shipped</option>
                  <option>Out for Delivery</option>
                  <option selected>Delivered</option>
                  <option>Cancelled</option>
                </select>
              </td>
            </tr>
            <tr>
              <td style={{fontWeight: 700, color: 'var(--green-dark)'}}>#RW-2025-00756</td>
              <td>Vikram S.</td><td>4 items</td><td>₹ 2,140</td>
              <td>8 Mar 2025</td>
              <td><span className="status-badge status-blocked">❌ Cancelled</span></td>
              <td>
                <select className="search-input update-status" style={{width: 150, fontSize: '.82rem', padding: '5px 10px'}}>
                  <option>Confirmed</option><option>Shipped</option>
                  <option>Out for Delivery</option>
                  <option>Delivered</option>
                  <option selected>Cancelled</option>
                </select>
              </td>
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
        <button className="btn btn-outline btn-sm">90</button>
        <button className="btn btn-outline btn-sm">›</button>
      </div>
    </div>
  </main>
</div>

    </>
  );
}
