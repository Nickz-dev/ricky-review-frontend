import CasinoListClient from "@/components/CasinoListClient";
import HeroSection from "@/components/HeroSection";
import FooterSection from "@/components/FooterSection";
import PageContentSection from "@/components/PageContentSection";
import FAQSection from "@/components/FAQSection";
import { fetchAPI } from "../../lib/api";
// Удалён импорт Head

function parseCasino(casino: any) {
  let logo = null;
  if (casino.logo && Array.isArray(casino.logo) && casino.logo.length > 0) {
    const logoObj = casino.logo[0];
    logo = logoObj && logoObj.url
      ? (process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337") + logoObj.url
      : null;
  }
  let category = null;
  if (casino.casino_category) {
    category = {
      id: casino.casino_category.id,
      name: casino.casino_category.name,
      slug: casino.casino_category.slug,
    };
  }
  return {
    ...casino,
    logo,
    category,
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
  const hero = await fetchAPI("hero-sections?populate=background");
  const brandArr = await fetchAPI("brands?populate=logo");
  const brand = Array.isArray(brandArr) ? brandArr[0] : null;
  const pageContents = await fetchAPI("page-contens?populate=faq");
  const games = await fetchAPI("games?populate=*");
  const categories = await fetchAPI("game-categories");
  const trustBlocks = await fetchAPI("trust-blocks");
  const footer = await fetchAPI("footers");
  const casinoCategories = await fetchAPI("casino-categories?populate=icon");
  const casinos = await fetchAPI("casinos?populate=*");

  return (
    <main className="bg-black min-h-screen text-white">
      <HeroSection hero={hero[0]} />
      <CasinoListClient casinos={casinos.map(parseCasino)} categories={casinoCategories.map(parseCategory)} />
      <PageContentSection contents={pageContents} pageType="landing" />
      <FAQSection faqs={[]} />
      <FooterSection footer={footer[0]} />
    </main>
  );
}