import type { AppProps } from "next/app";
import { useEffect } from "react";
import "../style.css";
import "../admin/admin-style.css";

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    import("../script.js").then(() => {
      document.dispatchEvent(new Event("DOMContentLoaded"));
    });
  }, []);

  return <Component {...pageProps} />;
}
