import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect } from "react";
import "../style.css";
import "../admin/admin-style.css";

const PUBLIC_ROUTES = ["/", "/login", "/signup", "/shop", "/product-detail"];

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const isPublic = PUBLIC_ROUTES.includes(router.pathname);

    if (!token && !isPublic) router.replace("/login");
  }, [router.pathname]);

  return <Component {...pageProps} />;
}