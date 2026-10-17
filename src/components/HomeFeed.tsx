import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { VideoPlayerCard } from './VideoPlayerCard';
import { ZinistagLogo } from './ZinistagLogo';
import { Search, Download, Compass, UserCheck } from 'lucide-react';

export const HomeFeed: React.FC = () => {
  const { reels, currentReelIndex, setCurrentReelIndex, openDownloadModal, setActiveTab } = useApp();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const touchStartY = useRef<number>(0);
  const touchEndY = useRef<number>(0);
  const isScrollingRef = useRef<boolean>(false);
  const [feedMode, setFeedMode] = useState<'foryou' | 'following'>('foryou');

  const displayedReels = useMemo(() => {
    if (feedMode === 'following') {
      const followed = reels.filter((r) => r.creator.isFollowing);
      return followed.length > 0 ? followed : reels;
    }
    return reels;
  }, [feedMode, reels]);

  const goToNext = useCallback(() => {
    if (currentReelIndex < displayedReels.length - 1) {
      setCurrentReelIndex(currentReelIndex + 1);
    }
  }, [currentReelIndex, displayedReels.length, setCurrentReelIndex]);

  const goToPrev = useCallback(() => {
    if (currentReelIndex > 0) {
      setCurrentReelIndex(currentReelIndex - 1);
    }
  }, [currentReelIndex, setCurrentReelIndex]);

  // Touch Swipe gestures with debounce protection
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (isScrollingRef.current) return;

    touchEndY.current = e.changedTouches[0].clientY;
    const diff = touchStartY.current - touchEndY.current;
    const SWIPE_THRESHOLD = 45;

    if (diff > SWIPE_THRESHOLD) {
      // Swiped Up -> Next Reel
      isScrollingRef.current = true;
      goToNext();
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 350);
    } else if (diff < -SWIPE_THRESHOLD) {
      // Swiped Down -> Previous Reel
      isScrollingRef.current = true;
      goToPrev();
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 350);
    }
  };

  // Wheel listener with debounce
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isScrollingRef.current) return;

      if (e.deltaY > 25) {
        isScrollingRef.current = true;
        goToNext();
        setTimeout(() => {
          isScrollingRef.current = false;
        }, 400);
      } else if (e.deltaY < -25) {
        isScrollingRef.current = true;
        goToPrev();
        setTimeout(() => {
          isScrollingRef.current = false;
        }, 400);
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [goToNext, goToPrev]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isScrollingRef.current) return;

      if (e.key === 'ArrowDown' || e.key === 'j') {
        isScrollingRef.current = true;
        goToNext();
        setTimeout(() => {
          isScrollingRef.current = false;
        }, 350);
      } else if (e.key === 'ArrowUp' || e.key === 'k') {
        isScrollingRef.current = true;
        goToPrev();
        setTimeout(() => {
          isScrollingRef.current = false;
        }, 350);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrev]);

  // Clamp index if filtered reels count changes
  useEffect(() => {
    if (currentReelIndex >= displayedReels.length) {
      setCurrentReelIndex(Math.max(0, displayedReels.length - 1));
    }
  }, [displayedReels.length, currentReelIndex, setCurrentReelIndex]);

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-full h-full bg-black overflow-hidden select-none"
    >
      {/* Top Floating App Bar */}
      <div className="absolute top-0 inset-x-0 z-40 px-4 pt-3 pb-2 flex items-center justify-between pointer-events-none">
        {/* Brand Header */}
        <div className="pointer-events-auto flex items-center">
          <ZinistagLogo size="sm" showText={true} wordmarkCase="title" />
        </div>

        {/* Following / For You Tabs */}
        <div className="pointer-events-auto flex items-center gap-4 text-sm font-bold drop-shadow-md">
          <button
            onClick={() => {
              setFeedMode('following');
              setCurrentReelIndex(0);
            }}
            className={`transition-colors cursor-pointer relative py-1 ${
              feedMode === 'following' ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Following
            {feedMode === 'following' && (
              <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-gradient-to-r from-cyan-400 to-pink-500 rounded-full" />
            )}
          </button>
          <span className="text-zinc-600">|</span>
          <button
            onClick={() => {
              setFeedMode('foryou');
              setCurrentReelIndex(0);
            }}
            className={`transition-colors cursor-pointer relative py-1 ${
              feedMode === 'foryou' ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            For You
            {feedMode === 'foryou' && (
              <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-gradient-to-r from-cyan-400 to-pink-500 rounded-full" />
            )}
          </button>
        </div>

        {/* Quick Actions */}
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            id="open-aab-modal-top"
            onClick={openDownloadModal}
            title="Download Android Release AAB"
            className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-cyan-500/40 text-cyan-400 flex items-center justify-center hover:bg-cyan-500/20 active:scale-95 transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveTab('discover')}
            className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:bg-white/10 active:scale-95 transition-transform cursor-pointer"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Full-Screen Reels Carousel with Sliding Window Virtualization */}
      <div
        className="w-full h-full transition-transform duration-300 ease-out"
        style={{
          transform: `translateY(-${currentReelIndex * 100}%)`,
          willChange: 'transform'
        }}
      >
        {displayedReels.map((reel, index) => {
          const isActive = index === currentReelIndex;
          const isPreload = Math.abs(index - currentReelIndex) === 1;
          const shouldMountVideo = Math.abs(index - currentReelIndex) <= 1;

          return (
            <div key={reel.id} className="w-full h-full shrink-0">
              <VideoPlayerCard
                reel={reel}
                isActive={isActive}
                isPreload={isPreload}
                shouldMountVideo={shouldMountVideo}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
