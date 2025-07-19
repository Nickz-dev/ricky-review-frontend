import React from "react";
import Link from "next/link";

function renderRichText(nodes: any[]) {
  if (!Array.isArray(nodes)) return null;
  return nodes.map((node, idx) => {
    // Ссылка
    if (node.type === "link" && node.url) {
      // Anchor link внутри страницы
      if (node.url.startsWith("#")) {
        const children = node.children ? node.children.map(renderRichText).flat() : node.text;
        // Если есть id, рендерим якорь
        const anchorProps: any = { href: node.url, key: idx };
        if (node.id) anchorProps.id = node.id;
        if (node.className) anchorProps.className = node.className;
        return (
          <a {...anchorProps}>
            {children}
          </a>
        );
      }
      // Внутренние ссылки (на сайт)
      const isInternal = node.url.startsWith("/") || node.url.includes("rickycasinos.net");
      const children = node.children ? node.children.map(renderRichText).flat() : node.text;
      if (isInternal) {
        const href = node.url.replace(/^https?:\/\/[^/]+/, "");
        return (
          <Link key={idx} href={href} {...(node.className ? { className: node.className } : {})}>
            {children}
          </Link>
        );
      }
      // Внешние ссылки
      return (
        <a key={idx} href={node.url} target="_blank" rel="noopener noreferrer" {...(node.className ? { className: node.className } : {})}>
          {children}
        </a>
      );
    }
    // Anchor (якорь)
    if (node.type === "anchor" && node.id) {
      return <a key={idx} id={node.id} className="block" />;
    }
    // Жирный текст
    if (node.bold) {
      return <strong key={idx}>{node.text}</strong>;
    }
    // Обычный текст
    if (node.type === "text") {
      return node.text;
    }
    // Параграф
    if (node.type === "paragraph") {
      return (
        <p key={idx} className="mb-4 text-base text-gray-200">
          {node.children?.map((child: any, i: number) => renderRichText([child])).flat()}
        </p>
      );
    }
    // Заголовки
    if (node.type === "heading") {
      const Tag = node.level === 3 ? "h3" : node.level === 4 ? "h4" : "h2";
      const className =
        Tag === "h2"
          ? "mt-8 mb-3 font-bold text-2xl text-orange-400"
          : Tag === "h3"
            ? "mt-6 mb-2 font-bold text-xl text-orange-300"
            : "mt-4 mb-2 font-bold text-lg text-orange-200";
      return (
        <Tag key={idx} className={className}>
          {node.children?.map((child: any, i: number) => renderRichText([child])).flat()}
        </Tag>
      );
    }
    // Можно добавить другие типы (списки, цитаты и т.д.)
    return null;
  });
}

export default function renderStrapiBlocks(blocks: any[]) {
  if (!blocks || !Array.isArray(blocks)) return null;
  return blocks.map((block, idx) => {
    switch (block.__component) {
      case "shared.text-block":
        return (
          <div key={idx} className="mb-4">
            {renderRichText(block.text)}
          </div>
        );
      case "shared.image-block":
        // Поддержка массива и объекта
        const imgObj = Array.isArray(block.image) ? block.image[0] : block.image;
        if (!imgObj || !imgObj.url) return null;
        const imageUrl = imgObj.url.startsWith("http")
          ? imgObj.url
          : `${process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"}${imgObj.url}`;
        return (
          <figure key={idx} className="my-4">
            <img
              src={imageUrl}
              alt={block.caption || imgObj.alternativeText || ""}
              className="rounded-lg shadow-lg mx-auto max-w-full"
            />
            {(block.caption || imgObj.caption) && (
              <figcaption className="text-sm text-gray-500">
                {block.caption || imgObj.caption}
              </figcaption>
            )}
          </figure>
        );
      case "shared.heading-block":
        const HeadingTag = block.level === "h3" ? "h3" : block.level === "h4" ? "h4" : "h2";
        const headingClass =
          HeadingTag === "h2"
            ? "mt-8 mb-3 font-bold text-2xl text-orange-400"
            : HeadingTag === "h3"
              ? "mt-6 mb-2 font-bold text-xl text-orange-300"
              : "mt-4 mb-2 font-bold text-lg text-orange-200";
        return (
          <HeadingTag key={idx} className={headingClass}>
            {block.text}
          </HeadingTag>
        );
      case "shared.anchor-link":
        return <a key={idx} id={block.anchorId} className="block" />;
      default:
        return null;
    }
  });
} 