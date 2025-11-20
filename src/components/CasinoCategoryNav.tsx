"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Category {
  id?: number | string | null;
  name?: string;
  slug?: string;
  documentId?: string | null;
  icon?: React.ReactNode;
  attributes?: {
    id?: number;
    name?: string;
    slug?: string;
    documentId?: string;
  };
  data?: {
    id?: number;
    name?: string;
    slug?: string;
    documentId?: string;
  };
}

interface CasinoCategoryNavProps {
  categories: Category[];
  onSearch: (query: string) => void;
}

const CasinoCategoryNav: React.FC<CasinoCategoryNavProps> = ({ categories, onSearch }) => {
  const [search, setSearch] = React.useState("");
  const pathname = usePathname();
  const isCategoryPage = pathname?.startsWith("/category/");
  const currentCategorySlug = isCategoryPage ? pathname.replace("/category/", "") : "";

  return (
    <div className="flex justify-center w-full">
      {/* Мобильный select */}
      <div className="block md:hidden w-full px-2 py-4">
        <select
          className="w-full rounded-lg bg-[#20162e] text-white px-4 py-2 border border-[#2c2b3a] focus:border-orange-400 focus:shadow-orange-200/20"
          value={currentCategorySlug}
          onChange={e => {
            const slug = e.target.value;
            if (slug) {
              window.location.href = `/category/${slug}`;
            } else {
              window.location.href = "/";
            }
          }}
        >
          <option value="">Все категории</option>
          {categories.map((cat, index) => {
            const slug = cat.slug || cat.attributes?.slug || cat.data?.slug || "";
            const name = cat.name || cat.attributes?.name || cat.data?.name || "";
            const documentId = cat.documentId || cat.attributes?.documentId || cat.data?.documentId || "";
            const keyValue = documentId || slug || `category-select-${index}`;
            return (
              <option key={keyValue} value={slug}>
                {name}
              </option>
            );
          })}
        </select>
      </div>
      {/* Десктопный nav */}
      <nav className="hidden md:flex items-center gap-6 overflow-x-auto py-4 px-2 bg-gradient-to-r from-[#1a1122] to-[#181024] border-b border-[#2c2b3a] justify-center w-full">
        <Link
          href="/"
          className={`flex flex-col items-center px-3 py-1 focus:outline-none transition ${!isCategoryPage ? "text-orange-400" : "text-white/80 hover:text-orange-300"}`}
        >
          <span className="mb-1 text-2xl">🎰</span>
          <span className="text-xs font-bold tracking-wide uppercase mt-1">Все</span>
        </Link>
        {categories.map((cat, index) => {
          const slug = cat.slug || cat.attributes?.slug || cat.data?.slug || "";
          const name = cat.name || cat.attributes?.name || cat.data?.name || "";
          const documentId = cat.documentId || cat.attributes?.documentId || cat.data?.documentId || "";
          const catId = documentId || slug || `category-btn-${index}`;
          const isActive = currentCategorySlug === slug;
          return (
            <Link
              key={catId}
              href={`/category/${slug}`}
              className={`flex flex-col items-center px-3 py-1 focus:outline-none transition ${isActive ? "text-orange-400" : "text-white/80 hover:text-orange-300"}`}
            >
              <span className="mb-1 text-2xl">
                {cat.icon && typeof cat.icon === 'string' ? (
                  <img src={cat.icon} alt={name} className="w-8 h-8 object-contain" />
                ) : (
                  "🎰"
                )}
              </span>
              <span className="text-xs font-bold tracking-wide uppercase mt-1">{name}</span>
            </Link>
          );
        })}
        {/* Поиск */}
        <div className="flex items-center ml-4 bg-[#20162e] rounded-full px-3 border border-[#2c2b3a] shadow-md transition-all focus-within:border-orange-400 focus-within:shadow-orange-200/20">
          <input
            type="text"
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              onSearch(e.target.value);
            }}
            placeholder="Поиск..."
            className="bg-transparent outline-none text-white px-2 py-1 w-36 md:w-48 placeholder:text-gray-400 transition-all focus:w-56"
          />
          <svg className="ml-2 w-5 h-5 text-orange-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </nav>
    </div>
  );
};

export default CasinoCategoryNav; 