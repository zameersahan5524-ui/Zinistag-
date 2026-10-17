import React, { useState } from 'react';

interface ZinkoraLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
}

export const ZinkoraLogo: React.FC<ZinkoraLogoProps> = ({
  className = '',
  size = 'md',
  showName = true
}) => {
  const [imgError, setImgError] = useState(false);

  const iconDim =
    size === 'sm'
      ? 'w-5 h-5'
      : size === 'lg'
      ? 'w-10 h-10'
      : 'w-7 h-7';

  const textClass =
    size === 'sm'
      ? 'text-xs tracking-wider'
      : size === 'lg'
      ? 'text-lg tracking-widest'
      : 'text-sm tracking-wider';

  return (
    <div className={`flex items-center justify-center gap-2 select-none ${className}`}>
      {/* Official Metallic Hexagonal Emblem */}
      <div className={`${iconDim} relative shrink-0 flex items-center justify-center`}>
        {!imgError ? (
          <img
            src="/assets/zinkora_logo.jpg"
            alt="Zinkora Official Logo"
            className="w-full h-full object-contain mix-blend-multiply drop-shadow-xs"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
          />
        ) : (
          /* High-Fidelity SVG Metallic Hexagon Fallback */
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full drop-shadow-xs">
            <defs>
              <linearGradient id="chrome-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f8fafc" />
                <stop offset="30%" stopColor="#cbd5e1" />
                <stop offset="70%" stopColor="#64748b" />
                <stop offset="100%" stopColor="#94a3b8" />
              </linearGradient>
              <linearGradient id="chrome-grad-2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#e2e8f0" />
                <stop offset="50%" stopColor="#475569" />
                <stop offset="100%" stopColor="#1e293b" />
              </linearGradient>
            </defs>
            {/* Hexagonal interlocking frame */}
            <path
              d="M50 8 L86 28 L86 72 L50 92 L14 72 L14 28 Z"
              stroke="url(#chrome-grad-1)"
              strokeWidth="6"
              fill="none"
              strokeLinejoin="round"
            />
            {/* Interlocking geometric bars */}
            <path
              d="M32 38 L68 38 L40 62 L68 62"
              stroke="url(#chrome-grad-2)"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>

      {/* Official Company Name */}
      {showName && (
        <span
          className={`font-black text-zinc-900 font-['Outfit'] ${textClass}`}
        >
          Zinkora
        </span>
      )}
    </div>
  );
};
