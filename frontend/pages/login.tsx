// @ts-nocheck
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { api } from "./apiClient";

export default function Login() {
  const router = useRouter();

  const [role, setRole] = useState("user");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [showUserPw, setShowUserPw] = useState(false);
  const [showAdminPw, setShowAdminPw] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();

    const email = role === "admin" ? adminEmail : userEmail;
    const password = role === "admin" ? adminPassword : userPassword;

    try {
      setLoading(true);

      const payload = {
        email: String(email).trim().toLowerCase(),
        password: String(password).trim(),
      };

      const res = await api.post("/auth/login", payload);

      const token =
        res?.data?.token ||
        res?.data?.accessToken ||
        res?.data?.data?.token ||
        res?.data?.data?.accessToken;

      if (!token) throw new Error("Token not found in login response");

      localStorage.setItem("token", token);
      console.log("Saved token length:", token.length);

      const user = res?.data?.user || res?.data?.data?.user;
      if (user) localStorage.setItem("user", JSON.stringify(user));

      if (role === "admin") router.push("/admin");
      else router.push("/dashboard");
    } catch (err: any) {
      alert(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Invalid credentials"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>Recycled Fashion</title>
      </Head>
      <div>
        <div className="back-to-home">
          <Link href="/" className="btn btn-outline btn-sm">
            <span>←</span> Back to Home
          </Link>
        </div>

        <div className="auth-page">
          <div className="auth-left">
            <div className="auth-left-content">
              <div className="big-leaf">🌿</div>
              <h1>GreenThreads</h1>
              <p>
                Recycled fashion for a greener planet.
                <br />
                Shop pre-loved clothing &amp; give garments a second life.
              </p>

              <div
                style={{
                  marginTop: 40,
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                  textAlign: "left",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,.12)", padding: "14px 18px", borderRadius: 12 }}>
                  <span style={{ fontSize: "1.4rem" }}>♻️</span>
                  <span style={{ fontSize: ".93rem", opacity: ".9" }}>100% recycled clothing marketplace</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,.12)", padding: "14px 18px", borderRadius: 12 }}>
                  <span style={{ fontSize: "1.4rem" }}>🌎</span>
                  <span style={{ fontSize: ".93rem", opacity: ".9" }}>Reduce carbon footprint with every purchase</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,.12)", padding: "14px 18px", borderRadius: 12 }}>
                  <span style={{ fontSize: "1.4rem" }}>💚</span>
                  <span style={{ fontSize: ".93rem", opacity: ".9" }}>Join 50,000+ eco-conscious shoppers</span>
                </div>
              </div>
            </div>
          </div>

          <div className="auth-right">
            <div className="auth-form-wrap">
              <h2>Welcome back 👋</h2>
              <p className="auth-sub">Log in to your GreenThreads account</p>

              <form id="login-form" onSubmit={handleLogin}>
                <div className="form-group">
                  <label className="form-label">Select Your Role</label>
                  <div className="role-selector">
                    <label className="role-option">
                      <input
                        type="radio"
                        name="role"
                        value="user"
                        checked={role === "user"}
                        onChange={() => setRole("user")}
                      />
                      <span className="role-icon">👤</span>
                      <span className="role-text">User</span>
                    </label>
                    <label className="role-option">
                      <input
                        type="radio"
                        name="role"
                        value="admin"
                        checked={role === "admin"}
                        onChange={() => setRole("admin")}
                      />
                      <span className="role-icon">🛡️</span>
                      <span className="role-text">Admin</span>
                    </label>
                  </div>
                </div>

                {role === "user" ? (
                  <div id="user-login-fields">
                    <div className="form-group">
                      <label className="form-label" htmlFor="user-email">Email</label>
                      <input
                        className="form-control"
                        type="text"
                        id="user-email"
                        name="user-email"
                        placeholder="you@email.com"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="user-password">Password</label>
                      <div style={{ position: "relative" }}>
                        <input
                          className="form-control"
                          type={showUserPw ? "text" : "password"}
                          id="user-password"
                          name="user-password"
                          placeholder="••••••••"
                          value={userPassword}
                          onChange={(e) => setUserPassword(e.target.value)}
                          required
                          style={{ paddingRight: 44 }}
                        />
                        <button
                          type="button"
                          id="toggle-user-pw"
                          onClick={() => setShowUserPw((v) => !v)}
                          style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "1rem" }}
                        >
                          {showUserPw ? "🙈" : "👁"}
                        </button>
                      </div>
                      <a href="#" className="forgot-link">Forgot Password?</a>
                    </div>
                  </div>
                ) : (
                  <div id="admin-login-fields">
                    <div className="form-group">
                      <label className="form-label" htmlFor="admin-email">Email</label>
                      <input
                        className="form-control"
                        type="text"
                        id="admin-email"
                        name="admin-email"
                        placeholder="admin@greenthreads.com"
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="admin-password">Password</label>
                      <div style={{ position: "relative" }}>
                        <input
                          className="form-control"
                          type={showAdminPw ? "text" : "password"}
                          id="admin-password"
                          name="admin-password"
                          placeholder="••••••••"
                          value={adminPassword}
                          onChange={(e) => setAdminPassword(e.target.value)}
                          required
                          style={{ paddingRight: 44 }}
                        />
                        <button
                          type="button"
                          id="toggle-admin-pw"
                          onClick={() => setShowAdminPw((v) => !v)}
                          style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "1rem" }}
                        >
                          {showAdminPw ? "🙈" : "👁"}
                        </button>
                      </div>
                      <a href="#" className="forgot-link">Forgot Password?</a>
                    </div>
                  </div>
                )}

                <button type="submit" className="btn btn-primary btn-block btn-lg" style={{ marginBottom: 16 }} disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>

              <div className="auth-footer-link">
                Don't have an account? <Link href="/signup">Sign up for free</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}