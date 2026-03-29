import fs from "node:fs";
import path from "node:path";
import Head from "next/head";
import Script from "next/script";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";

type PageProps = {
  title: string;
  bodyHtml: string;
  inlineScripts: string[];
};

const routeToHtmlFile: Record<string, string> = {
  "": "index.html",
  login: "login.html",
  signup: "signup.html",
  dashboard: "dashboard.html",
  shop: "shop.html",
  sell: "sell.html",
  orders: "orders.html",
  profile: "profile.html",
  cart: "cart.html",
  checkout: "checkout.html",
  "seller-dashboard": "seller-dashboard.html",
  "product-detail": "product-detail.html",
  "admin/dashboard": "admin/dashboard.html",
  "admin/manage-users": "admin/manage-users.html",
  "admin/manage-products": "admin/manage-products.html",
  "admin/manage-orders": "admin/manage-orders.html",
  "admin/earnings": "admin/earnings.html",
  "admin/reviews": "admin/reviews.html"
};

function parseLegacyHtml(fullHtml: string): PageProps {
  const titleMatch = fullHtml.match(/<title>([\s\S]*?)<\/title>/i);
  const bodyMatch = fullHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const body = bodyMatch ? bodyMatch[1] : fullHtml;

  const inlineScripts: string[] = [];
  const bodyWithoutScripts = body.replace(
    /<script\b[^>]*>([\s\S]*?)<\/script>/gi,
    (_match, scriptContent: string) => {
      if (scriptContent && scriptContent.trim()) {
        inlineScripts.push(scriptContent);
      }
      return "";
    }
  );

  return {
    title: titleMatch ? titleMatch[1].trim() : "GreenThreads",
    bodyHtml: bodyWithoutScripts,
    inlineScripts
  };
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (context) => {
  const slugParts = (context.params?.slug as string[] | undefined) ?? [];
  const routeKey = slugParts.join("/");
  const htmlFile = routeToHtmlFile[routeKey];

  if (!htmlFile) {
    return { notFound: true };
  }

  const htmlPath = path.join(process.cwd(), htmlFile);
  const fileContents = fs.readFileSync(htmlPath, "utf-8");

  return {
    props: parseLegacyHtml(fileContents)
  };
};

export default function LegacyPage({
  title,
  bodyHtml,
  inlineScripts
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <main dangerouslySetInnerHTML={{ __html: bodyHtml }} />
      {inlineScripts.map((scriptText, index) => (
        <Script
          key={`legacy-inline-${index}`}
          id={`legacy-inline-${index}`}
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: scriptText }}
        />
      ))}
    </>
  );
}
