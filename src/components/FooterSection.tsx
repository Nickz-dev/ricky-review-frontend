import React from "react";

interface FooterSectionProps {
  footer: any;
}

const FooterSection: React.FC<FooterSectionProps> = ({ footer }) => {
  if (!footer) return null;
  return (
    <footer className="mt-16 border-t border-gray-800 pt-8 pb-4 text-center text-gray-400">
      <div>{footer?.copyright}</div>
      <div className="mt-2">
        {Array.isArray(footer.links) && footer.links.map((link: { id: string | number; url: string; label: string }) => (
          <a key={link.id} href={link.url} className="mx-2 text-yellow-400 hover:underline">{link.label}</a>
        ))}
      </div>
    </footer>
  );
};

export default FooterSection; 