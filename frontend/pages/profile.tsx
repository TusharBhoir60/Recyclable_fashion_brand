// @ts-nocheck
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "./apiClient";
const res = await api.get("/auth/me");

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    createdAt: "",
  });

  async function loadProfile() {
    try {
      setLoading(true);
      const res = await api.get("/auth/me");
      const u = res.data?.user || res.data?.data || res.data || {};

      setProfile({
        name: u.name || "",
        phone: u.phone || "",
        email: u.email || "",
        address: u.address || "",
        createdAt: u.createdAt || "",
      });
    } catch (e: any) {
      alert(e?.response?.data?.error || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }

  async function saveProfile() {
    try {
      setSaving(true);
      try {
        await api.put("/auth/me", {
          name: profile.name,
          phone: profile.phone,
          address: profile.address,
        });
      } catch {
        await api.put("/users/me", {
          name: profile.name,
          phone: profile.phone,
          address: profile.address,
        });
      }

      setEditMode(false);
      alert("Profile updated");
      loadProfile();
    } catch (e: any) {
      alert(e?.response?.data?.error || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  }

useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) return;
  loadProfile();
}, []);

  const initial = (profile.name || "U").charAt(0).toUpperCase();
  const memberSince = profile.createdAt
    ? new Date(profile.createdAt).getFullYear()
    : "2023";

  return (
    <>
      <Head>
        <title>Profile | GreenThreads</title>
      </Head>

      <div>
        <nav className="navbar">
          <div className="container nav-inner">
            <Link href="/" className="nav-logo">
              <span className="leaf">🌿</span> GreenThreads
            </Link>
            <div className="nav-links">
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/shop">Shop</Link>
              <Link href="/sell">Sell</Link>
              <Link href="/profile" className="active">Profile</Link>
              <Link href="/cart" className="btn-nav nav-cart-icon">🛒</Link>
              <button
                className="btn btn-outline btn-sm"
                style={{ marginLeft: 6 }}
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.href = "/login";
                }}
              >
                Logout
              </button>
            </div>
            <div className="hamburger"><span /><span /><span /></div>
          </div>
        </nav>

        <div className="page-header">
          <div className="container">
            <h1>My Profile 👤</h1>
            <p>Manage your account details and preferences</p>
          </div>
        </div>

        <section className="section-sm">
          <div className="container">
            {loading ? (
              <p>Loading profile...</p>
            ) : (
              <div className="profile-layout">
                <div className="profile-sidebar card" style={{ padding: 0, overflow: "hidden" }}>
                  <div className="profile-avatar-wrap">
                    <div className="profile-avatar">{initial}</div>
                    <div className="profile-name">{profile.name || "User"}</div>
                    <div className="profile-email">{profile.email || "-"}</div>
                    <div style={{ fontSize: ".8rem", color: "var(--green-mid)", marginTop: 6, fontWeight: 600 }}>
                      ⭐ Eco Shopper · Member since {memberSince}
                    </div>
                  </div>

                  <nav className="profile-nav">
                    <div className="profile-nav-link active"><span className="link-icon">👤</span> Account Details</div>
                    <Link href="/orders" className="profile-nav-link"><span className="link-icon">📦</span> My Orders</Link>
                    <Link href="/sell" className="profile-nav-link"><span className="link-icon">🏷️</span> My Listings</Link>
                    <div className="profile-nav-link"><span className="link-icon">❤️</span> Wishlist</div>
                    <div className="profile-nav-link"><span className="link-icon">📍</span> Saved Addresses</div>
                    <div className="profile-nav-link"><span className="link-icon">🔔</span> Notifications</div>
                    <div className="profile-nav-link"><span className="link-icon">🔒</span> Privacy &amp; Security</div>
                  </nav>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                  <div style={{ background: "linear-gradient(135deg,var(--green-dark),var(--green-mid))", borderRadius: "var(--radius-md)", padding: 28, color: "#fff", display: "flex", gap: 32, flexWrap: "wrap" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: ".85rem", opacity: ".75", marginBottom: 4 }}>Your Eco Impact</div>
                      <div style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: 2 }}>12.4 kg CO₂</div>
                      <div style={{ fontSize: ".85rem", opacity: ".8" }}>Saved by buying recycled</div>
                    </div>
                    <div style={{ flex: 1, borderLeft: "1px solid rgba(255,255,255,.2)", paddingLeft: 32 }}>
                      <div style={{ fontSize: ".85rem", opacity: ".75", marginBottom: 4 }}>Garments Saved</div>
                      <div style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: 2 }}>7</div>
                      <div style={{ fontSize: ".85rem", opacity: ".8" }}>Items given a second life</div>
                    </div>
                    <div style={{ flex: 1, borderLeft: "1px solid rgba(255,255,255,.2)", paddingLeft: 32 }}>
                      <div style={{ fontSize: ".85rem", opacity: ".75", marginBottom: 4 }}>Money Saved</div>
                      <div style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: 2 }}>₹ 4,200</div>
                      <div style={{ fontSize: ".85rem", opacity: ".8" }}>Vs. buying new</div>
                    </div>
                  </div>

                  <div className="card">
                    <div className="card-header">
                      <span className="card-title">Account Details</span>
                      {!editMode ? (
                        <button className="btn btn-outline btn-sm" onClick={() => setEditMode(true)}>✏️ Edit</button>
                      ) : (
                        <button className="btn btn-outline btn-sm" onClick={() => { setEditMode(false); loadProfile(); }}>Cancel</button>
                      )}
                    </div>

                    <form onSubmit={(e) => e.preventDefault()}>
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">Full Name</label>
                          <input
                            className="form-control"
                            type="text"
                            value={profile.name}
                            disabled={!editMode}
                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Mobile</label>
                          <input
                            className="form-control"
                            type="text"
                            value={profile.phone}
                            disabled={!editMode}
                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Email</label>
                        <input className="form-control" type="email" value={profile.email} disabled />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Default Delivery Address</label>
                        <textarea
                          className="form-control"
                          rows={2}
                          value={profile.address}
                          disabled={!editMode}
                          onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                        />
                      </div>

                      {editMode && (
                        <div>
                          <button type="button" className="btn btn-primary" onClick={saveProfile} disabled={saving}>
                            {saving ? "Saving..." : "Save Changes"}
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline"
                            style={{ marginLeft: 10 }}
                            onClick={() => { setEditMode(false); loadProfile(); }}
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </form>
                  </div>

                  <div className="card">
                    <div className="card-header">
                      <span className="card-title">Recent Orders</span>
                      <Link href="/orders" style={{ fontSize: ".88rem", color: "var(--green-mid)", fontWeight: 600 }}>
                        View All →
                      </Link>
                    </div>
                    <p style={{ color: "var(--text-muted)" }}>See full order timeline in Orders page.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
<button
  onClick={async () => {
    try {
      const r = await api.get("/auth/me");
      console.log("ME OK", r.data);
      alert("me ok");
    } catch (e: any) {
      console.log("ME ERR", e?.response?.status, e?.response?.data);
      alert(JSON.stringify(e?.response?.data || {}));
    }
  }}
>
  Test /auth/me
</button>