"use client";
import React, { useState, useEffect } from "react";

interface FAQSectionProps {
  faqs: any[];
}

const FAQSection: React.FC<FAQSectionProps> = ({ faqs }) => {
  const [openIndex, setOpenIndex] = useState(0); // Первый вопрос открыт по умолчанию
  if (!Array.isArray(faqs) || faqs.length === 0) return null;

  // Генерируем JSON-LD для FAQPage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const scriptId = "faq-structured-data";
    // Удаляем старый скрипт, если есть
    const old = document.getElementById(scriptId);
    if (old) old.remove();
    // Создаём новый
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = scriptId;
    script.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map((faq) => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer,
        },
      })),
    });
    document.head.appendChild(script);
    // Удаляем при размонтировании
    return () => {
      const el = document.getElementById(scriptId);
      if (el) el.remove();
    };
  }, [faqs]);

  return (
    <section className="mb-10 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-orange-400">FAQ</h2>
      {faqs.map((faq, idx) => (
        <div key={faq.id} className="mb-4 border border-orange-400 rounded-lg overflow-hidden">
          <button
            className={`w-full text-left px-5 py-4 bg-[#1a1122] hover:bg-orange-900/30 transition flex justify-between items-center cursor-pointer font-semibold text-lg text-yellow-300`}
            onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
            aria-expanded={openIndex === idx}
          >
            <span>{faq.question}</span>
            <span className={`ml-2 transition-transform ${openIndex === idx ? 'rotate-90' : ''}`}>▶</span>
          </button>
          <div
            className={`px-5 pb-4 text-gray-200 text-base bg-[#181024] transition-all duration-300 ease-in-out ${openIndex === idx ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
            style={{
              transitionProperty: 'max-height, opacity',
            }}
          >
            {faq.answer}
          </div>
        </div>
      ))}
    </section>
  );
};

export default FAQSection; 