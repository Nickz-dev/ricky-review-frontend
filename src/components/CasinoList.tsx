"use client";
import React, { useState, useEffect } from "react";
import CasinoCard from "./CasinoCard";

interface CasinoListProps {
  casinos: any[];
}

const INITIAL_LIMIT = 20;

const CasinoList: React.FC<CasinoListProps> = ({ casinos }) => {
  const [limit, setLimit] = useState(INITIAL_LIMIT);

  // Structured data (ItemList)
  useEffect(() => {
    if (!Array.isArray(casinos) || casinos.length === 0) return;
    const scriptId = "casino-list-structured-data";
    // Удаляем старый скрипт, если есть
    const old = document.getElementById(scriptId);
    if (old) old.remove();

    const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://rickycasinos.net";
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": casinos.map((casino, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "url": `${baseUrl}/casino/${casino.slug}`,
        "name": casino.title,
        ...(casino.rating ? { "rating": casino.rating } : {})
      }))
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
  }, [casinos]);

  if (!Array.isArray(casinos) || casinos.length === 0) {
    return <div className="text-center text-gray-400 py-12 text-lg">Казино не найдены.</div>;
  }

  const visibleCasinos = casinos.slice(0, limit);

  return (
    <div className="w-full max-w-screen-2xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-10 gap-y-8 xl:gap-y-12 my-8 px-2 sm:px-4 justify-center">
        {visibleCasinos.map(casino => (
          <CasinoCard key={casino.id} casino={casino} />
        ))}
      </div>
      {casinos.length > limit && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setLimit(l => l + INITIAL_LIMIT)}
            className="bg-gradient-to-r from-orange-400 to-pink-500 text-white font-bold px-8 py-3 rounded-lg shadow hover:brightness-110 transition border-2 border-orange-400 hover:border-pink-500 focus:outline-none focus:ring-2 focus:ring-orange-300 text-lg"
          >
            Загрузить еще
          </button>
        </div>
      )}
    </div>
  );
};

export default CasinoList; 