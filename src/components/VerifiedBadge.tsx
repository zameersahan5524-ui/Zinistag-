import React from 'react';

interface VerifiedBadgeProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  showTooltip?: boolean;
}

export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({
  size = 'sm',
  className = '',
  showTooltip = true
}) => {
  const sizeMap = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const checkSizeMap = {
    xs: 'scale-75',
    sm: 'scale-90',
    md: 'scale-100',
    lg: 'scale-125'
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 group ${className}`}
      title={showTooltip ? 'Official ZINISTAG Verified Creator (Authorized by Super-Admin)' : undefined}
    >
      {/* Outer Cyan/Blue Shield Badge */}
      <svg
        className={`${sizeMap[size]} text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]`}
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 1L15.39 3.45L19.5 3.75L20.25 7.86L23 10.61L21.5 14.5L22.25 18.61L18.36 19.86L16 23.25L12 21.75L8 23.25L5.64 19.86L1.75 18.61L2.5 14.5L1 10.61L3.75 7.86L4.5 3.75L8.61 3.45L12 1Z" />
        {/* Crisp checkmark in center */}
        <path
          d="M9.5 12.5L11 14L15 9.5"
          stroke="#09090b"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          className={checkSizeMap[size]}
        />
      </svg>
    </div>
  );
};
