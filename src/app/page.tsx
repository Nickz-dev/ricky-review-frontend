import CasinoListClient from "@/components/CasinoListClient";
import HeroSection from "@/components/HeroSection";
import FooterSection from "@/components/FooterSection";
import PageContentSection from "@/components/PageContentSection";
import FAQSection from "@/components/FAQSection";
import { fetchAPI } from "../../lib/api";

type NormalizedCategory = {
  id?: number | string | null;
  documentId?: string | null;
  name: string;
  slug: string;
  icon?: string | null;
  description?: string | null;
};

function normalizeSlug(rawSlug: any): string {
  if (!rawSlug) return "";
  if (typeof rawSlug === "string") return rawSlug.trim().toLowerCase();
  if (typeof rawSlug === "object") {
    if ("value" in rawSlug && typeof rawSlug.value === "string") {
      return rawSlug.value.trim().toLowerCase();
    }
    if ("slug" in rawSlug && typeof rawSlug.slug === "string") {
      return rawSlug.slug.trim().toLowerCase();
    }
  }
  return String(rawSlug || "").trim().toLowerCase();
}

function mapCategory(cat: any): NormalizedCategory | null {
  if (!cat) return null;

  const catAttributes =
    cat.attributes ||
    cat.data?.attributes ||
    cat.data ||
    cat;

  const name = catAttributes?.name || cat.name || "";
  const slug = normalizeSlug(
    catAttributes?.slug ??
    cat.slug ??
    cat.data?.slug
  );
  const documentId =
    cat.documentId ??
    catAttributes?.documentId ??
    cat.data?.documentId ??
    cat.data?.attributes?.documentId ??
    null;
  const id = cat.id ?? cat.data?.id ?? catAttributes?.id ?? null;

  if (!name || !slug) {
    return null;
  }

  return {
    id,
    documentId,
    name,
    slug,
  };
}

function parseCasino(casino: any) {
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
  
  // Обрабатываем структуру Strapi: может быть casino.attributes или casino напрямую
  const casinoData = casino.attributes || casino;

  // Медиа в Strapi приходят как { data: [...] }
  const logoData = casinoData.logo?.data || casinoData.logo || casino.logo?.data || casino.logo;
  let logo: string | null = null;
  if (Array.isArray(logoData) && logoData.length > 0) {
    const logoObj = logoData[0];
    const logoUrl = logoObj?.url || logoObj?.attributes?.url;
    logo = logoUrl ? `${baseUrl}${logoUrl}` : null;
  }

  // Категории — обрабатываем разные структуры (data/attributes)
  const rawCategories =
    casinoData.casino_categories?.data ||
    casinoData.casino_categories ||
    casino.casino_categories?.data ||
    casino.casino_categories ||
    casinoData.categories ||
    casino.categories ||
    [];

  const categories: NormalizedCategory[] = [];
  
  if (Array.isArray(rawCategories) && rawCategories.length > 0) {
    rawCategories.forEach((cat: any) => {
      const normalizedCategory = mapCategory(cat);
      if (normalizedCategory) {
        categories.push(normalizedCategory);
      }
    });
  }
  const categorySlugs = categories.map(cat => cat.slug);
  
  // FAQ — массив
  const faqs = Array.isArray(casinoData.faqs?.data) ? casinoData.faqs.data : 
               Array.isArray(casinoData.faqs) ? casinoData.faqs : [];
  
  // Промо — массив
  const promos = casinoData.promo ? [casinoData.promo] : [];
  
  // Возвращаем объединенные данные
  return {
    id: casino.id ?? casinoData.id,
    ...casinoData,
    ...casino,
    logo,
    categories,
    categorySlugs,
    faqs,
    promos,
  };
}

function parseCategory(cat: any): (NormalizedCategory & Record<string, any>) | null {
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
  const iconData = cat.icon?.data || cat.icon;
  let icon = null;
  if (Array.isArray(iconData) && iconData.length > 0) {
    const iconObj = iconData[0];
    const iconUrl = iconObj?.url || iconObj?.attributes?.url;
    icon = iconUrl ? baseUrl + iconUrl : null;
  }
  const catData = cat.attributes || cat;
  
  const normalized = mapCategory(cat);
  if (!normalized) {
    return null;
  }
  
  return {
    ...catData,
    ...normalized,
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
  const casinoCategories = Array.isArray(casinoCategoriesArr)
    ? casinoCategoriesArr
        .map(parseCategory)
        .filter((cat): cat is (NormalizedCategory & Record<string, any>) => Boolean(cat))
    : [];
  
  // Загружаем все казино для главной страницы
  let casinosArr: any[] = [];
  try {
    const result = await fetchAPI("casinos?populate=*");
    casinosArr = Array.isArray(result) ? result : [];
  } catch {
    try {
      const result = await fetchAPI("casinos");
      casinosArr = Array.isArray(result) ? result : [];
    } catch {
      casinosArr = [];
    }
  }
  const casinos = Array.isArray(casinosArr) ? casinosArr.map(parseCasino) : [];
  
  // Сортируем казино по приоритету:
  // 1. Все 3 булевых true (isTop, isVerified, isLicensed)
  // 2. Хотя бы 1 из булевых true
  // 3. Все булевые false/null
  casinos.sort((a, b) => {
    const aData = a.attributes || a;
    const bData = b.attributes || b;
    
    const aIsTop = aData.isTop ?? a.isTop ?? false;
    const aIsVerified = aData.isVerified ?? a.isVerified ?? false;
    const aIsLicensed = aData.isLicensed ?? a.isLicensed ?? false;
    const aAllTrue = aIsTop && aIsVerified && aIsLicensed;
    const aAnyTrue = aIsTop || aIsVerified || aIsLicensed;
    
    const bIsTop = bData.isTop ?? b.isTop ?? false;
    const bIsVerified = bData.isVerified ?? b.isVerified ?? false;
    const bIsLicensed = bData.isLicensed ?? b.isLicensed ?? false;
    const bAllTrue = bIsTop && bIsVerified && bIsLicensed;
    const bAnyTrue = bIsTop || bIsVerified || bIsLicensed;
    
    // Приоритет 1: все 3 true
    if (aAllTrue && !bAllTrue) return -1;
    if (!aAllTrue && bAllTrue) return 1;
    
    // Приоритет 2: хотя бы 1 true
    if (aAnyTrue && !bAnyTrue) return -1;
    if (!aAnyTrue && bAnyTrue) return 1;
    
    // Приоритет 3: остальные (уже отсортированы)
    return 0;
  });

  return (
    <main className="bg-black min-h-screen text-white">
      <HeroSection hero={hero} />
      <CasinoListClient casinos={casinos} categories={casinoCategories} />
      <PageContentSection contents={pageContentsArr} pageType="landing" />
      <FooterSection footer={footer} />
    </main>
  );
}