"use client";

import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h1 className="text-4xl font-bold mb-4">404 — Страница не найдена</h1>
      <p className="mb-8">Такой страницы не существует.</p>
      <button
        onClick={() => router.push("/")}
        className="px-6 py-3 bg-yellow-400 text-black rounded hover:bg-yellow-300 transition"
      >
        На главную
      </button>
    </div>
  );
} 