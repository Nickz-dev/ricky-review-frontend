// @ts-nocheck
import React from "react";
import PromoSection from "@/components/PromoSection";
import { fetchAPI } from "../../../../lib/api";
import CasinoReviewPageClient from "./CasinoReviewPageClient";
import { Metadata, ResolvingMetadata } from "next";

export async function generateMetadata(params: any, parent?: any): Promise<any> {
  const slug = params?.params?.slug;
  const data = await fetchAPI(`casinos?filters[slug][$eq]=${slug}&populate[seo]=*`);
  const casino = data && data.length > 0 ? data[0] : null;
  const seo = casino?.seo || {};
  const domain = (seo.canonicalDomain || "http://rickycasinos.net").replace(/\/$/, "");
  const ogImage = seo.ogImage?.url ? domain + seo.ogImage.url : null;
  const canonical = domain + "/casino/" + casino?.slug;
  return {
    title: seo.metaTitle || casino?.title,
    description: seo.metaDescription || "",
    openGraph: {
      images: ogImage ? [ogImage] : [],
      title: seo.metaTitle || casino?.title,
      description: seo.metaDescription || "",
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

export default async function CasinoReviewPage(props: any) {
  const slug = props?.params?.slug;

  // 1. Получить казино по slug (populate[seo]=*)
  let casinoObj = null;
  try {
    const data = await fetchAPI(`casinos?filters[slug][$eq]=${slug}&populate[reviewBlocks][populate]=*&populate[seo]=*`);
    casinoObj = data && data.length > 0 ? data[0] : null;
  } catch (e) {
    return <div className="text-center py-12 text-lg text-red-400">Ошибка загрузки казино</div>;
  }

  if (!casinoObj) {
    return <div className="text-center py-12 text-lg text-red-400">Казино не найдено</div>;
  }

  // Получаем reviewBlocks (Dynamic Zone) из объекта казино
  const reviewBlocks = Array.isArray(casinoObj.reviewBlocks) ? casinoObj.reviewBlocks : [];

  // 2. Получить все промо (populate для backgroundImage и casino) — через fetch
  let promosArr = [];
  try {
    const promosData = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"}/api/promos?populate[casino]=1&populate[backgroundImage]=1`
    ).then(res => res.json());
    promosArr = promosData && Array.isArray(promosData.data) ? promosData.data : [];
  } catch (e) {
    // Можно показать ошибку или оставить promosArr пустым
  }

  // Фильтрация и парсинг промо под твою структуру
  const filteredPromos = promosArr
    .filter((promo: any) => promo.casino && String(promo.casino.id) === String(casinoObj.id))
    .map((promo: any) => ({
      id: promo.id,
      title: promo.title,
      description: promo.description,
      buttonText: promo.buttonText,
      buttonUrl: promo.buttonUrl,
      promoSubtitle: promo.promoSubtitle,
      promoAmount: promo.promoAmount,
      promoIcon: promo.promoIcon,
      image:
        promo.backgroundImage && promo.backgroundImage.length > 0
          ? (process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337") + promo.backgroundImage[0].url
          : null,
      // ...другие нужные поля
    }));

  // 3. Получить meta-данные для страницы казино
  let meta = null;
  try {
    const metaData = await fetchAPI(`casino-page-contents?filters[casino][id][$eq]=${casinoObj.id}&populate=anchors`);
    meta = metaData && metaData.length > 0 ? metaData[0] : null;
  } catch (e) {
    meta = null;
  }

  // 4. Получить модалки (оставим через fetchAPI, если работает)
  let modals = [];
  try {
    modals = await fetchAPI("modal-contents");
  } catch (e) {
    // Можно показать ошибку или оставить modals пустым
  }

  // 5. Получить FAQ для этого казино
  let faqs = [];
  try {
    const faqsData = await fetchAPI(`faqs?filters[casino][id][$eq]=${casinoObj.id}`);
    faqs = Array.isArray(faqsData) ? faqsData : [];
  } catch (e) {
    faqs = [];
  }

  return (
    <>
      <CasinoReviewPageClient
        casino={casinoObj}
        promos={filteredPromos}
        modals={modals}
        meta={meta}
        reviewBlocks={reviewBlocks}
        faqs={faqs}
      />
    </>
  );
} 