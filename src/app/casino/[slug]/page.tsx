// @ts-nocheck
import React from "react";
import PromoSection from "@/components/PromoSection";
import { fetchAPI } from "../../../../lib/api";
import CasinoReviewPageClient from "./CasinoReviewPageClient";
import { Metadata, ResolvingMetadata } from "next";

export async function generateMetadata(
  { params }: { params: { slug: string } },
  parent?: ResolvingMetadata
): Promise<Metadata> {
  const slug = params.slug;
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

export default async function CasinoReviewPage({ params }: { params: { slug: string } }) {
  const slug = params.slug;

  // 1. Получить казино по slug (populate[seo]=*)
  let casinoObj = null;
  try {
    const data = await fetchAPI(`casinos?filters[slug][$eq]=${slug}&populate[reviewBlocks][populate]=*&populate[seo]=*&populate=promo`);
    casinoObj = data && data.length > 0 ? data[0] : null;
  } catch (e) {
    return <div className="text-center py-12 text-lg text-red-400">Ошибка загрузки казино</div>;
  }

  if (!casinoObj) {
    return <div className="text-center py-12 text-lg text-red-400">Казино не найдено</div>;
  }

  // Получаем reviewBlocks (Dynamic Zone) из объекта казино
  const reviewBlocks = Array.isArray(casinoObj.reviewBlocks) ? casinoObj.reviewBlocks : [];

  // 2. Получить промо для этого казино
  const promos = casinoObj.promo ? [casinoObj.promo] : [];

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
        promos={promos}
        modals={modals}
        meta={meta}
        reviewBlocks={reviewBlocks}
        faqs={faqs}
      />
    </>
  );
} 