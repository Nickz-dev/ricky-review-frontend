import CasinoListClient from "@/components/CasinoListClient";
import HeroSection from "@/components/HeroSection";
import FooterSection from "@/components/FooterSection";
import PageContentSection from "@/components/PageContentSection";
import { fetchAPI } from "../../../../lib/api";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type NormalizedCategory = {
  id?: number | string | null;
  documentId?: string | null;
  name: string;
  slug: string;
  icon?: string | null;
  description?: string | null;
};

function normalizeSlug(rawSlug: any): string {
  if (!rawSlug) return "";
  if (typeof rawSlug === "string") return rawSlug.trim().toLowerCase();
  if (typeof rawSlug === "object") {
    if ("value" in rawSlug && typeof rawSlug.value === "string") {
      return rawSlug.value.trim().toLowerCase();
    }
    if ("slug" in rawSlug && typeof rawSlug.slug === "string") {
      return rawSlug.slug.trim().toLowerCase();
    }
  }
  return String(rawSlug || "").trim().toLowerCase();
}

function mapCategory(cat: any): NormalizedCategory | null {
  if (!cat) return null;

  const catAttributes =
    cat.attributes ||
    cat.data?.attributes ||
    cat.data ||
    cat;

  const name = catAttributes?.name || cat.name || "";
  const slug = normalizeSlug(
    catAttributes?.slug ??
    cat.slug ??
    cat.data?.slug
  );
  const documentId =
    cat.documentId ??
    catAttributes?.documentId ??
    cat.data?.documentId ??
    cat.data?.attributes?.documentId ??
    null;
  const id = cat.id ?? cat.data?.id ?? catAttributes?.id ?? null;

  if (!name || !slug) {
    return null;
  }

  return {
    id,
    documentId,
    name,
    slug,
  };
}

function parseCategory(cat: any): (NormalizedCategory & Record<string, any>) | null {
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
  const iconData = cat.icon?.data || cat.icon;
  let icon: string | null = null;
  
  if (Array.isArray(iconData) && iconData.length > 0) {
    const iconObj = iconData[0];
    const iconUrl = iconObj?.url || iconObj?.attributes?.url;
    icon = iconUrl ? baseUrl + iconUrl : null;
  } else if (iconData && typeof iconData === "object") {
    // Если iconData - объект напрямую (не массив)
    const iconUrl = iconData?.url || iconData?.attributes?.url;
    icon = iconUrl ? baseUrl + iconUrl : null;
  } else if (typeof iconData === "string") {
    icon = iconData.startsWith("http") ? iconData : baseUrl + iconData;
  }
  
  const normalized = mapCategory(cat);
  if (!normalized) {
    return null;
  }
  
  // Возвращаем только нужные поля, избегая передачи сложных объектов
  return {
    id: normalized.id,
    documentId: normalized.documentId,
    name: normalized.name,
    slug: normalized.slug,
    icon: icon,
    description: normalized.description || cat.description || cat.attributes?.description || null,
  };
}

function parseCasino(casino: any) {
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
  const casinoData = casino.attributes || casino;
  const logoData = casinoData.logo?.data || casinoData.logo || casino.logo?.data || casino.logo;
  let logo: string | null = null;
  if (Array.isArray(logoData) && logoData.length > 0) {
    const logoObj = logoData[0];
    const logoUrl = logoObj?.url || logoObj?.attributes?.url;
    logo = logoUrl ? `${baseUrl}${logoUrl}` : null;
  }
  
  // Обрабатываем категории - пробуем разные варианты структуры
  const rawCategories =
    casinoData.casino_categories?.data ||
    casinoData.casino_categories ||
    casino.casino_categories?.data ||
    casino.casino_categories ||
    casinoData.categories ||
    casino.categories ||
    [];

  const categories: NormalizedCategory[] = [];
  const categorySlugsSet = new Set<string>();
  
  if (Array.isArray(rawCategories) && rawCategories.length > 0) {
    rawCategories.forEach((cat: any) => {
      const normalizedCategory = mapCategory(cat);
      if (normalizedCategory && normalizedCategory.slug) {
        const slug = normalizeSlug(normalizedCategory.slug);
        if (slug && !categorySlugsSet.has(slug)) {
          categories.push(normalizedCategory);
          categorySlugsSet.add(slug);
        }
      }
    });
  }
  
  // Также проверяем, может быть категории приходят как объект, а не массив
  if (categories.length === 0 && rawCategories && typeof rawCategories === 'object' && !Array.isArray(rawCategories)) {
    const normalizedCategory = mapCategory(rawCategories);
    if (normalizedCategory && normalizedCategory.slug) {
      const slug = normalizeSlug(normalizedCategory.slug);
      if (slug) {
        categories.push(normalizedCategory);
        categorySlugsSet.add(slug);
      }
    }
  }
  
  const categorySlugs = Array.from(categorySlugsSet);
  
  return {
    id: casino.id ?? casinoData.id,
    ...casinoData,
    ...casino,
    logo,
    categories,
    categorySlugs,
    // Сохраняем булевые поля явно
    isTop: casinoData.isTop ?? casino.isTop ?? false,
    isVerified: casinoData.isVerified ?? casino.isVerified ?? false,
    isLicensed: casinoData.isLicensed ?? casino.isLicensed ?? false,
  };
}

export async function generateMetadata(props: any): Promise<Metadata> {
  const params = await Promise.resolve(props.params);
  const categorySlug = normalizeSlug(params.slug);
  
  const categoryData = await fetchAPI(`casino-categories?filters[slug][$eq]=${categorySlug}`);
  const category = Array.isArray(categoryData) && categoryData.length > 0 ? categoryData[0] : null;
  
  if (!category) {
    return {
      title: "Категория не найдена",
      description: "",
    };
  }
  
  const categoryName = category.name || category.attributes?.name || "";
  const pageContentsArr = await fetchAPI("page-contens?populate=faqs");
  const pageContent = Array.isArray(pageContentsArr)
    ? pageContentsArr.find((c: any) => {
        const pageType = c.pageType || c.attributes?.pageType;
        return normalizeSlug(pageType) === categorySlug;
      })
    : null;
  
  const seoTitle = pageContent?.seoTitle || pageContent?.attributes?.seoTitle || `${categoryName} - Топ онлайн казино`;
  const seoDescription = pageContent?.seoDescription || pageContent?.attributes?.seoDescription || `Лучшие ${categoryName.toLowerCase()} онлайн казино, честные обзоры и рейтинги.`;
  
  const domain = "http://rickycasinos.net";
  const canonical = `${domain}/category/${categorySlug}`;
  
  return {
    title: seoTitle,
    description: seoDescription,
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url: canonical,
    },
    alternates: {
      canonical,
    },
  };
}

export default async function CategoryPage(props: any) {
  const params = await Promise.resolve(props.params);
  const categorySlug = normalizeSlug(params.slug);
  
  // Загружаем категорию с populate для казино и иконки
  let categoryData: any = null;
  try {
    // Пробуем разные варианты populate (упрощенный синтаксис)
    const populateQueries = [
      `casino-categories?filters[slug][$eq]=${categorySlug}&populate=*`,
      `casino-categories?filters[slug][$eq]=${categorySlug}&populate=icon`,
      `casino-categories?filters[slug][$eq]=${categorySlug}`,
    ];
    
    for (const query of populateQueries) {
      try {
        const result = await fetchAPI(query);
        if (Array.isArray(result) && result.length > 0) {
          categoryData = result;
          break;
        }
      } catch {
        continue;
      }
    }
  } catch {
    categoryData = null;
  }
  
  const category = Array.isArray(categoryData) && categoryData.length > 0 ? categoryData[0] : null;
  
  if (!category) {
    notFound();
  }
  
  // Получаем ID и documentId категории для фильтрации
  const categoryId = category.id ?? category.attributes?.id;
  const categoryDocumentId = category.documentId ?? category.attributes?.documentId;
  
  // Загружаем все категории для навигации
  const casinoCategoriesArr = await fetchAPI("casino-categories?populate=icon");
  const casinoCategories = Array.isArray(casinoCategoriesArr)
    ? casinoCategoriesArr
        .map(parseCategory)
        .filter((cat): cat is (NormalizedCategory & Record<string, any>) => Boolean(cat))
    : [];
  
  // Маппинг категорий на булевые поля казино
  const categoryToBooleanMap: Record<string, { field: string; value: boolean }> = {
    'approved': { field: 'isVerified', value: true },
    'licence': { field: 'isLicensed', value: true },
    'licensed': { field: 'isLicensed', value: true },
    'verified': { field: 'isVerified', value: true },
    'top': { field: 'isTop', value: true },
  };
  
  const categoryMapping = categoryToBooleanMap[categorySlug];
  
  // Проблема: API фильтрации возвращает только 1 элемент для каждой категории
  // Решение: используем запрос как на главной странице (casinos?populate=*),
  // но если casino_categories пустые, собираем казино через фильтрацию по всем категориям
  // Затем фильтруем на клиенте по casino_categories
  
  let allCasinosRaw: any[] = [];

  // ПОПЫТКА 1: Получаем все казино с явным populate для casino_categories
  // После настройки many-to-many связи нужно использовать явный populate
  const populateQueries = [
    "casinos?populate=casino_categories",
    "casinos?populate[0]=casino_categories",
    "casinos?populate[casino_categories]=*",
    "casinos?populate=casino_categories&populate=*",
    "casinos?populate=*",
  ];
  
  let hasCategories = false;
  for (const query of populateQueries) {
    try {
      const result = await fetchAPI(query);
      if (Array.isArray(result) && result.length > 0) {
        // Проверяем, заполнены ли casino_categories
        const casinosWithCategories = result.filter((casino: any) => {
          const categories = casino.casino_categories || casino.attributes?.casino_categories || [];
          return Array.isArray(categories) && categories.length > 0;
        });
        
        // Если у большинства казино есть категории, используем этот результат
        if (casinosWithCategories.length > result.length * 0.5) {
          allCasinosRaw = result;
          hasCategories = true;
          break;
        }
      }
    } catch {
      continue;
    }
  }
  
  // ПОПЫТКА 2: Если populate не работает, получаем казино из категорий (обратная связь)
  // В many-to-many связи поле в категории называется "casinos" (обратная связь)
  if (!hasCategories || allCasinosRaw.length === 0) {
    const existingCasinoIds = new Set<string | number>();
    
    // Получаем все категории с populate для поля "casinos" (обратная связь)
    // Пробуем разные варианты populate, чтобы найти рабочий
    let allCategories: any[] = [];
    const categoryPopulateQueries = [
      "casino-categories?populate=casinos",
      "casino-categories?populate[casinos]=*",
      "casino-categories?populate[casinos][populate]=*",
      "casino-categories?populate=deep",
      "casino-categories?populate=*",
      "casino-categories",
    ];
    
    for (const query of categoryPopulateQueries) {
      try {
        const result = await fetchAPI(query);
        if (Array.isArray(result) && result.length > 0) {
          // Проверяем, заполнены ли casinos в категориях
          const categoriesWithCasinos = result.filter((cat: any) => {
            const casinos = cat.casinos || cat.attributes?.casinos || cat.casinos?.data || cat.attributes?.casinos?.data;
            return Array.isArray(casinos) && casinos.length > 0;
          });
          
          allCategories = result;
          
          // Если хотя бы у одной категории есть казино, используем этот запрос
          if (categoriesWithCasinos.length > 0) {
            break;
          }
        }
      } catch {
        continue;
      }
    }
    
    // Для каждой категории получаем казино через обратную связь (поле "casinos" в категории)
    // Структура: { "casinos": [{ ...casino... }] }
    for (const cat of allCategories) {
      const catSlug = normalizeSlug(cat.slug || cat.attributes?.slug || "");
      
      // Поле "casinos" находится прямо в объекте категории (не в attributes)
      const casinosData = cat.casinos;
      
      if (Array.isArray(casinosData) && casinosData.length > 0) {
        // Если это массив казино
        casinosData.forEach((casino: any) => {
          const id = casino.documentId || casino.id;
          if (!id) return;
          
          // Инициализируем casino_categories, если его нет
          if (!casino.casino_categories || !Array.isArray(casino.casino_categories)) {
            casino.casino_categories = [];
          }
          
          // Добавляем текущую категорию к списку категорий казино
          const hasCategory = casino.casino_categories.some((c: any) => {
            const cSlug = normalizeSlug(c.slug || "");
            const cDocId = c.documentId;
            return cSlug === catSlug || cDocId === cat.documentId;
          });
          
          if (!hasCategory) {
            casino.casino_categories.push({
              id: cat.id,
              documentId: cat.documentId,
              slug: catSlug,
              name: cat.name,
            });
          }
          
          // Если казино уже есть в списке, обновляем его категории
          if (existingCasinoIds.has(id)) {
            const existingCasino = allCasinosRaw.find((c: any) => (c.documentId || c.id) === id);
            if (existingCasino) {
              // Обновляем категории существующего казино
              if (!existingCasino.casino_categories || !Array.isArray(existingCasino.casino_categories)) {
                existingCasino.casino_categories = [];
              }
              const existingHasCategory = existingCasino.casino_categories.some((c: any) => {
                const cSlug = normalizeSlug(c.slug || "");
                const cDocId = c.documentId;
                return cSlug === catSlug || cDocId === cat.documentId;
              });
              if (!existingHasCategory) {
                existingCasino.casino_categories.push({
                  id: cat.id,
                  documentId: cat.documentId,
                  slug: catSlug,
                  name: cat.name,
                });
              }
            }
          } else {
            // Добавляем новое казино
            existingCasinoIds.add(id);
            allCasinosRaw.push(casino);
          }
        });
      } else if (casinosData && !Array.isArray(casinosData)) {
        // Если это одно казино (не массив) - маловероятно, но на всякий случай
        const id = casinosData.documentId || casinosData.id;
        if (!id) return;
        
        if (!casinosData.casino_categories || !Array.isArray(casinosData.casino_categories)) {
          casinosData.casino_categories = [];
        }
        
        const hasCategory = casinosData.casino_categories.some((c: any) => {
          const cSlug = normalizeSlug(c.slug || "");
          const cDocId = c.documentId;
          return cSlug === catSlug || cDocId === cat.documentId;
        });
        
        if (!hasCategory) {
          casinosData.casino_categories.push({
            id: cat.id,
            documentId: cat.documentId,
            slug: catSlug,
            name: cat.name,
          });
        }
        
        // Если казино уже есть в списке, обновляем его категории
        if (existingCasinoIds.has(id)) {
          const existingCasino = allCasinosRaw.find((c: any) => (c.documentId || c.id) === id);
          if (existingCasino) {
            if (!existingCasino.casino_categories || !Array.isArray(existingCasino.casino_categories)) {
              existingCasino.casino_categories = [];
            }
            const existingHasCategory = existingCasino.casino_categories.some((c: any) => {
              const cSlug = normalizeSlug(c.slug || "");
              const cDocId = c.documentId;
              return cSlug === catSlug || cDocId === cat.documentId;
            });
            if (!existingHasCategory) {
              existingCasino.casino_categories.push({
                id: cat.id,
                documentId: cat.documentId,
                slug: catSlug,
                name: cat.name,
              });
            }
          }
        } else {
          existingCasinoIds.add(id);
          allCasinosRaw.push(casinosData);
        }
      } else {
        // Если казино не заполнены в категории, пробуем получить через фильтрацию
        const catSlug = normalizeSlug(cat.slug || cat.attributes?.slug || "");
        const catDocumentId = cat.documentId || cat.attributes?.documentId;
        const catId = cat.id || cat.attributes?.id;
        
        if (!catSlug && !catDocumentId && !catId) continue;
        
        // Пробуем фильтрацию казино по категории
        const filterQueries = [
          `casinos?filters[casino_categories][slug][$eq]=${catSlug}&populate=casino_categories`,
          `casinos?filters[casino_categories][slug][$eq]=${catSlug}&populate=*`,
          `casinos?filters[casino_categories][documentId][$eq]=${catDocumentId}&populate=casino_categories`,
          `casinos?filters[casino_categories][documentId][$eq]=${catDocumentId}&populate=*`,
        ];
        
        for (const query of filterQueries) {
          try {
            const result = await fetchAPI(query);
            if (Array.isArray(result) && result.length > 0) {
              result.forEach((casino: any) => {
                const id = casino.documentId || casino.id;
                if (id && !existingCasinoIds.has(id)) {
                  existingCasinoIds.add(id);
                  allCasinosRaw.push(casino);
                }
              });
              break; // Используем первый рабочий запрос
            }
          } catch {
            continue;
          }
        }
      }
    }
  }
  
  // НЕ загружаем все казино через populate=*, т.к. там casino_categories пустые
  // Используем только казино, полученные через фильтрацию по категориям
  // (там casino_categories заполнены правильно)
  
  // Парсим все казино один раз
  const allCasinosParsed = allCasinosRaw.map(parseCasino);
  
  // 1. Фильтруем казино для текущей категории на клиенте
  let categoryCasinos: any[] = [];
  
  if (categoryMapping) {
    // Для категорий с маппингом используем булевые поля
    categoryCasinos = allCasinosParsed.filter((casino: any) => {
      const fieldValue = casino[categoryMapping.field] ?? false;
      return fieldValue === categoryMapping.value;
    });
  } else {
    // Для категорий без маппинга фильтруем по raw данным напрямую
    // Проблема: API возвращает только последний элемент для каждой категории
    // Но когда получаем казино через фильтрацию, в casino_categories есть все категории этого казино
    // Поэтому проверяем все собранные казино на наличие нужной категории
    
    categoryCasinos = allCasinosRaw
      .filter((rawCasino: any) => {
        const rawCategories = rawCasino.casino_categories || [];
        
        // Если casino_categories пустой, пропускаем
        if (!Array.isArray(rawCategories) || rawCategories.length === 0) {
          return false;
        }
        
        // Проверяем, есть ли нужная категория в массиве
        const hasCategory = rawCategories.some((cat: any) => {
          const catSlug = normalizeSlug(cat.slug || "");
          const catDocumentId = cat.documentId;
          const catId = cat.id;
          
          // Проверяем по slug (основной способ)
          if (catSlug && catSlug === categorySlug) {
            return true;
          }
          
          // Проверяем по documentId
          if (categoryDocumentId && catDocumentId && catDocumentId === categoryDocumentId) {
            return true;
          }
          
          // Проверяем по id
          if (categoryId && catId && catId === categoryId) {
            return true;
          }
          
          return false;
        });
        
        return hasCategory;
      })
      .map(parseCasino); // Парсим отфильтрованные казино
    
    // Если отфильтровано меньше, чем собрано, значит некоторые казино были получены через фильтрацию по другим категориям
    // но имеют нужную категорию в casino_categories - используем их
    if (categoryCasinos.length < allCasinosRaw.length) {
      // Проверяем все собранные казино еще раз (на случай если фильтрация пропустила какие-то)
      const additionalCasinos = allCasinosRaw
        .filter((rawCasino: any) => {
          const rawCategories = rawCasino.casino_categories || [];
          if (!Array.isArray(rawCategories) || rawCategories.length === 0) {
            return false;
          }
          
          // Проверяем, есть ли нужная категория в массиве
          return rawCategories.some((cat: any) => {
            const catSlug = normalizeSlug(cat.slug || "");
            const catDocumentId = cat.documentId;
            const catId = cat.id;
            
            if (catSlug && catSlug === categorySlug) {
              return true;
            }
            if (categoryDocumentId && catDocumentId && catDocumentId === categoryDocumentId) {
              return true;
            }
            if (categoryId && catId && catId === categoryId) {
              return true;
            }
            return false;
          });
        })
        .map(parseCasino);
      
      // Объединяем с уже отфильтрованными (исключая дубликаты)
      const existingIds = new Set(categoryCasinos.map((c: any) => c.id || c.documentId));
      additionalCasinos.forEach((casino: any) => {
        const id = casino.id || casino.documentId;
        if (id && !existingIds.has(id)) {
          existingIds.add(id);
          categoryCasinos.push(casino);
        }
      });
    }
  }
  
  // 3. Загружаем все казино для сортировки по булевым полям (из всех категорий)
  let allCasinosForBooleans: any[] = [];
  try {
    const allCasinos = await fetchAPI("casinos?populate=*");
    allCasinosForBooleans = Array.isArray(allCasinos) ? allCasinos : [];
  } catch {
    allCasinosForBooleans = [];
  }
  
  const allCasinosParsedForBooleans = allCasinosForBooleans.map(parseCasino);
  
  // Фильтруем казино с булевыми полями (из всех категорий)
  const casinosWithBooleans = allCasinosParsedForBooleans
    .map((casino: any) => {
      const isTop = Boolean(casino.isTop ?? false);
      const isVerified = Boolean(casino.isVerified ?? false);
      const isLicensed = Boolean(casino.isLicensed ?? false);
      const trueCount = (isTop ? 1 : 0) + (isVerified ? 1 : 0) + (isLicensed ? 1 : 0);
      return { casino, trueCount };
    })
    .filter(({ trueCount }) => trueCount > 0) // Только казино с хотя бы одним true
    .sort((a, b) => b.trueCount - a.trueCount); // Сортируем по убыванию количества true
  
  // 4. Объединяем: сначала казино с булевыми (только из нужной категории), потом остальные казино из категории
  const casinoIdsSet = new Set<number | string>();
  const casinos: any[] = [];
  
  // Создаем Set с ID казино из нужной категории для быстрой проверки
  const categoryCasinoIds = new Set<number | string>();
  categoryCasinos.forEach((casino: any) => {
    const casinoId = casino.id || casino.documentId;
    if (casinoId) {
      categoryCasinoIds.add(casinoId);
    }
  });
  
  // Добавляем казино с булевыми, но ТОЛЬКО те, что из нужной категории
  casinosWithBooleans.forEach(({ casino }) => {
    const casinoId = casino.id || casino.documentId;
    if (casinoId && categoryCasinoIds.has(casinoId) && !casinoIdsSet.has(casinoId)) {
      casinoIdsSet.add(casinoId);
      casinos.push(casino);
    }
  });
  
  // Добавляем остальные казино из категории (исключая те, что уже добавлены)
  categoryCasinos.forEach((casino: any) => {
    const casinoId = casino.id || casino.documentId;
    if (casinoId && !casinoIdsSet.has(casinoId)) {
      casinoIdsSet.add(casinoId);
      casinos.push(casino);
    }
  });
  
  // Загружаем контент для этой категории (pageType = slug категории)
  const pageContentsArr = await fetchAPI("page-contens?populate=faqs");
  const footerArr = await fetchAPI("footers");
  const footer = Array.isArray(footerArr) ? footerArr[0] : null;
  const heroArr = await fetchAPI("hero-sections?populate=background");
  const hero = Array.isArray(heroArr) ? heroArr[0] : null;
  
  return (
    <main className="bg-black min-h-screen text-white">
      <HeroSection hero={hero} />
      <CasinoListClient casinos={casinos} categories={casinoCategories} />
      <PageContentSection contents={pageContentsArr} pageType={categorySlug} />
      <FooterSection footer={footer} />
    </main>
  );
}

