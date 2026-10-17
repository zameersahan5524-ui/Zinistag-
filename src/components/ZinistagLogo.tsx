import React, { useId } from 'react';

export interface ZinistagLogoProps {
  className?: string;
  showText?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  theme?: 'dark' | 'light';
  layout?: 'horizontal' | 'vertical';
  variant?: 'symbol' | 'badge';
  wordmarkCase?: 'title' | 'upper';
  glow?: boolean;
}

/**
 * Pure SVG Futuristic Geometric Ribbon "Z" Symbol
 * Electric cyan/blue ribbons with subtle magenta/pink offset accents and soft neon glow
 */
export const ZinistagSymbol: React.FC<{
  sizeClass?: string;
  glow?: boolean;
  className?: string;
}> = ({ sizeClass = 'w-10 h-10', glow = true, className = '' }) => {
  const idPrefix = useId().replace(/:/g, '');

  return (
    <div
      className={`${sizeClass} relative shrink-0 flex items-center justify-center ${className}`}
      style={{
        filter: glow
          ? 'drop-shadow(0 0 12px rgba(6, 182, 212, 0.45)) drop-shadow(0 0 20px rgba(236, 72, 153, 0.25))'
          : undefined
      }}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible select-none"
      >
        <defs>
          {/* Soft Neon Glow Filters */}
          <filter id={`${idPrefix}-glow`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Radial Ambient Neon Aura */}
          <radialGradient id={`${idPrefix}-ambient`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00f5ff" stopOpacity="0.32" />
            <stop offset="55%" stopColor="#ec4899" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>

          {/* Electric Cyan / Blue Gradients */}
          <linearGradient id={`${idPrefix}-top-grad`} x1="15%" y1="20%" x2="85%" y2="40%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#00f5ff" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>

          <linearGradient id={`${idPrefix}-diag-grad`} x1="85%" y1="20%" x2="15%" y2="80%">
            <stop offset="0%" stopColor="#00f5ff" />
            <stop offset="30%" stopColor="#06b6d4" />
            <stop offset="70%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>

          <linearGradient id={`${idPrefix}-bot-grad`} x1="15%" y1="65%" x2="85%" y2="85%">
            <stop offset="0%" stopColor="#1d4ed8" />
            <stop offset="45%" stopColor="#0284c7" />
            <stop offset="85%" stopColor="#00f5ff" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>

          {/* Magenta / Pink Accent Gradients */}
          <linearGradient id={`${idPrefix}-pink-accent`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff2a85" />
            <stop offset="50%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#f43f5e" />
          </linearGradient>

          <linearGradient id={`${idPrefix}-fold-shadow`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0284c7" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Ambient Glow Halo */}
        {glow && (
          <circle
            cx="50"
            cy="50"
            r="44"
            fill={`url(#${idPrefix}-ambient)`}
            className="animate-pulse"
            style={{ animationDuration: '3.5s' }}
          />
        )}

        {/* 1. LAYER 1: Subtle Magenta/Pink Offset Ribbon (Holographic / Dimensional Accent) */}
        <g opacity="0.9" style={{ filter: 'drop-shadow(0 0 5px rgba(236,72,153,0.6))' }}>
          {/* Diagonal Offset Ribbon Edge */}
          <path
            d="M74 20 L84 27 L43 83 L33 76 Z"
            fill={`url(#${idPrefix}-pink-accent)`}
          />
          {/* Upper Corner Accent Wedge */}
          <path
            d="M66 39 L74 39 L78 28 Z"
            fill="#ff2a85"
            opacity="0.8"
          />
          {/* Lower Corner Accent Wedge */}
          <path
            d="M26 73 L34 63 L26 63 Z"
            fill="#ec4899"
            opacity="0.8"
          />
          {/* Bottom Accent Under-Edge */}
          <path
            d="M38 80 L84 80 L80 84 L34 84 Z"
            fill={`url(#${idPrefix}-pink-accent)`}
            opacity="0.85"
          />
        </g>

        {/* 2. LAYER 2: Primary Geometric Electric Cyan / Blue Ribbons */}
        <g filter={glow ? `url(#${idPrefix}-glow)` : undefined}>
          {/* Top Horizontal Ribbon Bar */}
          <path
            d="M21 22 H79 L66 39 H31 Z"
            fill={`url(#${idPrefix}-top-grad)`}
          />
          {/* Top Bevel Highlight Rim */}
          <path
            d="M21 22 H79 L76 25 H24 Z"
            fill="#ffffff"
            opacity="0.45"
          />

          {/* Dynamic Central Diagonal Ribbon */}
          <path
            d="M79 22 L67 22 L23 80 L35 80 Z"
            fill={`url(#${idPrefix}-diag-grad)`}
          />
          {/* Diagonal High-Gloss Specular Ridge */}
          <path
            d="M73 23 L29 79"
            stroke="#ffffff"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.45"
          />

          {/* Ribbon Fold Creases (Layered depth) */}
          <path
            d="M66 39 L79 22 L67 22 Z"
            fill={`url(#${idPrefix}-fold-shadow)`}
          />
          <path
            d="M35 63 L23 80 L35 80 Z"
            fill={`url(#${idPrefix}-fold-shadow)`}
          />

          {/* Bottom Horizontal Ribbon Bar */}
          <path
            d="M35 63 H71 L81 80 H23 Z"
            fill={`url(#${idPrefix}-bot-grad)`}
          />
          {/* Bottom Edge Specular Glint */}
          <path
            d="M37 65 H70 L68 67 H38 Z"
            fill="#ffffff"
            opacity="0.3"
          />
        </g>

        {/* 3. LAYER 3: Futuristic Terminal Anchor Accents */}
        <circle cx="79" cy="22" r="2.2" fill="#00f5ff" filter="drop-shadow(0 0 3px #00f5ff)" />
        <circle cx="21" cy="22" r="1.8" fill="#38bdf8" />
        <circle cx="81" cy="80" r="1.8" fill="#38bdf8" />
        <circle cx="23" cy="80" r="2.2" fill="#ff2a85" filter="drop-shadow(0 0 3px #ff2a85)" />
      </svg>
    </div>
  );
};

export const ZinistagLogo: React.FC<ZinistagLogoProps> = ({
  className = '',
  showText = true,
  size = 'md',
  theme = 'dark',
  layout = 'horizontal',
  variant = 'symbol',
  wordmarkCase = 'title',
  glow = true
}) => {
  const isLight = theme === 'light';

  // Dimension mapping for symbol or badge container
  const getDimensions = () => {
    switch (size) {
      case 'xs':
        return {
          symbol: 'w-5 h-5',
          badge: 'w-7 h-7 rounded-lg p-1',
          text: 'text-sm tracking-tight'
        };
      case 'sm':
        return {
          symbol: 'w-7 h-7',
          badge: 'w-9 h-9 rounded-xl p-1.5',
          text: 'text-base tracking-tight'
        };
      case 'lg':
        return {
          symbol: 'w-12 h-12',
          badge: 'w-14 h-14 rounded-2xl p-2.5',
          text: 'text-2xl tracking-tight'
        };
      case 'xl':
        return {
          symbol: 'w-16 h-16',
          badge: 'w-20 h-20 rounded-3xl p-3',
          text: 'text-3xl tracking-tight'
        };
      case 'hero':
        return {
          symbol: 'w-24 h-24 sm:w-28 sm:h-28',
          badge: 'w-28 h-28 sm:w-32 sm:h-32 rounded-[32px] p-4',
          text: 'text-3xl sm:text-4xl font-extrabold tracking-tight mt-4'
        };
      case 'md':
      default:
        return {
          symbol: 'w-9 h-9',
          badge: 'w-11 h-11 rounded-2xl p-2',
          text: 'text-lg tracking-tight'
        };
    }
  };

  const dims = getDimensions();
  const wordmarkText = wordmarkCase === 'upper' ? 'ZINISTAG' : 'Zinistag';

  return (
    <div
      className={`inline-flex select-none ${
        layout === 'vertical'
          ? 'flex-col items-center justify-center text-center'
          : 'items-center gap-2.5'
      } ${className}`}
    >
      {/* Visual Identity: Either floating symbol or squircle app icon badge */}
      {variant === 'badge' ? (
        <div
          className={`${dims.badge} relative shrink-0 bg-gradient-to-tr from-cyan-500 via-indigo-600 to-pink-500 shadow-xl shadow-cyan-500/20 p-[2px] transition-transform`}
        >
          <div
            className={`w-full h-full rounded-[inherit] flex items-center justify-center ${
              isLight ? 'bg-zinc-50' : 'bg-black'
            }`}
          >
            <ZinistagSymbol sizeClass="w-full h-full p-1" glow={glow} />
          </div>
        </div>
      ) : (
        <ZinistagSymbol sizeClass={dims.symbol} glow={glow} />
      )}

      {/* Modern Sans-Serif Wordmark */}
      {showText && (
        <span
          className={`font-['Outfit'] font-extrabold ${dims.text} ${
            isLight
              ? 'text-zinc-950'
              : 'text-white drop-shadow-sm'
          }`}
        >
          {wordmarkText}
        </span>
      )}
    </div>
  );
};
