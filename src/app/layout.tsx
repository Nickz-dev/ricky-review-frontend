import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import { fetchAPI } from "../../lib/api";
import GoogleAnalytics from "../components/GoogleAnalytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata() {
  const heroArr = await fetchAPI("hero-sections?populate=seo");
  const hero = Array.isArray(heroArr) ? heroArr[0] : null;
  const seo = hero?.seo || {};
  const domain = (seo.canonicalDomain || "http://rickycasinos.net").replace(/\/$/, "");
  const seoTitle = seo.metaTitle || hero?.title || "Ricky rating - топ онлайн казино 2025";
  const seoDescription = seo.metaDescription || "Лучшие онлайн казино, честные обзоры, бонусы и рейтинги на 2025 год.";
  let ogImage = null;
  if (seo.ogImage && seo.ogImage.url) {
    ogImage = domain + seo.ogImage.url;
  }
  const canonical = domain + "/";
  return {
    title: seoTitle,
    description: seoDescription,
    openGraph: {
      images: ogImage ? [ogImage] : [],
      title: seoTitle,
      description: seoDescription,
      url: canonical,
    },
    alternates: {
      canonical,
    },
    icons: {
      icon: ogImage || "/favicon.ico"
    }
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Получаем бренд только для Header (без seo)
  const [brand] = await fetchAPI("brands?populate=logo");
  const modalContents = await fetchAPI("modal-contents");

  return (
    <html lang="ru">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        {/* <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#ff9800" /> */}
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} bg-black text-white`}>
        <GoogleAnalytics />
        <Header brand={brand} modalContents={modalContents} />
        {children}
      </body>
    </html>
  );
}
