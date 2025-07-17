import React from "react";
import SafeExternalLink from "./SafeExternalLink";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  showMirrorButton?: boolean;
  onMirrorClick?: () => void;
  mirrorUrl?: string; // Added mirrorUrl to the interface
}

const Modal: React.FC<ModalProps> = ({ open, onClose, title, description, children, showMirrorButton, onMirrorClick, mirrorUrl }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative bg-[#181024] rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 animate-fadeIn">
        {/* Close button */}
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-white text-2xl font-bold focus:outline-none">&times;</button>
        {/* Title */}
        {title && <h2 className="text-2xl font-extrabold text-white mb-2 text-center">{title}</h2>}
        {/* Description */}
        {description && <div className="text-base text-gray-300 mb-4 text-center">{description}</div>}
        {/* Custom content */}
        {children}
        {/* Mirror button */}
        {showMirrorButton && mirrorUrl && (
          <div className="w-full mt-6">
            <SafeExternalLink
              href={mirrorUrl}
              className="block w-full bg-gradient-to-r from-yellow-400 to-pink-500 text-white font-bold py-3 rounded-lg shadow hover:opacity-90 transition text-center"
            >
              Перейти на сайт
            </SafeExternalLink>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;