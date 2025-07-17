"use client";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

function decodeUrl(encoded: string) {
  try {
    return decodeURIComponent(escape(atob(decodeURIComponent(encoded))));
  } catch {
    return "/";
  }
}

export default function OutRedirectPage() {
  const params = useSearchParams();
  const to = params.get("to");
  useEffect(() => {
    if (to) {
      const url = decodeUrl(to);
      window.location.replace(url);
    }
  }, [to]);
  return (
    <div className="flex items-center justify-center min-h-screen text-white bg-black">
      <div>Переходим по ссылке...</div>
    </div>
  );
} 