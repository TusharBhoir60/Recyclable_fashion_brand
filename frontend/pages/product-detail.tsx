import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { api } from "./apiClient";

type Product = {
  id: string;
  name: string;
  description: string;
  type: "BASIC" | "PREMIUM" | "CUSTOMIZED";
  basePrice: number;
  stock: number;
  images: string[];
  isActive: boolean;
};

type Review = {
  id: string;
  rating: number;
  text: string;
  createdAt: string;
  user?: { name?: string };
};

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query as { id?: string };

  const [product, setProduct] = useState<Product | null>(null);
  const [similar, setSimilar] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);

  async function loadProduct(pid: string) {
    try {
      setLoading(true);
      setError("");

      const pRes = await api.get(`/products/${pid}`);
      const pData = pRes.data?.product || pRes.data;
      setProduct(pData);
      setActiveImage(pData?.images?.[0] || "");

      try {
        const sRes = await api.get(`/search/similar/${pid}?top_k=6`);
        setSimilar(Array.isArray(sRes.data) ? sRes.data : []);
      } catch {
        setSimilar([]);
      }

      try {
        const rRes = await api.get(`/reviews/product/${pid}`);
        setReviews(Array.isArray(rRes.data) ? rRes.data : rRes.data?.reviews || []);
      } catch {
        setReviews([]);
      }
    } catch (e: any) {
      setError(e?.response?.data?.error || "Failed to load product");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) loadProduct(id);
  }, [id]);

  const canAdd = useMemo(() => !!product && product.stock > 0, [product]);

  function addToCart() {
    if (!product) return;
    const raw = localStorage.getItem("cart");
    const cart = raw ? JSON.parse(raw) : [];
    const existing = cart.find((c: any) => c.productId === product.id);

    if (existing) existing.quantity += qty;
    else {
      cart.push({
        productId: product.id,
        name: product.name,
        price: product.basePrice,
        image: product.images?.[0] || "",
        quantity: qty,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to cart");
  }

  async function submitReview() {
    if (!id) return;
    if (!reviewText.trim()) return alert("Please enter review text");

    try {
      await api.post("/reviews", {
        productId: id,
        text: reviewText,
        rating: Number(reviewRating),
      });
      setReviewText("");
      setReviewRating(5);
      await loadProduct(id);
      alert("Review added");
    } catch (e: any) {
      alert(e?.response?.data?.error || "Failed to submit review");
    }
  }

  return (
    <>
      <Head>
        <title>{product ? `${product.name} | GreenThreads` : "Product | GreenThreads"}</title>
      </Head>

      <div>
        <nav className="navbar">
          <div className="container nav-inner">
            <Link href="/" className="nav-logo"><span className="leaf">🌿</span> GreenThreads</Link>
            <div className="nav-links">
              <Link href="/shop" className="active">Shop</Link>
              <Link href="/orders">Orders</Link>
              <Link href="/profile">Profile</Link>
              <Link href="/cart" className="btn-nav nav-cart-icon">🛒</Link>
            </div>
          </div>
        </nav>

        <section className="section-sm">
          <div className="container">
            <div style={{ marginBottom: 20 }}><Link href="/shop">← Back to Shop</Link></div>

            {loading && <p>Loading product...</p>}
            {error && <p style={{ color: "crimson" }}>{error}</p>}

            {!loading && product && (
              <>
                <div className="product-detail-grid">
                  <div>
                    <div className="main-img">
                      <img src={activeImage || "https://via.placeholder.com/800x800?text=No+Image"} alt={product.name} />
                    </div>
                    <div className="thumb-strip">
                      {(product.images || []).map((img, idx) => (
                        <div key={idx} className={`thumb ${activeImage === img ? "active" : ""}`} onClick={() => setActiveImage(img)} style={{ cursor: "pointer" }}>
                          <img src={img} alt={`view-${idx}`} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="product-detail-info">
                    <h1>{product.name}</h1>
                    <div className="product-price-row"><span className="detail-price">₹ {product.basePrice}</span></div>
                    <p style={{ margin: "12px 0", color: "var(--text-mid)" }}>{product.description}</p>
                    <div className="detail-meta">
                      <span className="detail-meta-item">Type: {product.type}</span>
                      <span className="detail-meta-item">Stock: {product.stock}</span>
                    </div>

                    <div className="qty-row" style={{ marginTop: 14 }}>
                      <label className="form-label" style={{ margin: 0 }}>Quantity</label>
                      <div className="qty-control">
                        <button className="qty-btn" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
                        <input className="qty-display" type="text" value={qty} readOnly />
                        <button className="qty-btn" onClick={() => setQty((q) => Math.min(product.stock || 1, q + 1))}>+</button>
                      </div>
                    </div>

                    <div className="detail-btns" style={{ marginTop: 16 }}>
                      <button className="btn btn-primary btn-lg" style={{ flex: 1 }} disabled={!canAdd} onClick={addToCart}>
                        {canAdd ? "🛒 Add to Cart" : "Out of Stock"}
                      </button>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: 40 }}>
                  <h3>Reviews</h3>
                  <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
                    {reviews.length === 0 && <p>No reviews yet.</p>}
                    {reviews.map((r) => (
                      <div key={r.id} style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: 12 }}>
                        <div style={{ fontWeight: 700 }}>{r.user?.name || "User"} • ⭐ {r.rating}</div>
                        <div>{r.text}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: 20, border: "1px solid #e5e7eb", borderRadius: 8, padding: 12 }}>
                    <h4>Add Review</h4>
                    <div style={{ margin: "8px 0" }}>
                      <label>Rating: </label>
                      <select value={reviewRating} onChange={(e) => setReviewRating(Number(e.target.value))}>
                        {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                    <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} rows={4} style={{ width: "100%", padding: 8 }} placeholder="Write your review..." />
                    <button className="btn btn-primary" style={{ marginTop: 8 }} onClick={submitReview}>Submit Review</button>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </>
  );
}