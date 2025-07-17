import React from "react";

function encodeUrl(url: string) {
  // Корректно кодирует любые символы (UTF-8)
  return encodeURIComponent(btoa(unescape(encodeURIComponent(url))));
}

interface SafeExternalLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
}

const SafeExternalLink: React.FC<SafeExternalLinkProps> = ({ href, children, ...rest }) => {
  const encoded = encodeUrl(href);
  return (
    <a
      href={`/out?to=${encoded}`}
      rel="nofollow noopener noreferrer"
      target="_blank"
      {...rest}
    >
      {children}
    </a>
  );
};

export default SafeExternalLink; 