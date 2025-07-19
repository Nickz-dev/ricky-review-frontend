// @ts-nocheck
// frontend/src/app/sitemap.xml/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rickycasinos.net";
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
  try {
    const res = await fetch(`${strapiUrl}/api/casinos?fields[0]=slug`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error("Failed to fetch from Strapi");
    const data = await res.json();
    const casinoSlugs: string[] = data.data?.map((item: any) => item.slug).filter(Boolean) || [];

    const urls = [
      "", // главная
      ...casinoSlugs.map((slug: string) => `/casino/${slug}`),
    ];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => url
      ? `<url><loc>${baseUrl.replace(/\/$/, "")}${url}</loc></url>`
      : `<url><loc>${baseUrl.replace(/\/$/, "")}</loc></url>`
  )
  .join("\n")}
</urlset>`;

    return new NextResponse(sitemap, {
      headers: {
        "Content-Type": "application/xml",
      },
    });
  } catch (e) {
    // Логируем ошибку для отладки
    console.error("Sitemap generation error:", e);
    return new NextResponse("Sitemap generation error", { status: 500 });
  }
}