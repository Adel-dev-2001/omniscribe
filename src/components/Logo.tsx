import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

/**
 * Ultra-Modern Geometric Lettermark Logo for OmniScribe.
 * Combines an optical aperture, neural prism, and a minimalist isometric "O" glyph.
 */
export const Logo: React.FC<LogoProps> = ({ className = '', size = 32 }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-300 hover:scale-105"
      >
        <defs>
          <linearGradient id="omniGrad1" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="50%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#A855F7" />
          </linearGradient>
          <linearGradient id="omniGrad2" x1="44" y1="4" x2="4" y2="44" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#4F46E5" />
          </linearGradient>
        </defs>

        {/* Outer Hexagonal Isometric Framework */}
        <rect
          x="3"
          y="3"
          width="42"
          height="42"
          rx="12"
          fill="#0B0F19"
          stroke="url(#omniGrad1)"
          strokeWidth="2"
        />

        {/* Optical Scanning Target Brackets */}
        <path d="M10 16 V 10 H 16" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M38 16 V 10 H 32" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10 32 V 38 H 16" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M38 32 V 38 H 32" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

        {/* Central Geometric "O" Aperture & Focus Prism */}
        <circle cx="24" cy="24" r="9" stroke="url(#omniGrad1)" strokeWidth="2.5" />
        <circle cx="24" cy="24" r="3.5" fill="url(#omniGrad2)" />

        {/* Precision Laser Scanning Beam */}
        <line x1="15" y1="24" x2="33" y2="24" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
      </svg>
    </div>
  );
};
