// @ts-nocheck
import Head from 'next/head';

export default function AdminReviews() {
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
      <a href="/admin/earnings" className="admin-nav-link"><span className="nav-icon">💰</span><span>Earnings</span></a>
      <a href="/admin/reviews" className="admin-nav-link active"><span className="nav-icon">⭐</span><span>Reviews</span></a>
      <a href="/" className="admin-nav-link" style={{marginTop: 'auto', color: 'rgba(255,100,100,.8)'}} onClick={(e) => { window.logout() }}><span className="nav-icon">🚪</span><span>Logout</span></a>
    </nav>
  </aside>
  {/* CONTENT */}
  <main className="admin-content">
    <div className="admin-header">
      <div>
        <h1>Reviews &amp; Ratings</h1>
        <div className="admin-breadcrumb">GreenThreads Admin · User Reviews Management</div>
      </div>
      <div className="admin-top-bar">
        <div className="admin-user-badge">🛡️ Super Admin</div>
      </div>
    </div>
    {/* Reviews Stats */}
    <div className="admin-stats-grid">
      <div className="admin-stat-card">
        <div className="icon">⭐</div>
        <div className="value">4.7</div>
        <div className="label">Average Rating</div>
        <div className="change">↑ +0.2 this month</div>
      </div>
      <div className="admin-stat-card">
        <div className="icon">💬</div>
        <div className="value">8,942</div>
        <div className="label">Total Reviews</div>
        <div className="change">↑ +340 this week</div>
      </div>
      <div className="admin-stat-card">
        <div className="icon">👍</div>
        <div className="value">92%</div>
        <div className="label">Positive Reviews</div>
        <div className="change">↑ +3% this month</div>
      </div>
      <div className="admin-stat-card">
        <div className="icon">⚠️</div>
        <div className="value">47</div>
        <div className="label">Reported Reviews</div>
        <div className="change" style={{color: '#e65100'}}>Needs review</div>
      </div>
    </div>
    {/* Review Distribution */}
    <div className="card" style={{marginBottom: 24}}>
      <div className="card-header">
        <span className="card-title">Rating Distribution</span>
      </div>
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'center'}}>
        <div>
          <div style={{marginBottom: 16}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8}}>
              <span style={{width: 20}}>5⭐</span>
              <div style={{flex: 1, height: 20, background: 'var(--border)', borderRadius: 10, overflow: 'hidden'}}>
                <div style={{width: '68%', height: '100%', background: 'var(--green-mid)'}} />
              </div>
              <span style={{fontWeight: 600}}>68%</span>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8}}>
              <span style={{width: 20}}>4⭐</span>
              <div style={{flex: 1, height: 20, background: 'var(--border)', borderRadius: 10, overflow: 'hidden'}}>
                <div style={{width: '18%', height: '100%', background: 'var(--green-mid)'}} />
              </div>
              <span style={{fontWeight: 600}}>18%</span>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8}}>
              <span style={{width: 20}}>3⭐</span>
              <div style={{flex: 1, height: 20, background: 'var(--border)', borderRadius: 10, overflow: 'hidden'}}>
                <div style={{width: '8%', height: '100%', background: 'var(--green-mid)'}} />
              </div>
              <span style={{fontWeight: 600}}>8%</span>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8}}>
              <span style={{width: 20}}>2⭐</span>
              <div style={{flex: 1, height: 20, background: 'var(--border)', borderRadius: 10, overflow: 'hidden'}}>
                <div style={{width: '4%', height: '100%', background: 'var(--green-mid)'}} />
              </div>
              <span style={{fontWeight: 600}}>4%</span>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8}}>
              <span style={{width: 20}}>1⭐</span>
              <div style={{flex: 1, height: 20, background: 'var(--border)', borderRadius: 10, overflow: 'hidden'}}>
                <div style={{width: '2%', height: '100%', background: 'var(--green-mid)'}} />
              </div>
              <span style={{fontWeight: 600}}>2%</span>
            </div>
          </div>
        </div>
        <div style={{textAlign: 'center'}}>
          <div style={{fontSize: '3rem', fontWeight: 800, color: 'var(--green-dark)'}}>4.7</div>
          <div style={{fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: 8}}>Average Rating</div>
          <div style={{fontSize: '0.9rem', color: 'var(--text-muted)'}}>Based on 8,942 reviews</div>
        </div>
      </div>
    </div>
    {/* Recent Reviews */}
    <div className="card">
      <div className="card-header">
        <span className="card-title">Recent Reviews</span>
        <div style={{display: 'flex', gap: 8}}>
          <select className="sort-select" style={{width: 'auto'}}>
            <option>All Reviews</option>
            <option>5 Star</option>
            <option>4 Star</option>
            <option>3 Star</option>
            <option>Reported</option>
          </select>
        </div>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Reviewer</th>
              <th>Rating</th>
              <th>Review</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
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
              <td>
                <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                  <div style={{width: 28, height: 28, borderRadius: '50%', background: 'var(--green-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 600, color: 'var(--green-dark)'}}>MK</div>
                  <span>Meera K.</span>
                </div>
              </td>
              <td>
                <div style={{color: 'var(--accent)', fontSize: '1.1rem'}}>⭐⭐⭐⭐⭐</div>
              </td>
              <td>
                <div style={{maxWidth: 300}}>
                  <p style={{margin: 0, lineHeight: '1.4'}}>Excellent quality! The denim jacket is exactly as described. Fast shipping and great packaging.</p>
                </div>
              </td>
              <td>18 Mar 2025</td>
              <td><span className="status-badge status-approved">Approved</span></td>
              <td>
                <div style={{display: 'flex', gap: 6}}>
                  <button className="btn btn-outline btn-sm">Edit</button>
                  <button className="btn btn-danger btn-sm">Hide</button>
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
              <td>
                <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                  <div style={{width: 28, height: 28, borderRadius: '50%', background: 'var(--green-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 600, color: 'var(--green-dark)'}}>AP</div>
                  <span>Anita P.</span>
                </div>
              </td>
              <td>
                <div style={{color: 'var(--accent)', fontSize: '1.1rem'}}>⭐⭐⭐⭐</div>
              </td>
              <td>
                <div style={{maxWidth: 300}}>
                  <p style={{margin: 0, lineHeight: '1.4'}}>Nice dress but color was slightly different from photos. Overall good value for money.</p>
                </div>
              </td>
              <td>17 Mar 2025</td>
              <td><span className="status-badge status-approved">Approved</span></td>
              <td>
                <div style={{display: 'flex', gap: 6}}>
                  <button className="btn btn-outline btn-sm">Edit</button>
                  <button className="btn btn-danger btn-sm">Hide</button>
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
              <td>
                <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                  <div style={{width: 28, height: 28, borderRadius: '50%', background: 'var(--green-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 600, color: 'var(--green-dark)'}}>RS</div>
                  <span>Rahul S.</span>
                </div>
              </td>
              <td>
                <div style={{color: 'var(--accent)', fontSize: '1.1rem'}}>⭐⭐</div>
              </td>
              <td>
                <div style={{maxWidth: 300}}>
                  <p style={{margin: 0, lineHeight: '1.4', color: '#e53e3e'}}>Product had holes not mentioned in description. Very disappointed with the quality.</p>
                </div>
              </td>
              <td>16 Mar 2025</td>
              <td><span className="status-badge status-pending">Reported</span></td>
              <td>
                <div style={{display: 'flex', gap: 6}}>
                  <button className="btn btn-primary btn-sm">Review</button>
                  <button className="btn btn-danger btn-sm">Remove</button>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                  <img src="https://images.unsplash.com/photo-1519278409-1f56fdda7fe5?w=60&q=80" alt style={{width: 42, height: 42, borderRadius: 6, objectFit: 'cover'}} />
                  <span style={{fontWeight: 600}}>Cotton Kurta</span>
                </div>
              </td>
              <td>
                <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                  <div style={{width: 28, height: 28, borderRadius: '50%', background: 'var(--green-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 600, color: 'var(--green-dark)'}}>SK</div>
                  <span>Sneha K.</span>
                </div>
              </td>
              <td>
                <div style={{color: 'var(--accent)', fontSize: '1.1rem'}}>⭐⭐⭐⭐⭐</div>
              </td>
              <td>
                <div style={{maxWidth: 300}}>
                  <p style={{margin: 0, lineHeight: '1.4'}}>Beautiful kurta! Perfect fit and excellent fabric. Will definitely buy again.</p>
                </div>
              </td>
              <td>15 Mar 2025</td>
              <td><span className="status-badge status-approved">Approved</span></td>
              <td>
                <div style={{display: 'flex', gap: 6}}>
                  <button className="btn btn-outline btn-sm">Edit</button>
                  <button className="btn btn-danger btn-sm">Hide</button>
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
