import Head from "next/head";
import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { api } from "./apiClient";

type CartItem = {
  productId: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
};

export default function Checkout() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [placing, setPlacing] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [pincode, setPincode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("UPI");

  useEffect(() => {
    const raw = localStorage.getItem("cart");
    setItems(raw ? JSON.parse(raw) : []);
  }, []);

  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.price * i.quantity, 0), [items]);
  const platformFee = items.length ? 29 : 0;
  const total = subtotal + platformFee;

  async function placeOrder() {
    try {
      if (!items.length) return alert("Cart is empty");
      if (!firstName || !phone || !line1 || !city || !stateName || !pincode) {
        return alert("Please fill all required address fields");
      }

      setPlacing(true);

      const payload = {
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        shippingAddress: { firstName, lastName, phone, line1, line2, city, state: stateName, pincode },
        paymentMethod,
      };

      await api.post("/orders", payload);

      localStorage.removeItem("cart");
      alert("Order placed successfully!");
      router.push("/orders");
    } catch (e: any) {
      alert(e?.response?.data?.error || "Failed to place order");
    } finally {
      setPlacing(false);
    }
  }

  return (
    <>
      <Head><title>Checkout | GreenThreads</title></Head>
      <div>
        <nav className="navbar">
          <div className="container nav-inner">
            <Link href="/" className="nav-logo"><span className="leaf">🌿</span> GreenThreads</Link>
            <div className="nav-links">
              <Link href="/shop">Shop</Link>
              <Link href="/orders">Orders</Link>
              <Link href="/profile">Profile</Link>
              <Link href="/cart" className="btn-nav nav-cart-icon">🛒</Link>
            </div>
          </div>
        </nav>

        <div className="page-header">
          <div className="container">
            <div className="breadcrumb"><Link href="/cart">Cart</Link><span className="breadcrumb-sep">›</span><span>Checkout</span></div>
            <h1>Checkout</h1>
            <p>Almost there! Complete your order below</p>
          </div>
        </div>

        <section className="section-sm">
          <div className="container">
            <div className="checkout-layout">
              <div>
                <div className="card" style={{ marginBottom: 24 }}>
                  <div className="card-header"><span className="card-title">📍 Delivery Address</span></div>

                  <div className="form-row">
                    <div className="form-group"><label className="form-label">First Name</label><input className="form-control" value={firstName} onChange={(e) => setFirstName(e.target.value)} /></div>
                    <div className="form-group"><label className="form-label">Last Name</label><input className="form-control" value={lastName} onChange={(e) => setLastName(e.target.value)} /></div>
                  </div>
                  <div className="form-group"><label className="form-label">Phone Number</label><input className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
                  <div className="form-group"><label className="form-label">Address Line 1</label><input className="form-control" value={line1} onChange={(e) => setLine1(e.target.value)} /></div>
                  <div className="form-group"><label className="form-label">Address Line 2</label><input className="form-control" value={line2} onChange={(e) => setLine2(e.target.value)} /></div>
                  <div className="form-row">
                    <div className="form-group"><label className="form-label">City</label><input className="form-control" value={city} onChange={(e) => setCity(e.target.value)} /></div>
                    <div className="form-group"><label className="form-label">State</label><input className="form-control" value={stateName} onChange={(e) => setStateName(e.target.value)} /></div>
                  </div>
                  <div className="form-group"><label className="form-label">PIN Code</label><input className="form-control" value={pincode} onChange={(e) => setPincode(e.target.value)} maxLength={6} /></div>
                </div>

                <div className="card">
                  <div className="card-header"><span className="card-title">💳 Payment Method</span></div>
                  <div className="payment-options">
                    {["UPI", "CARD", "NET_BANKING", "COD"].map((m) => (
                      <button key={m} type="button" className={`payment-option ${paymentMethod === m ? "selected" : ""}`} onClick={() => setPaymentMethod(m)}>
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <div className="card" style={{ marginBottom: 20 }}>
                  <div className="card-header"><span className="card-title">📦 Order Summary</span></div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
                    {items.map((item) => (
                      <div key={item.productId} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: ".9rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <img src={item.image || "https://via.placeholder.com/60"} style={{ width: 44, height: 44, borderRadius: 6, objectFit: "cover" }} alt={item.name} />
                          <span>{item.name} × {item.quantity}</span>
                        </div>
                        <span style={{ fontWeight: 700 }}>₹ {item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="summary-row"><span>Subtotal</span><span>₹ {subtotal}</span></div>
                  <div className="summary-row"><span>Delivery</span><span style={{ color: "var(--green-mid)", fontWeight: 700 }}>FREE</span></div>
                  <div className="summary-row"><span>Platform Fee</span><span>₹ {platformFee}</span></div>
                  <div className="summary-row total"><span>Total</span><span>₹ {total}</span></div>
                </div>

                <button className="btn btn-primary btn-block btn-lg" onClick={placeOrder} disabled={placing || !items.length}>
                  {placing ? "Placing..." : "🎉 Place Order"}
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}