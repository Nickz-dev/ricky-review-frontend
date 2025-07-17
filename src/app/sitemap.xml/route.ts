// @ts-nocheck
// frontend/src/app/sitemap.xml/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rickycasinos.net";
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
  let casinoSlugs = [];
  try {
    const res = await fetch(`${strapiUrl}/api/casinos?fields[0]=slug`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const data = await res.json();
      casinoSlugs = data.data?.map((item) => item.attributes?.slug).filter(Boolean) || [];
    }
  } catch (e) {
    // Логируем ошибку для отладки, но не прерываем генерацию sitemap
    console.error("Sitemap generation error:", e);
  }

  const urls = [
    "", // главная
    ...casinoSlugs.map((slug) => `/casino/${slug}`),
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map(
      (url) => `<url><loc>${baseUrl.replace(/\/$/, "")}${url ? "/" + url : ""}</loc></url>`
    )
    .join("\n")}\n</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}