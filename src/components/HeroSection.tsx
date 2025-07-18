import React from "react";
import SafeExternalLink from "./SafeExternalLink";

interface HeroSectionProps {
  hero?: {
    title?: string;
    subtitle?: string;
    highlight?: string;
    buttonText?: string;
    buttonUrl?: string;
    buttonType?: string;
    background?: Array<{
      url?: string;
      formats?: {
        large?: { url?: string };
        medium?: { url?: string };
        small?: { url?: string };
        thumbnail?: { url?: string };
      };
    }>;
    seo?: {
      metaTitle?: string;
      metaDescription?: string;
      ogImage?: { url?: string };
      canonicalDomain?: string;
    };
  };
}

const HeroSection: React.FC<HeroSectionProps> = ({ hero }) => {
  if (!hero) return null;
  // Получаем url фонового изображения
  let bgUrl = undefined;
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
  if (hero.background && hero.background.length > 0) {
    const bg = hero.background[0];
    bgUrl = bg.formats?.large?.url
      ? `${strapiUrl}${bg.formats.large.url}`
      : bg.url
        ? `${strapiUrl}${bg.url}`
        : undefined;
  }

  return (
    <section className="relative min-h-[480px] md:min-h-[600px] flex items-center justify-center text-center overflow-hidden">
      {/* Фоновое изображение */}
      {bgUrl && (
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${bgUrl})` }}
          aria-hidden="true"
        />
      )}
      {/* Overlay-градиент */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-black/60 via-black/20 to-[#1a1122]/90" aria-hidden="true" />
      {/* Контент */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full px-4 py-20 md:py-32">
        <div className="bg-black/70 backdrop-blur rounded-xl px-6 py-8 max-w-2xl mx-auto">
          {hero.title && (
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg">
              {hero.title}
            </h1>
          )}
          {hero.subtitle && (
            <div className="text-lg md:text-2xl font-bold text-white mb-2">
              {hero.subtitle}
            </div>
          )}
          {hero.highlight && (
            <div className="text-xl md:text-2xl font-bold text-orange-400 mb-6">
              {hero.highlight}
            </div>
          )}
          {hero.buttonText && (
            <SafeExternalLink
              href={hero.buttonUrl || "#"}
              className="bg-gradient-to-r from-[#FFB03A] to-[#FF3A7A] skew-x-[-18deg] shadow-lg transition hover:brightness-110 flex items-center justify-center rounded-lg"
              style={{ border: 'none', outline: 'none' }}
            >
              <span className="block skew-x-[18deg] px-20 py-4 text-white font-extrabold text-lg text-center">
                {hero.buttonText}
              </span>
            </SafeExternalLink>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 