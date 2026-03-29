import Head from "next/head";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { api } from "./apiClient";

type OrderItem = {
  id: string;
  quantity: number;
  unitPrice: number;
  product?: { id: string; name: string; images?: string[] };
};

type Order = {
  id: string;
  status: "PENDING" | "PAID" | "CANCELLED";
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "PAID" | "CANCELLED">("ALL");

  async function loadOrders() {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/orders/my");
      const data = Array.isArray(res.data) ? res.data : res.data?.orders || [];
      setOrders(data);
    } catch (e: any) {
      setError(e?.response?.data?.error || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  const filtered = useMemo(() => (filter === "ALL" ? orders : orders.filter((o) => o.status === filter)), [orders, filter]);

  return (
    <>
      <Head><title>My Orders | GreenThreads</title></Head>
      <div>
        <nav className="navbar">
          <div className="container nav-inner">
            <Link href="/" className="nav-logo"><span className="leaf">🌿</span> GreenThreads</Link>
            <div className="nav-links">
              <Link href="/shop">Shop</Link>
              <Link href="/orders" className="active">Orders</Link>
              <Link href="/profile">Profile</Link>
              <Link href="/cart" className="btn-nav nav-cart-icon">🛒</Link>
            </div>
          </div>
        </nav>

        <div className="page-header">
          <div className="container">
            <h1>My Orders 📦</h1>
            <p>Track and manage all your purchases</p>
          </div>
        </div>

        <section className="section-sm">
          <div className="container" style={{ maxWidth: 860 }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>
              <button className="btn btn-outline btn-sm" onClick={() => setFilter("ALL")}>All</button>
              <button className="btn btn-outline btn-sm" onClick={() => setFilter("PENDING")}>Pending</button>
              <button className="btn btn-outline btn-sm" onClick={() => setFilter("PAID")}>Paid</button>
              <button className="btn btn-outline btn-sm" onClick={() => setFilter("CANCELLED")}>Cancelled</button>
            </div>

            {loading && <p>Loading orders...</p>}
            {error && <p style={{ color: "crimson" }}>{error}</p>}
            {!loading && !error && filtered.length === 0 && <p>No orders found.</p>}

            {filtered.map((order) => (
              <div className="order-card" key={order.id}>
                <div className="order-card-header">
                  <div>
                    <div className="order-id">Order #{order.id}</div>
                    <div className="order-date">Placed: {new Date(order.createdAt).toLocaleString()} · {order.items?.length || 0} items</div>
                  </div>
                  <span className="badge">{order.status}</span>
                </div>

                <div className="order-card-body">
                  <div className="order-items-list">
                    {(order.items || []).map((it) => (
                      <div className="order-item-row" key={it.id}>
                        <div className="order-item-img">
                          <img src={it.product?.images?.[0] || "https://via.placeholder.com/120"} alt={it.product?.name || "Product"} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 600 }}>{it.product?.name || "Product"}</div>
                          <div style={{ fontSize: ".82rem", color: "var(--text-muted)" }}>Qty: {it.quantity} · ₹{it.unitPrice}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="order-footer">
                  <span className="order-total">Total: ₹ {order.totalAmount}</span>
                  <Link href="/shop" className="btn btn-outline btn-sm">Buy Again</Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}