"use client";
import React, { useState } from "react";
import Link from "next/link";
import { FaGift } from "react-icons/fa6";
import Modal from "./Modal";
import SafeExternalLink from "./SafeExternalLink";

interface HeaderProps {
  brand: any;
  modalContents: any[];
}

type ModalType = "signup" | "login" | "promo" | null;

const Header: React.FC<HeaderProps> = ({ brand, modalContents }) => {
  const [modal, setModal] = useState<ModalType>(null);

  // Получаем контент из modalContents по типу
  const getModalContent = (type: ModalType) => {
    if (!type) return { title: "", description: "", showMirrorButton: false };
    const found = modalContents.find((item) => item.type === type);
    return found || { title: "", description: "", showMirrorButton: false };
  };

  const modalContent = getModalContent(modal);

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-transparent backdrop-blur-sm transition-all">
        <div className="flex items-center justify-between px-4 py-3 w-full">
          {/* Логотип и бренд */}
          <div className="flex items-center gap-4">
            {brand && Array.isArray(brand.logo) && brand.logo.length > 0 && (
              <Link href="/">
                <img src={`${process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"}${brand.logo[0].url}`} alt="logo" className="h-8 w-auto cursor-pointer" />
              </Link>
            )}
            {/* {brand?.brand && (
              <span
                className="font-semibold text-lg font-bold"
                style={{ color: '#f3b75f' }}
              >
                {brand.brand}
              </span>
            )} */}
            <button
              className="flex items-center gap-2 ml-4 px-4 py-2  text-white font-bold rounded-lg shadow hover:brightness-110 transition cursor-pointer"
              onClick={() => setModal("promo")}
            >
              <FaGift className="text-xl" />
              <span>PROMOTIONS</span>
            </button>
          </div>
   
          {/* Кнопки */}
          <div className="hidden md:flex items-center gap-3">
            <button
              className="bg-gradient-to-r from-[#FFB03A] to-[#FF3A7A] skew-x-[-18deg] shadow-lg transition hover:brightness-110 flex items-center justify-center rounded-lg cursor-pointer"
              style={{ border: "none", outline: "none" }}
              onClick={() => setModal("signup")}
            >
              <span className="block skew-x-[18deg] px-8 py-3 text-white font-extrabold text-base text-center">CREATE ACCOUNT</span>
            </button>
            <button
              className="bg-white/5 skew-x-[-18deg] shadow-lg transition hover:bg-white/10 flex items-center justify-center rounded-lg cursor-pointer"
              style={{ border: "none", outline: "none" }}
              onClick={() => setModal("login")}
            >
              <span className="block skew-x-[18deg] px-8 py-3 text-white font-extrabold text-base text-center">LOGIN</span>
            </button>
          </div>
          {/* Мобильное меню (бургер) */}
          {/* <div className="md:hidden">
            <button className="text-white focus:outline-none">
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div> */}
        </div>
      </header>
      <Modal
        open={!!modal}
        onClose={() => setModal(null)}
        title={modalContent.title}
        description={modalContent.description}
        showMirrorButton={modalContent.showMirrorButton}
        mirrorUrl={modalContent.mirrorUrl}
      />
    </>
  );
};

export default Header;