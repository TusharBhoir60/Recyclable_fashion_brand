// @ts-nocheck
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "./apiClient";

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
      const token = localStorage.getItem("token");
      if (!token) return;

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

      const payload = {
        name: String(profile.name || "").trim(),
        phone: String(profile.phone || "").trim(),
        address: String(profile.address || "").trim(),
      };

      // Try primary route first
      try {
        await api.put("/auth/me", payload);
      } catch (e: any) {
        // fallback route if your backend uses users module
        if (e?.response?.status === 404 || e?.response?.status === 405) {
          await api.put("/users/me", payload);
        } else {
          throw e;
        }
      }

      setEditMode(false);
      await loadProfile();
      alert("Profile updated successfully");
    } catch (e: any) {
      alert(
  JSON.stringify({
    status: e?.response?.status,
    data: e?.response?.data,
    url: e?.config?.url,
    method: e?.config?.method,
  })
);
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
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
                  localStorage.removeItem("user");
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
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                  <div className="card">
                    <div className="card-header">
                      <span className="card-title">Account Details</span>
                      {!editMode ? (
                        <button className="btn btn-outline btn-sm" onClick={() => setEditMode(true)}>✏️ Edit</button>
                      ) : (
                        <button className="btn btn-outline btn-sm" onClick={() => { setEditMode(false); loadProfile(); }}>
                          Cancel
                        </button>
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
                            disabled={!editMode || saving}
                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Mobile</label>
                          <input
                            className="form-control"
                            type="text"
                            value={profile.phone}
                            disabled={!editMode || saving}
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
                          disabled={!editMode || saving}
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
                            disabled={saving}
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </form>
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