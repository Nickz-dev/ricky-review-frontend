import CasinoListClient from "@/components/CasinoListClient";
import HeroSection from "@/components/HeroSection";
import FooterSection from "@/components/FooterSection";
import PageContentSection from "@/components/PageContentSection";
import FAQSection from "@/components/FAQSection";
import { fetchAPI } from "../../lib/api";

function parseCasino(casino: any) {
  let logo = null;
  if (casino.logo && Array.isArray(casino.logo) && casino.logo.length > 0) {
    const logoObj = casino.logo[0];
    logo = logoObj && logoObj.url
      ? (process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337") + logoObj.url
      : null;
  }
  // Теперь категории — массив
  let categories = [];
  if (Array.isArray(casino.casino_categories)) {
    categories = casino.casino_categories.map((cat: any) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
    }));
  }
  // FAQ — массив
  const faqs = Array.isArray(casino.faqs) ? casino.faqs : [];
  // Промо — массив
  const promos = casino.promo ? [casino.promo] : [];
  return {
    ...casino,
    logo,
    categories,
    faqs,
    promos,
  };
}

function parseCategory(cat: any) {
  let icon = null;
  if (cat.icon && Array.isArray(cat.icon) && cat.icon.length > 0) {
    icon = (process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337") + cat.icon[0].url;
  }
  return {
    ...cat,
    icon,
  };
}

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

export default async function Home() {
  const heroArr = await fetchAPI("hero-sections?populate=background");
  const hero = Array.isArray(heroArr) ? heroArr[0] : null;
  const brandArr = await fetchAPI("brands?populate=logo");
  const brand = Array.isArray(brandArr) ? brandArr[0] : null;
  const pageContentsArr = await fetchAPI("page-contens?populate=faqs");
  const pageContent = Array.isArray(pageContentsArr) ? pageContentsArr[0] : null;
  const faqs = pageContent?.faqs || [];
  const games = await fetchAPI("games?populate=*");
  const categories = await fetchAPI("game-categories");
  const trustBlocks = await fetchAPI("trust-blocks");
  const footerArr = await fetchAPI("footers");
  const footer = Array.isArray(footerArr) ? footerArr[0] : null;
  const casinoCategoriesArr = await fetchAPI("casino-categories?populate=icon");
  const casinoCategories = Array.isArray(casinoCategoriesArr) ? casinoCategoriesArr.map(parseCategory) : [];
  const casinosArr = await fetchAPI("casinos?populate=*");
  const casinos = Array.isArray(casinosArr) ? casinosArr.map(parseCasino) : [];

  return (
    <main className="bg-black min-h-screen text-white">
      <HeroSection hero={hero} />
      <CasinoListClient casinos={casinos} categories={casinoCategories} />
      <PageContentSection contents={pageContentsArr} pageType="landing" />
      <FooterSection footer={footer} />
    </main>
  );
}