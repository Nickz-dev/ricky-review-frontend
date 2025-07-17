"use client";
import React from "react";

interface Category {
  id: number;
  name: string;
  slug: string;
  icon?: React.ReactNode;
}

interface CasinoCategoryNavProps {
  categories: Category[];
  selected: string;
  onSelect: (slug: string) => void;
  onSearch: (query: string) => void;
}

const CasinoCategoryNav: React.FC<CasinoCategoryNavProps> = ({ categories, selected, onSelect, onSearch }) => {
  const [search, setSearch] = React.useState("");

  return (
    <div className="flex justify-center w-full">
      <nav className="flex items-center gap-6 overflow-x-auto py-4 px-2 bg-gradient-to-r from-[#1a1122] to-[#181024] border-b border-[#2c2b3a] justify-center w-full">
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`flex flex-col items-center px-3 py-1 focus:outline-none transition ${selected === cat.slug ? "text-orange-400" : "text-white/80 hover:text-orange-300"}`}
            onClick={() => onSelect(cat.slug)}
          >
            {/* SVG или emoji-иконка из cat.icon, если есть */}
            <span className="mb-1 text-2xl">
              {cat.icon ? (
                typeof cat.icon === 'string' && cat.icon.startsWith('http') ? (
                  <img src={cat.icon} alt={cat.name} className="w-8 h-8 object-contain" />
                ) : (
                  cat.icon
                )
              ) : (
                "🎰"
              )}
            </span>
            <span className="text-xs font-bold tracking-wide uppercase mt-1">{cat.name}</span>
          </button>
        ))}
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
          {/* Красивая иконка поиска (SVG) */}
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