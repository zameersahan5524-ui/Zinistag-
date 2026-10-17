import React from 'react';
import { ZinistagSymbol } from './ZinistagLogo';

interface ZinistagLoadingProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

export const ZinistagLoading: React.FC<ZinistagLoadingProps> = ({
  size = 'md',
  label,
  className = ''
}) => {
  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'w-6 h-6';
      case 'lg':
        return 'w-14 h-14';
      case 'md':
      default:
        return 'w-10 h-10';
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-3 select-none ${className}`}>
      <div className="relative">
        <ZinistagSymbol sizeClass={getSizeClass()} glow={true} className="animate-pulse" />
      </div>
      {label && (
        <span className="text-xs font-semibold text-zinc-400 font-['Outfit'] tracking-wide animate-pulse">
          {label}
        </span>
      )}
    </div>
  );
};
