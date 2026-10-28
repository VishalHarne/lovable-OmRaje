import { useId } from "react";

export function OmLogo({ className }: { className?: string }) {
  const id = useId();
  const gold = `${id}-gold`;
  const glow = `${id}-glow`;

  return (
    <svg className={className} viewBox="0 0 64 64" role="img" aria-label="Om" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={gold} x1="8" y1="6" x2="56" y2="58" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ffe27a" />
          <stop offset=".55" stopColor="#f5a524" />
          <stop offset="1" stopColor="#d9731a" />
        </linearGradient>
        <radialGradient id={glow} cx="32" cy="26" r="34" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#1d3a78" />
          <stop offset="1" stopColor="#0a1633" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill={`url(#${glow})`} />
      <circle cx="32" cy="32" r="29" fill="none" stroke={`url(#${gold})`} strokeWidth="2.4" />
      <circle cx="32" cy="32" r="23.5" fill="none" stroke={`url(#${gold})`} strokeWidth=".9" opacity=".55" />
      <path
        d="M18 43 V24.5 L32 38 L46 24.5 V43"
        fill="none"
        stroke={`url(#${gold})`}
        strokeWidth="4.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="32" cy="15.5" r="3.1" fill={`url(#${gold})`} />
    </svg>
  );
}
