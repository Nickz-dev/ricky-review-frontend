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

  return (
    <>
      <CasinoCategoryNav
        categories={categories}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
        onSearch={setSearch}
      />
      <CasinoList casinos={filteredCasinos} />
    </>
  );
} 