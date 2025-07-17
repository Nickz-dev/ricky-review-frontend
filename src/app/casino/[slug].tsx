"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import SafeExternalLink from "../../components/SafeExternalLink";
import { fetchAPI } from "../../../lib/api";

function renderStrapiBlocks(blocks: any[]) {
  if (!Array.isArray(blocks)) return null;
  return blocks.map((block, idx) => {
    if (block.type === "paragraph") {
      return <p key={idx} className="mb-4 text-base text-gray-200">{block.children?.map((child: any, i: number) => child.text)}</p>;
    }
    if (block.type === "heading") {
      if (block.level === 2) {
        return <h2 key={idx} className="mt-8 mb-3 font-bold text-2xl text-orange-400">{block.children?.map((child: any, i: number) => child.text)}</h2>;
      }
      if (block.level === 3) {
        return <h3 key={idx} className="mt-6 mb-2 font-bold text-xl text-orange-300">{block.children?.map((child: any, i: number) => child.text)}</h3>;
      }
      if (block.level === 4) {
        return <h4 key={idx} className="mt-4 mb-2 font-bold text-lg text-orange-200">{block.children?.map((child: any, i: number) => child.text)}</h4>;
      }
      return <h2 key={idx} className="mt-8 mb-3 font-bold text-2xl text-orange-400">{block.children?.map((child: any, i: number) => child.text)}</h2>;
    }
    if (block.type === "image" && block.image && block.image.url) {
      return (
        <img
          key={idx}
          src={process.env.NEXT_PUBLIC_STRAPI_URL + block.image.url}
          alt={block.image.alternativeText || ""}
          className="my-6 rounded-lg shadow-lg mx-auto max-w-full"
        />
      );
    }
    // ... другие типы блоков
    return null;
  });
}

const CasinoReviewPage = ({ params }: { params: { slug: string } }) => {
  const [casino, setCasino] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCasino() {
      setLoading(true);
      const data = await fetchAPI(`casinos?filters[slug][$eq]=${params.slug}&populate=review,logo`);
      setCasino(data && data.length > 0 ? data[0] : null);
      setLoading(false);
    }
    loadCasino();
  }, [params.slug]);

  if (loading) return <div className="text-center py-12 text-lg text-gray-400">Загрузка...</div>;
  if (!casino) return <div className="text-center py-12 text-lg text-red-400">Казино не найдено</div>;

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      {/* Кнопки сверху */}
      <div className="flex flex-wrap gap-4 justify-center mb-8">
        {casino.playUrl && (
          <SafeExternalLink
            href={casino.playUrl}
            className="bg-gradient-to-r from-orange-400 to-pink-500 text-white font-bold px-8 py-3 rounded-lg shadow hover:brightness-110 transition border-2 border-orange-400 hover:border-pink-500 focus:outline-none focus:ring-2 focus:ring-orange-300 text-lg"
          >
            Играть
          </SafeExternalLink>
        )}
        {casino.officialUrl && (
          <SafeExternalLink
            href={casino.officialUrl}
            className="bg-[#2c2b3a] text-orange-300 font-bold px-8 py-3 rounded-lg shadow hover:bg-orange-400 hover:text-white transition border border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-300 text-lg"
          >
            Официальный сайт
          </SafeExternalLink>
        )}
      </div>
      {/* Обзор */}
      <div className="prose prose-invert max-w-none">
        {renderStrapiBlocks(casino.review)}
      </div>
    </div>
  );
};

export default CasinoReviewPage; 