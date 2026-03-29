// @ts-nocheck
import Head from 'next/head';

export default function Signup() {
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
        <h1>Join GreenThreads</h1>
        <p>Create your account and start your eco-fashion journey today.</p>
        <div style={{marginTop: 40}}>
          <div style={{background: 'rgba(255,255,255,.15)', borderRadius: 16, padding: 24}}>
            <div style={{fontSize: '2.5rem', fontWeight: 800, color: '#fff'}}>50K+</div>
            <div style={{fontSize: '.9rem', opacity: '.8'}}>Active eco shoppers</div>
            <div style={{borderTop: '1px solid rgba(255,255,255,.15)', margin: '16px 0'}} />
            <div style={{fontSize: '2.5rem', fontWeight: 800, color: '#fff'}}>1.2M</div>
            <div style={{fontSize: '.9rem', opacity: '.8'}}>kg CO₂ saved</div>
            <div style={{borderTop: '1px solid rgba(255,255,255,.15)', margin: '16px 0'}} />
            <div style={{fontSize: '2.5rem', fontWeight: 800, color: '#fff'}}>200K+</div>
            <div style={{fontSize: '.9rem', opacity: '.8'}}>Recycled garments listed</div>
          </div>
        </div>
      </div>
    </div>
    {/* Right Panel */}
    <div className="auth-right" style={{overflowY: 'auto'}}>
      <div className="auth-form-wrap">
        <h2>Create Account ✨</h2>
        <p className="auth-sub">Join the eco-fashion revolution</p>
        <form id="signup-form" onSubmit={(e) => { window.handleSignup(event) }}>
          <div className="form-group">
            <label className="form-label">Select Your Role</label>
            <div className="role-selector">
              <label className="role-option">
                <input type="radio" name="role" defaultValue="user" defaultChecked />
                <span className="role-icon">👤</span>
                <span className="role-text">User</span>
              </label>
              <label className="role-option">
                <input type="radio" name="role" defaultValue="admin" />
                <span className="role-icon">🛡️</span>
                <span className="role-text">Admin</span>
              </label>
            </div>
          </div>
          {/* User Signup Fields */}
          <div id="user-signup-fields">
            <div className="form-group">
              <label className="form-label" htmlFor="fullname">Full Name</label>
              <input className="form-control" type="text" id="fullname" name="fullname" placeholder="Priya Sharma" required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="s-email">Email</label>
                <input className="form-control" type="email" id="s-email" name="email" placeholder="you@email.com" required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="mobile">Mobile Number</label>
                <input className="form-control" type="tel" id="mobile" name="mobile" placeholder={9876543210} pattern="[0-9]{10}" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="password">Password</label>
                <input className="form-control" type="password" id="password" name="password" placeholder="Min. 8 characters" required minLength={8} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="confirm-password">Confirm Password</label>
                <input className="form-control" type="password" id="confirm-password" name="confirm_password" placeholder="Re-enter password" required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="address">Delivery Address</label>
              <textarea className="form-control" id="address" name="address" rows={3} placeholder="House/Flat No., Street, City, State, PIN" required defaultValue={""} />
            </div>
          </div>
          {/* Admin Signup Fields */}
          <div id="admin-signup-fields" style={{display: 'none'}}>
            <div className="form-group">
              <label className="form-label" htmlFor="admin-email">Email / Mobile Number</label>
              <input className="form-control" type="text" id="admin-email" name="admin-email" placeholder="admin@greenthreads.com or 9876543210" required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="admin-password">Password</label>
                <input className="form-control" type="password" id="admin-password" name="admin-password" placeholder="Min. 8 characters" required minLength={8} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="admin-confirm-password">Confirm Password</label>
                <input className="form-control" type="password" id="admin-confirm-password" name="admin-confirm-password" placeholder="Re-enter password" required />
              </div>
            </div>
          </div>
          <div className="form-group" style={{display: 'flex', alignItems: 'flex-start', gap: 10}}>
            <input type="checkbox" id="terms" required style={{width: 16, height: 16, accentColor: 'var(--green-mid)', cursor: 'pointer', marginTop: 3}} />
            <label htmlFor="terms" style={{fontSize: '.88rem', color: 'var(--text-muted)', cursor: 'pointer', lineHeight: '1.5'}}>
              I agree to the <a href="#" style={{color: 'var(--green-mid)', fontWeight: 600}}>Terms of Service</a> and <a href="#" style={{color: 'var(--green-mid)', fontWeight: 600}}>Privacy Policy</a>
            </label>
          </div>
          <button onClick={(e) => { window.location.href='login.html' }} className="btn btn-primary btn-block btn-lg" style={{marginBottom: 16}}>Create Account</button>
        </form>
        <div className="auth-footer-link">
          Already have an account? <a href="/login">Log in</a>
        </div>
      </div>
    </div>
  </div>
</div>

    </>
  );
}
