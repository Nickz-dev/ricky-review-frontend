import React from "react";
import SafeExternalLink from "./SafeExternalLink";

interface PromoSectionProps {
  promos: any[];
}

const PromoSection: React.FC<PromoSectionProps> = ({ promos }) => {
  if (!Array.isArray(promos) || promos.length === 0) return null;
  return (
    <section className="mb-10 flex flex-col items-center w-full">
      {promos.map((promo) => (
        <div
          key={promo.id}
          className="relative w-full max-w-5xl flex flex-col md:flex-row items-stretch bg-gradient-to-br from-[#2d0b3a] to-[#2a0a2e] rounded-2xl shadow-2xl overflow-hidden border border-purple-900"
        >
          {/* Левая часть: текст с креативными эффектами */}
          <div className="flex-1 p-8 flex flex-col justify-center z-10 relative overflow-visible">
            {/* SVG-волна/узор на фоне */}
            <svg
              className="absolute left-0 top-0 w-48 h-48 opacity-20 pointer-events-none -z-10"
              viewBox="0 0 200 200"
              fill="none"
            >
              <path
                d="M50,150 Q100,100 150,150 T200,150"
                stroke="#ffe066"
                strokeWidth="12"
                fill="none"
                opacity="0.3"
              />
              <ellipse cx="60" cy="60" rx="40" ry="18" fill="#ffe066" opacity="0.12" />
            </svg>
            {/* Glow/halo за заголовком */}
            <span className="absolute left-8 top-8 w-32 h-16 rounded-full bg-yellow-300 opacity-20 blur-2xl -z-10"></span>
            {/* Sparkles */}
            <span className="absolute left-4 top-4 animate-pulse-slow">
              <svg width="18" height="18" fill="none"><path d="M9 0l1.5 4.5L16 5l-4 3L13 16l-4-3L5 16l1.5-6L2 5l4.5-1L9 0z" fill="#ffe066"/></svg>
            </span>
            <span className="absolute right-8 bottom-8 animate-pulse-slow">
              <svg width="12" height="12" fill="none"><path d="M6 0l1 3L10 3.5l-2 1.5L8 10l-2-1.5L4 10l1-4L2 3.5l3-0.5L6 0z" fill="#fffbe6"/></svg>
            </span>
            {/* Контент */}
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white relative z-10">
              {promo.title}
            </h2>
            {promo.description && (
              <p className="mb-4 text-gray-200 text-base md:text-lg leading-relaxed relative z-10">
                {promo.description}
              </p>
            )}
          </div>

          {/* Правая часть: бонус, стрелка и кнопка с креативными эффектами */}
          <div className="relative flex flex-col items-center justify-center bg-black/40 md:min-w-[350px] p-8 border-l border-purple-900 z-10 overflow-visible">
            {/* Градиентные лучи */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0">
              <svg width="180" height="180" viewBox="0 0 180 180" className="animate-spin-slow" style={{ opacity: 0.25 }}>
                <defs>
                  <radialGradient id="promo-glow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#ffe066" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#ffe066" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <circle cx="90" cy="90" r="80" fill="url(#promo-glow)" />
              </svg>
            </div>
            {/* Пульсирующее кольцо */}
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-4 border-yellow-300 opacity-30 animate-pulse z-0"></span>
            {/* Сумма и подзаголовок с sparkles */}
            {promo.promoSubtitle && (
              <div className="text-lg font-bold text-white mb-2 text-center z-10">
                {promo.promoSubtitle}
              </div>
            )}
            {promo.promoAmount && (
              <div className="text-5xl font-extrabold text-white mb-2 text-center z-10 relative">
                {promo.promoAmount}
                {/* Sparkles */}
                <span className="absolute -top-3 -right-6 animate-pulse-slow">
                  <svg width="24" height="24" fill="none"><path d="M12 0l2.5 7.5L22 9l-6 4.5L18 22l-6-4.5L6 22l2-8.5L2 9l7.5-1.5L12 0z" fill="#ffe066"/></svg>
                </span>
                <span className="absolute -bottom-3 -left-6 animate-pulse-slow">
                  <svg width="16" height="16" fill="none"><path d="M8 0l1.5 4.5L14 5l-4 3L12 14l-4-3L4 14l1.5-6L2 5l4.5-1L8 0z" fill="#fffbe6"/></svg>
                </span>
              </div>
            )}
            {promo.promoIcon && (
              <div className="mb-2 flex justify-center z-10">
                <img src={promo.promoIcon} alt="promo icon" className="w-16 h-16 object-contain" />
              </div>
            )}
            {/* Стрелка над кнопкой и сама кнопка */}
            <div className="flex flex-col items-center w-full mt-4 z-10">
              <svg
                className="w-10 h-10 mb-2 animate-bounce"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ filter: "drop-shadow(0 0 8px #ffe066)" }}
              >
                <polygon points="32,48 16,32 24,32 24,16 40,16 40,32 48,32" fill="#ffe066" />
                <polygon points="32,60 8,36 20,36 20,24 44,24 44,36 56,36" fill="#bfa32c" opacity="0.7" />
              </svg>
              {promo.buttonUrl && promo.buttonText && (
                <SafeExternalLink
                  href={promo.buttonUrl}
                  className="mt-0 inline-block bg-gradient-to-r from-orange-400 to-pink-500 text-white font-bold px-8 py-3 rounded-lg shadow hover:brightness-110 transition border-2 border-orange-400 hover:border-pink-500 focus:outline-none focus:ring-2 focus:ring-orange-300 text-lg"
                >
                  {promo.buttonText}
                </SafeExternalLink>
              )}
            </div>
          </div>

          {/* Фоновое изображение, если есть */}
          {Array.isArray(promo.backgroundImage) && promo.backgroundImage.length > 0 && promo.backgroundImage[0].url && (
            <img
              src={promo.backgroundImage[0].url}
              alt="promo background"
              className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none z-0"
            />
          )}
        </div>
      ))}
    </section>
  );
};

export default PromoSection; 