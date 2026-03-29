import Head from "next/head";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type CartItem = {
  productId: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
};

export default function Cart() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem("cart");
    setItems(raw ? JSON.parse(raw) : []);
  }, []);

  const persist = (next: CartItem[]) => {
    setItems(next);
    localStorage.setItem("cart", JSON.stringify(next));
  };

  const changeQty = (productId: string, delta: number) => {
    const next = items
      .map((i) =>
        i.productId === productId ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i
      )
      .filter((i) => i.quantity > 0);
    persist(next);
  };

  const removeItem = (productId: string) => {
    const next = items.filter((i) => i.productId !== productId);
    persist(next);
  };

  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.price * i.quantity, 0), [items]);
  const platformFee = items.length ? 29 : 0;
  const total = subtotal + platformFee;
  const totalQty = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <>
      <Head><title>Cart | GreenThreads</title></Head>
      <div>
        <nav className="navbar">
          <div className="container nav-inner">
            <Link href="/" className="nav-logo"><span className="leaf">🌿</span> GreenThreads</Link>
            <div className="nav-links">
              <Link href="/shop">Shop</Link>
              <Link href="/orders">Orders</Link>
              <Link href="/profile">Profile</Link>
              <Link href="/cart" className="btn-nav nav-cart-icon active">🛒</Link>
            </div>
          </div>
        </nav>

        <div className="page-header">
          <div className="container">
            <h1>Your Cart 🛒</h1>
            <p>Review your items before checkout</p>
          </div>
        </div>

        <section className="section-sm">
          <div className="container">
            <div className="cart-layout">
              <div className="card">
                <div className="card-header">
                  <span className="card-title">Cart Items ({totalQty})</span>
                  <Link href="/shop" style={{ fontSize: ".88rem", color: "var(--green-mid)", fontWeight: 600 }}>+ Add More</Link>
                </div>

                {items.length === 0 && (
                  <div style={{ padding: 16 }}>
                    <p>Your cart is empty.</p>
                    <Link href="/shop" className="btn btn-primary">Go to Shop</Link>
                  </div>
                )}

                {items.map((item) => (
                  <div className="cart-item" key={item.productId}>
                    <div className="cart-item-img">
                      <img src={item.image || "https://via.placeholder.com/200?text=No+Image"} alt={item.name} />
                    </div>
                    <div className="cart-item-info">
                      <div className="cart-item-name">{item.name}</div>
                      <div className="cart-item-actions">
                        <div className="qty-control">
                          <button className="qty-btn" onClick={() => changeQty(item.productId, -1)}>−</button>
                          <input className="qty-display" value={item.quantity} type="text" readOnly />
                          <button className="qty-btn" onClick={() => changeQty(item.productId, 1)}>+</button>
                        </div>
                        <span className="cart-item-price">₹ {item.price * item.quantity}</span>
                        <button className="remove-btn" onClick={() => removeItem(item.productId)}>🗑 Remove</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-summary">
                <div className="card">
                  <div className="card-header"><span className="card-title">Order Summary</span></div>
                  <div className="summary-row"><span>Subtotal ({totalQty} items)</span><span>₹ {subtotal}</span></div>
                  <div className="summary-row"><span>Delivery</span><span style={{ color: "var(--green-mid)", fontWeight: 700 }}>FREE</span></div>
                  <div className="summary-row"><span>Platform Fee</span><span>₹ {platformFee}</span></div>
                  <div className="summary-row total"><span>Total</span><span>₹ {total}</span></div>

                  <Link href="/checkout" className="btn btn-primary btn-block btn-lg" style={{ marginTop: 20, pointerEvents: items.length ? "auto" : "none", opacity: items.length ? 1 : 0.6 }}>
                    Proceed to Checkout →
                  </Link>
                  <Link href="/shop" className="btn btn-outline btn-block" style={{ marginTop: 10 }}>Continue Shopping</Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}