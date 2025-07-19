"use client";
import { useState, useMemo } from "react";
import CasinoList from "./CasinoList";
import CasinoCategoryNav from "./CasinoCategoryNav";

export default function CasinoListClient({ casinos, categories }: { casinos: any[]; categories: any[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  const filteredCasinos = useMemo(() => {
    return casinos.filter((casino: any) => {
      const inCategory =
        !selectedCategory ||
        (Array.isArray(casino.categories) && casino.categories.some((cat: any) => cat.slug === selectedCategory));
      const inSearch =
        !search ||
        (casino.title && casino.title.toLowerCase().includes(search.toLowerCase()));
      return inCategory && inSearch;
    });
  }, [casinos, selectedCategory, search]);

  // Многоуровневая сортировка: isTop > isVerified > isLicensed > рейтинг > остальные
  const sortedCasinos = useMemo(() => {
    return [...filteredCasinos].sort((a, b) => {
      // 1. isTop
      if (a.isTop && !b.isTop) return -1;
      if (!a.isTop && b.isTop) return 1;
      // 2. isVerified
      if (a.isVerified && !b.isVerified) return -1;
      if (!a.isVerified && b.isVerified) return 1;
      // 3. isLicensed
      if (a.isLicensed && !b.isLicensed) return -1;
      if (!a.isLicensed && b.isLicensed) return 1;
      // 4. Рейтинг (по убыванию)
      const ratingA = typeof a.rating === 'number' ? a.rating : 0;
      const ratingB = typeof b.rating === 'number' ? b.rating : 0;
      if (ratingA > ratingB) return -1;
      if (ratingA < ratingB) return 1;
      // 5. Остальные (по порядку)
      return 0;
    });
  }, [filteredCasinos]);

  return (
    <>
      <CasinoCategoryNav
        categories={categories}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
        onSearch={setSearch}
      />
      <CasinoList casinos={sortedCasinos} />
    </>
  );
} 