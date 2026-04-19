// @ts-nocheck
import Head from 'next/head';

export default function Login() {
  return (
    <>
      <Head>
        <title>Recycled Fashion</title>
      </Head>
      <div>
  {/* Back to Home Button */}
  <div className="back-to-home">
    <a href="/" className="btn btn-outline btn-sm">
      <span>←</span> Back to Home
    </a>
  </div>
  <div className="auth-page">
    {/* Left Panel */}
    <div className="auth-left">
      <div className="auth-left-content">
        <div className="big-leaf">🌿</div>
        <h1>GreenThreads</h1>
        <p>Recycled fashion for a greener planet.<br />Shop pre-loved clothing &amp; give garments a second life.</p>
        <div style={{marginTop: 40, display: 'flex', flexDirection: 'column', gap: 14, textAlign: 'left'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,.12)', padding: '14px 18px', borderRadius: 12}}>
            <span style={{fontSize: '1.4rem'}}>♻️</span>
            <span style={{fontSize: '.93rem', opacity: '.9'}}>100% recycled clothing marketplace</span>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,.12)', padding: '14px 18px', borderRadius: 12}}>
            <span style={{fontSize: '1.4rem'}}>🌎</span>
            <span style={{fontSize: '.93rem', opacity: '.9'}}>Reduce carbon footprint with every purchase</span>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,.12)', padding: '14px 18px', borderRadius: 12}}>
            <span style={{fontSize: '1.4rem'}}>💚</span>
            <span style={{fontSize: '.93rem', opacity: '.9'}}>Join 50,000+ eco-conscious shoppers</span>
          </div>
        </div>
      </div>
    </div>
    {/* Right Panel */}
    <div className="auth-right">
      <div className="auth-form-wrap">
        <h2>Welcome back 👋</h2>
        <p className="auth-sub">Log in to your GreenThreads account</p>
        <form id="login-form" onSubmit={(e) => { window.handleLogin(e); }}>
          <div className="form-group">
            <label className="form-label">Select Your Role</label>
            <div className="role-selector">
              <label className="role-option">
                <input type="radio" name="role" defaultValue="user" defaultChecked onChange={() => window.toggleLoginFields()} />
                <span className="role-icon">👤</span>
                <span className="role-text">User</span>
              </label>
              <label className="role-option">
                <input type="radio" name="role" defaultValue="admin" onChange={() => window.toggleLoginFields()} />
                <span className="role-icon">🛡️</span>
                <span className="role-text">Admin</span>
              </label>
            </div>
          </div>
          {/* User Login Fields */}
          <div id="user-login-fields">
            <div className="form-group">
              <label className="form-label" htmlFor="user-email">Email / Mobile</label>
              <input className="form-control" type="text" id="user-email" name="user-email" placeholder="you@email.com or 9876543210" required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="user-password">Password</label>
              <div style={{position: 'relative'}}>
                <input className="form-control" type="password" id="user-password" name="user-password" placeholder="••••••••" required style={{paddingRight: 44}} />
                <button type="button" id="toggle-user-pw" onClick={(e) => { const btn = e.currentTarget; const input = btn.previousElementSibling as HTMLInputElement | null; if (!input) return; input.type = input.type === 'password' ? 'text' : 'password'; btn.textContent = input.type === 'password' ? '👁' : '🙈'; }} style={{position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem'}}>👁</button>
              </div>
              <a href="#" className="forgot-link">Forgot Password?</a>
            </div>
          </div>
          {/* Admin Login Fields */}
          <div id="admin-login-fields" style={{display: 'none'}}>
            <div className="form-group">
              <label className="form-label" htmlFor="admin-email">Email / Mobile</label>
              <input className="form-control" type="text" id="admin-email" name="admin-email" placeholder="admin@greenthreads.com or 9876543210" required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="admin-password">Password</label>
              <div style={{position: 'relative'}}>
                <input className="form-control" type="password" id="admin-password" name="admin-password" placeholder="••••••••" required style={{paddingRight: 44}} />
                <button type="button" id="toggle-admin-pw" onClick={(e) => { const btn = e.currentTarget; const input = btn.previousElementSibling as HTMLInputElement | null; if (!input) return; input.type = input.type === 'password' ? 'text' : 'password'; btn.textContent = input.type === 'password' ? '👁' : '🙈'; }} style={{position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem'}}>👁</button>
              </div>
              <a href="#" className="forgot-link">Forgot Password?</a>
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-block btn-lg" style={{marginBottom: 16}}>Login</button>
        </form>
        <div className="auth-footer-link">
          Don't have an account? <a href="/signup">Sign up for free</a>
        </div>
      </div>
    </div>
  </div>
</div>

    </>
  );
}
