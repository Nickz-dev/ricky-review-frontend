"use client";
import React, { useState } from "react";
import SafeExternalLink from "./SafeExternalLink";

interface CasinoCardProps {
  casino: {
    id: number;
    title: string;
    slug: string;
    logo?: string;
    country?: string;
    rating?: number;
    category?: { id: number; name: string; slug: string } | null;
    promoBanner?: string;
    promoCode?: string;
    promoDescription?: string;
    providers?: string[];
    paymentMethods?: string[];
    devices?: string[];
    bonus?: string;
    isTop?: boolean;
    isVerified?: boolean;
    isLicensed?: boolean;
    playUrl?: string; // ссылка на казино для кнопки 'Играть'
  };
}

const CasinoCard: React.FC<CasinoCardProps> = ({ casino }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyPromo = async (promo: string) => {
    try {
      await navigator.clipboard.writeText(promo);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (e) {
      setCopied(false);
    }
  };

  return (
    <div className="bg-[#181024] rounded-2xl shadow-lg p-6 flex flex-col gap-4 items-center border border-[#2c2b3a] relative min-w-[320px] max-w-[370px] w-full mx-auto">
      {/* Логотип и бейджи */}
      <div className="flex flex-col items-center min-w-[120px] w-full">
        {casino.logo && (
          <img src={casino.logo} alt={casino.title} className="w-74 h-32 object-contain rounded-xl mb-2 bg-white/10" />
        )}
        <div className="flex flex-wrap gap-1 mt-1 justify-center w-full">
          {casino.isTop && <span className="bg-green-500 text-xs text-white px-2 py-0.5 rounded font-bold">ТОП</span>}
          {casino.isVerified && <span className="bg-blue-500 text-xs text-white px-2 py-0.5 rounded font-bold">Проверено</span>}
          {casino.isLicensed && <span className="bg-yellow-500 text-xs text-black px-2 py-0.5 rounded font-bold">Лицензия</span>}
        </div>
      </div>
      {/* Основная информация */}
      <div className="flex-1 w-full flex flex-col gap-2">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <h3 className="text-2xl font-extrabold text-white mr-2">{casino.title}</h3>
          {casino.country && <span className="text-sm text-gray-400">{casino.country}</span>}
          {casino.rating && (
            <span className="ml-2 text-yellow-400 font-bold flex items-center">★ {casino.rating.toFixed(1)}</span>
          )}
        </div>
        {/* Категория */}
        <div className="flex flex-wrap gap-2 mb-2">
          {casino.category && (
            <span className="bg-[#2c2b3a] text-orange-300 text-xs px-2 py-0.5 rounded font-semibold uppercase tracking-wide">
              {casino.category.name}
            </span>
          )}
        </div>
        {/* Промо-баннер и промокод */}
        {casino.promoBanner && (
          <div className="bg-gradient-to-r from-yellow-400 to-pink-500 rounded-lg p-2 flex flex-col md:flex-row items-center justify-between mb-2 gap-2 w-full">
            <span className="text-white font-bold text-sm mr-0 md:mr-4 whitespace-nowrap">{casino.promoBanner}</span>
            {casino.promoCode && (
              <span
                className="bg-white text-black font-bold px-2 py-1 rounded shadow border border-yellow-400 cursor-pointer select-all text-xs whitespace-nowrap transition"
                onClick={() => handleCopyPromo(casino.promoCode!)}
                title="Скопировать промокод"
              >
                {copied ? "Скопировано!" : casino.promoCode}
              </span>
            )}
          </div>
        )}
        {casino.promoDescription && (
          <div className="text-xs text-gray-300 mb-2">{casino.promoDescription}</div>
        )}
        {/* Списки */}
        <div className="flex flex-wrap gap-4 mb-2 text-sm">
          {casino.providers && (
            <div><span className="text-gray-400">Провайдеры:</span> {casino.providers.join(", ")}</div>
          )}
          {casino.paymentMethods && (
            <div><span className="text-gray-400">Платёжные системы:</span> {casino.paymentMethods.join(", ")}</div>
          )}
          {casino.devices && (
            <div><span className="text-gray-400">Устройства:</span> {casino.devices.join(", ")}</div>
          )}
        </div>
        {/* Кнопки */}
        <div className="flex flex-wrap justify-center gap-3 mt-2">
          {casino.playUrl && (
            <SafeExternalLink
              href={casino.playUrl}
              className="bg-gradient-to-r from-orange-400 to-pink-500 text-white font-bold px-6 py-2 rounded-lg shadow hover:brightness-110 transition border-2 border-orange-400 hover:border-pink-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
            >
              Играть
            </SafeExternalLink>
          )}
          <a href={`/casino/${casino.slug}`} className="bg-[#2c2b3a] text-orange-300 font-bold px-6 py-2 rounded-lg shadow hover:bg-orange-400 hover:text-white transition border border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-300">
            Обзор
          </a>
          {casino.bonus && (
            <span className="bg-green-500 text-white font-bold px-6 py-2 rounded-lg shadow border border-green-400 select-all">{casino.bonus}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CasinoCard; 