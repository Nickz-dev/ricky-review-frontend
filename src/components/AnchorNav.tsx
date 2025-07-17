import React from "react";

interface Anchor {
  label: string;
  anchorId: string;
}

export default function AnchorNav({ anchors }: { anchors: Anchor[] }) {
  if (!Array.isArray(anchors) || anchors.length === 0) return null;
  return (
    <nav className="w-full flex justify-center mb-8">
      <ul className="flex flex-wrap gap-6 border border-orange-400 rounded-lg px-4 py-2 bg-black/30">
        {anchors.map(anchor => (
          <li key={anchor.anchorId}>
            <a
              href={`#${anchor.anchorId}`}
              className="text-orange-300 hover:text-white font-bold transition-colors duration-200"
            >
              {anchor.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
} 