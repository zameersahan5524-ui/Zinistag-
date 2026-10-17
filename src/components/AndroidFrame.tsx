import React from 'react';

export const AndroidFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="w-screen h-screen bg-zinc-950 flex items-center justify-center overflow-hidden">
      {/* Container that acts as the phone viewport on desktop, full screen on mobile */}
      <div className="relative w-full h-full sm:max-w-[430px] sm:max-h-[920px] sm:rounded-[40px] sm:border-[8px] sm:border-zinc-800/80 sm:shadow-[0_0_60px_rgba(0,0,0,0.8)] overflow-hidden bg-black flex flex-col">
        {children}
      </div>
    </div>
  );
};
