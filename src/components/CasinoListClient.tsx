"use client";
import { useState, useMemo } from "react";
import CasinoList from "./CasinoList";
import CasinoCategoryNav from "./CasinoCategoryNav";

export default function CasinoListClient({ casinos, categories }: { casinos: any[]; categories: any[] }) {
  const [search, setSearch] = useState<string>("");

  const filteredCasinos = useMemo(() => {
    if (!Array.isArray(casinos)) return [];
    
    if (!search || !search.trim()) {
      return casinos;
    }
    
    const searchLower = search.toLowerCase().trim();
    return casinos.filter((casino: any) => {
      const title = casino.title || casino.name || "";
      const description = casino.description || "";
      
      return (
        title.toLowerCase().includes(searchLower) ||
        description.toLowerCase().includes(searchLower)
      );
    });
  }, [casinos, search]);

  const sortedCasinos = useMemo(() => {
    return [...filteredCasinos].sort((a, b) => {
      if (a.isTop && !b.isTop) return -1;
      if (!a.isTop && b.isTop) return 1;
      if (a.isVerified && !b.isVerified) return -1;
      if (!a.isVerified && b.isVerified) return 1;
      if (a.isLicensed && !b.isLicensed) return -1;
      if (!a.isLicensed && b.isLicensed) return 1;
      const ratingA = typeof a.rating === 'number' ? a.rating : 0;
      const ratingB = typeof b.rating === 'number' ? b.rating : 0;
      if (ratingA > ratingB) return -1;
      if (ratingA < ratingB) return 1;
      return 0;
    });
  }, [filteredCasinos]);

  return (
    <>
      <CasinoCategoryNav
        categories={categories}
        onSearch={setSearch}
      />
      <CasinoList casinos={sortedCasinos} />
    </>
  );
} 