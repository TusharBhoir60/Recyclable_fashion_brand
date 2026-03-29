import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "./apiClient";

type Product = {
  id: string;
  name: string;
  basePrice: number;
  stock: number;
  images: string[];
  type: string;
  isActive: boolean;
};

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    (async () => {
      const res = await api.get("/products");
      const data = Array.isArray(res.data) ? res.data : res.data?.products || [];
      setProducts(data.filter((p: Product) => p.isActive));
    })();
  }, []);

  const addToCart = (p: Product) => {
    const raw = localStorage.getItem("cart");
    const cart = raw ? JSON.parse(raw) : [];
    const ex = cart.find((x: any) => x.productId === p.id);
    if (ex) ex.quantity += 1;
    else cart.push({ productId: p.id, name: p.name, price: p.basePrice, image: p.images?.[0], quantity: 1 });
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added");
  };

  return (
    <>
      <Head><title>Shop</title></Head>
      <div className="container" style={{ padding: 20 }}>
        <h1>Shop</h1>
        <div className="product-grid">
          {products.map((p) => (
            <div className="product-card" key={p.id}>
              <img src={p.images?.[0] || "https://via.placeholder.com/300"} alt={p.name} />
              <h3>{p.name}</h3>
              <p>₹ {p.basePrice}</p>
              <div style={{ display: "flex", gap: 8 }}>
                <Link href={`/product-detail?id=${p.id}`} className="btn btn-outline">View</Link>
                <button className="btn btn-primary" onClick={() => addToCart(p)}>Add</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}