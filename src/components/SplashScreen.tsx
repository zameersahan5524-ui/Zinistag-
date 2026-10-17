import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ZinistagSymbol } from './ZinistagLogo';

interface SplashScreenProps {
  isVisible: boolean;
  onDismiss: () => void;
  autoDismissDelay?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  isVisible,
  onDismiss,
  autoDismissDelay = 2200
}) => {
  useEffect(() => {
    if (!isVisible) return;

    const timer = setTimeout(() => {
      onDismiss();
    }, autoDismissDelay);

    return () => clearTimeout(timer);
  }, [isVisible, onDismiss, autoDismissDelay]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="zinistag-splash-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.06 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          onClick={onDismiss}
          className="fixed inset-0 z-50 bg-black text-white flex items-center justify-center select-none overflow-hidden cursor-pointer"
          title="Click to enter immediately"
        >
          {/* Centered Zinistag "Z" Logo & Wordmark with Generous Empty Space */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              duration: 0.65,
              ease: [0.16, 1, 0.3, 1]
            }}
            className="flex flex-col items-center justify-center px-8"
          >
            {/* Prominent Futuristic Geometric "Z" Logo with Soft Neon Glow */}
            <div className="relative">
              <ZinistagSymbol
                sizeClass="w-24 h-24 sm:w-28 sm:h-28"
                glow={true}
              />
            </div>

            {/* Bold, Clean, Modern White Sans-Serif Wordmark */}
            <h1 className="mt-5 text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-['Outfit'] select-none">
              Zinistag
            </h1>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
