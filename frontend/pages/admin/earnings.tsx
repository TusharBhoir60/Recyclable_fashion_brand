// @ts-nocheck
import Head from 'next/head';

export default function AdminEarnings() {
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
      <a href="/admin/manage-orders" className="admin-nav-link"><span className="nav-icon">📦</span><span>Orders</span></a>
      <a href="/admin/earnings" className="admin-nav-link active"><span className="nav-icon">💰</span><span>Earnings</span></a>
      <a href="/admin/reviews" className="admin-nav-link"><span className="nav-icon">⭐</span><span>Reviews</span></a>
      <a href="/" className="admin-nav-link" style={{marginTop: 'auto', color: 'rgba(255,100,100,.8)'}} onClick={(e) => { window.logout() }}><span className="nav-icon">🚪</span><span>Logout</span></a>
    </nav>
  </aside>
  {/* CONTENT */}
  <main className="admin-content">
    <div className="admin-header">
      <div>
        <h1>Earnings &amp; Revenue</h1>
        <div className="admin-breadcrumb">GreenThreads Admin · Financial Overview</div>
      </div>
      <div className="admin-top-bar">
        <div className="admin-user-badge">🛡️ Super Admin</div>
      </div>
    </div>
    {/* Revenue Stats */}
    <div className="admin-stats-grid">
      <div className="admin-stat-card">
        <div className="icon">💰</div>
        <div className="value">₹ 62.4L</div>
        <div className="label">Total Revenue</div>
        <div className="change">↑ +12% this month</div>
      </div>
      <div className="admin-stat-card">
        <div className="icon">💵</div>
        <div className="value">₹ 8.7L</div>
        <div className="label">Commission Earned</div>
        <div className="change">↑ +8% this month</div>
      </div>
      <div className="admin-stat-card">
        <div className="icon">📦</div>
        <div className="value">₹ 53.7L</div>
        <div className="label">Seller Payouts</div>
        <div className="change">↑ +15% this month</div>
      </div>
      <div className="admin-stat-card">
        <div className="icon">🧾</div>
        <div className="value">₹ 2.1L</div>
        <div className="label">Pending Payouts</div>
        <div className="change" style={{color: '#e65100'}}>Processing</div>
      </div>
    </div>
    {/* Revenue Chart */}
    <div className="card" style={{marginBottom: 24}}>
      <div className="card-header">
        <span className="card-title">Revenue Trend (Last 6 Months)</span>
        <select className="sort-select" style={{width: 'auto'}}>
          <option>Last 6 Months</option>
          <option>Last 3 Months</option>
          <option>Last Year</option>
        </select>
      </div>
      <div className="chart-placeholder">
        <div className="chart-icon">📈</div>
        <div style={{fontWeight: 600}}>Revenue Growth Chart</div>
        <div style={{fontSize: '.82rem'}}>(Connect to analytics API)</div>
      </div>
    </div>
    {/* Recent Transactions */}
    <div className="card">
      <div className="card-header">
        <span className="card-title">Recent Transactions</span>
        <button className="btn btn-primary btn-sm">Export CSV</button>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Order ID</th>
              <th>Seller</th>
              <th>Order Amount</th>
              <th>Commission (15%)</th>
              <th>Seller Payout</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>18 Mar 2025</td>
              <td style={{fontWeight: 600, color: 'var(--green-dark)'}}>#RW-2025-00842</td>
              <td>Priya S.</td>
              <td>₹ 1,476</td>
              <td>₹ 221</td>
              <td>₹ 1,255</td>
              <td><span className="status-badge status-approved">Completed</span></td>
            </tr>
            <tr>
              <td>18 Mar 2025</td>
              <td style={{fontWeight: 600, color: 'var(--green-dark)'}}>#RW-2025-00841</td>
              <td>Rahul M.</td>
              <td>₹ 899</td>
              <td>₹ 135</td>
              <td>₹ 764</td>
              <td><span className="status-badge status-approved">Completed</span></td>
            </tr>
            <tr>
              <td>17 Mar 2025</td>
              <td style={{fontWeight: 600, color: 'var(--green-dark)'}}>#RW-2025-00840</td>
              <td>Anjali K.</td>
              <td>₹ 2,340</td>
              <td>₹ 351</td>
              <td>₹ 1,989</td>
              <td><span className="status-badge status-pending">Pending</span></td>
            </tr>
            <tr>
              <td>17 Mar 2025</td>
              <td style={{fontWeight: 600, color: 'var(--green-dark)'}}>#RW-2025-00839</td>
              <td>Vikram S.</td>
              <td>₹ 675</td>
              <td>₹ 101</td>
              <td>₹ 574</td>
              <td><span className="status-badge status-approved">Completed</span></td>
            </tr>
            <tr>
              <td>16 Mar 2025</td>
              <td style={{fontWeight: 600, color: 'var(--green-dark)'}}>#RW-2025-00838</td>
              <td>Meera P.</td>
              <td>₹ 1,890</td>
              <td>₹ 284</td>
              <td>₹ 1,606</td>
              <td><span className="status-badge status-approved">Completed</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    {/* Payout Queue */}
    <div className="card" style={{marginTop: 24}}>
      <div className="card-header">
        <span className="card-title">Pending Payouts</span>
        <button className="btn btn-primary btn-sm">Process All</button>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Seller</th>
              <th>Total Sales</th>
              <th>Commission</th>
              <th>Net Payout</th>
              <th>Payment Method</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                  <div style={{width: 32, height: 32, borderRadius: '50%', background: 'var(--green-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, color: 'var(--green-dark)'}}>PS</div>
                  <span>Priya S.</span>
                </div>
              </td>
              <td>₹ 12,450</td>
              <td>₹ 1,868</td>
              <td style={{fontWeight: 600, color: 'var(--green-dark)'}}>₹ 10,582</td>
              <td>Bank Transfer</td>
              <td>
                <div style={{display: 'flex', gap: 6}}>
                  <button className="btn btn-primary btn-sm">Process</button>
                  <button className="btn btn-outline btn-sm">View Details</button>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                  <div style={{width: 32, height: 32, borderRadius: '50%', background: 'var(--green-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, color: 'var(--green-dark)'}}>AK</div>
                  <span>Anjali K.</span>
                </div>
              </td>
              <td>₹ 8,230</td>
              <td>₹ 1,235</td>
              <td style={{fontWeight: 600, color: 'var(--green-dark)'}}>₹ 6,995</td>
              <td>UPI</td>
              <td>
                <div style={{display: 'flex', gap: 6}}>
                  <button className="btn btn-primary btn-sm">Process</button>
                  <button className="btn btn-outline btn-sm">View Details</button>
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
