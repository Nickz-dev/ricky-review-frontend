"use client";
import React, { useState } from "react";
import FAQSection from "./FAQSection";
import Link from "next/link";


interface PageContentSectionProps {
  contents: any[];
  pageType?: string;
}

function renderStrapiText(node: any, idx: number) {
  // Ссылка
  if (node.type === "link" && node.url) {
    // Внутренняя ссылка (начинается с / или содержит rickycasinos.net)
    const isInternal = node.url.startsWith("/") || node.url.includes("rickycasinos.net");
    const children = node.children ? node.children.map(renderStrapiText) : node.text;
    if (isInternal) {
      // Убираем домен, если ссылка абсолютная
      const href = node.url.replace(/^https?:\/\/[^/]+/, "");
      return (
        <Link key={idx} href={href} legacyBehavior>
          <a>{children}</a>
        </Link>
      );
    }
    // Внешняя ссылка
    return (
      <a key={idx} href={node.url} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  // Жирный текст
  if (node.bold) {
    return <strong key={idx}>{node.text}</strong>;
  }
  // Обычный текст
  return node.text;
}

function renderStrapiBlocks(blocks: any[]) {
  if (!Array.isArray(blocks)) return null;
  return blocks.map((block, idx) => {
    if (block.type === "heading") {
      const level = block.level || 2;
      const Tag = `h${level}`;
      return React.createElement(Tag, { key: idx, className: "font-bold text-2xl my-4" }, block.children?.map(renderStrapiText));
    }
    if (block.type === "paragraph") {
      return <p key={idx} className="mb-3">{block.children?.map(renderStrapiText)}</p>;
    }
    if (block.type === "list") {
      return (
        <ul key={idx} className="list-disc ml-6 mb-3">
          {block.children?.map((li: any, i: number) =>
            <li key={i}>{li.children?.map(renderStrapiText)}</li>
          )}
        </ul>
      );
    }
    return null;
  });
}

const PageContentSection: React.FC<PageContentSectionProps> = ({ contents, pageType = "landing" }) => {
  const filtered = Array.isArray(contents)
    ? contents.filter(c => c.pageType === pageType)
    : [];
  if (filtered.length === 0) return null;

  const content = filtered[0];
  const mainTitle = content.mainTitle || content.title;
  const subtitle = content.subtitle;
  const html = content.content || content.contents;
  const buttonText = content.buttonText;
  const buttonUrl = content.buttonUrl;
  const rawFaq = content.faqs || [];
  let faqs: any[] = [];
  if (Array.isArray(rawFaq)) {
    faqs = rawFaq;
  } else if (rawFaq && typeof rawFaq === "object") {
    faqs = [rawFaq];
  }

  // Разделяем блоки: первый paragraph и остальные
  let firstParagraph = null;
  let restBlocks: any[] = [];
  if (Array.isArray(html)) {
    const firstIdx = html.findIndex(b => b.type === "paragraph");
    if (firstIdx !== -1) {
      firstParagraph = html[firstIdx];
      restBlocks = [...html.slice(0, firstIdx), ...html.slice(firstIdx + 1)];
    } else {
      restBlocks = html;
    }
  }

  const [expanded, setExpanded] = useState(false);

  return (
    <section className="my-12 max-w-4xl mx-auto px-4">
      {mainTitle && (
        <h2 className="text-5xl font-extrabold text-orange-400 text-center mb-6">{mainTitle}</h2>
      )}
      {subtitle && (
        <h3 className="text-3xl font-bold text-orange-300 mb-4">{subtitle}</h3>
      )}
      {/* Первый абзац */}
      {firstParagraph && (
        <div className="prose prose-invert text-lg mb-6">
          {renderStrapiBlocks([firstParagraph])}
        </div>
      )}
      {/* Кнопка и раскрывающаяся часть */}
      {!expanded && (restBlocks.length > 0 || faqs.length > 0) && (
        <div className="flex justify-center">
          <button
            className="px-8 py-3 rounded-lg border border-orange-400 text-white font-bold mt-4 hover:bg-orange-400 hover:text-black transition"
            onClick={() => setExpanded(true)}
          >
             {buttonText}
          </button>
        </div>
      )}
      {expanded && (
        <>
          {restBlocks.length > 0 && (
            <div className="prose prose-invert text-lg mb-6">
              {renderStrapiBlocks(restBlocks)}
            </div>
          )}
          {faqs.length > 0 && (
            <div className="mt-12">
              <FAQSection faqs={faqs} />
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default PageContentSection; 