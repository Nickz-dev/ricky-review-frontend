'use client';
import { useEffect, useState } from "react";
import SafeExternalLink from "@/components/SafeExternalLink";
import Modal from "@/components/Modal";
import PromoSection from "@/components/PromoSection";
import AnchorNav from "@/components/AnchorNav";
import renderStrapiBlocks from "./renderStrapiBlocks";
import FAQSection from "@/components/FAQSection";

export default function CasinoReviewPageClient({ casino, promos, modals, meta, reviewBlocks, faqs }: any) {
  const [modal, setModal] = useState<"signup" | "login" | null>(null);
  const getModalContent = (type: "signup" | "login" | null) => {
    if (!type) return { title: "", description: "", showMirrorButton: false };
    const found = modals.find((item: any) => item.type === type);
    return found || { title: "", description: "", showMirrorButton: false };
  };
  const modalContent = getModalContent(modal);

  // Structured data (Review)
  useEffect(() => {
    if (!casino) return;
    const scriptId = "casino-review-structured-data";
    // Удаляем старый скрипт, если есть
    const old = document.getElementById(scriptId);
    if (old) old.remove();

    // Собираем structured data
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Review",
      "itemReviewed": {
        "@type": "Organization",
        "name": casino.title,
        "url": typeof window !== "undefined" ? window.location.href : "",
        "logo": casino.logo,
        "description": casino.description || "",
      },
      "author": {
        "@type": "Organization",
        "name": "RickyCasinos"
      },
      "reviewBody": casino.description || "",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": casino.rating || 5,
        "bestRating": 5,
        "worstRating": 1
      }
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = scriptId;
    script.innerHTML = JSON.stringify(jsonLd);
    document.head.appendChild(script);

    return () => {
      const el = document.getElementById(scriptId);
      if (el) el.remove();
    };
  }, [casino]);

  // Собираем якоря из reviewBlocks (shared.anchor-link)
  const anchorsFromBlocks = reviewBlocks
    .filter((block: any) => block.__component === "shared.anchor-link" && block.anchorId)
    .map((block: any) => ({
      anchorId: block.anchorId,
      label: block.label || block.anchorId,
    }));
  // Объединяем с meta.anchors, если есть
  const allAnchors = [
    ...(Array.isArray(meta?.anchors) ? meta.anchors : []),
    ...anchorsFromBlocks
  ];

  /*
    Пример блока anchor-link для rich text/Strapi:
    {
      "__component": "shared.anchor-link",
      "id": 1,
      "label": "Обзор",
      "anchorId": "overview"
    }
    // В rich text можно вставить <a href="#overview">Обзор</a> или использовать AnchorNav
  */

  return (
    <div className="w-full max-w-screen-2xl mx-auto py-10 px-4">
      {/* Промо для этого казино (в самом верху) */}
      <div className="mt-28">
        <PromoSection promos={promos} />
      </div>
      {/* Кнопки сверху */}
      <div className="flex flex-wrap gap-4 justify-center mb-8 mt-24 w-full">
        {casino.playUrl && (
          <SafeExternalLink
            href={casino.playUrl}
            className="flex-1 min-w-[200px] bg-gradient-to-r from-orange-400 to-pink-500 text-white font-bold px-8 py-3 rounded-lg shadow hover:brightness-110 transition border-2 border-orange-400 hover:border-pink-500 focus:outline-none focus:ring-2 focus:ring-orange-300 text-lg text-center"
          >
            CREATE ACCOUNT
          </SafeExternalLink>
        )}
        {casino.playUrl && (
          <SafeExternalLink
            href={casino.playUrl}
            className="flex-1 min-w-[200px] bg-[#2c2b3a] text-orange-300 font-bold px-8 py-3 rounded-lg shadow hover:bg-orange-400 hover:text-white transition border border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-300 text-lg text-center"
          >
            LOGIN
          </SafeExternalLink>
        )}
      </div>
      {allAnchors.length > 0 && <AnchorNav anchors={allAnchors} />}
      {/* H1 с названием казино */}
      {casino.title && (
        <h1 className="text-4xl md:text-5xl font-extrabold text-orange-400 text-center mb-8 drop-shadow-lg">
          {casino.title}
        </h1>
      )}
      {/* Обзор */}
      <section className="relative my-12">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1122] via-[#221a33] to-[#2c2b3a] rounded-2xl shadow-2xl opacity-90 blur-sm -z-10" />
        <div className="prose prose-invert max-w-none rounded-2xl shadow-xl border border-orange-400/30 bg-[#1a1122]/80 p-8 md:p-12 transition-all duration-700 animate-fade-in">
          <h2 className="text-3xl font-bold mb-6 text-orange-300 text-center tracking-tight drop-shadow-lg">Обзор казино</h2>
          {renderStrapiBlocks(reviewBlocks)}
        </div>
      </section>
      {/* FAQ */}
      {faqs && Array.isArray(faqs) && faqs.length > 0 && <FAQSection faqs={faqs} />}
      <Modal
        open={!!modal}
        onClose={() => setModal(null)}
        title={modalContent.title}
        description={modalContent.description}
        showMirrorButton={modalContent.showMirrorButton}
        mirrorUrl={modalContent.mirrorUrl}
      />
    </div>
  );
} 