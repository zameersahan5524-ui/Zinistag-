import React, { useRef, useState, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Music,
  Play,
  Volume2,
  VolumeX,
  Check,
  Plus,
  Sparkles
} from 'lucide-react';
import { ReelPost } from '../types';
import { useApp } from '../context/AppContext';
import { ZinistagLoading } from './ZinistagLoading';
import { VerifiedBadge } from './VerifiedBadge';
import { monetizationStore } from '../services/monetizationStore';

interface VideoPlayerCardProps {
  reel: ReelPost;
  isActive: boolean;
  isPreload?: boolean;
  shouldMountVideo?: boolean;
}

const VideoPlayerCardComponent: React.FC<VideoPlayerCardProps> = ({
  reel,
  isActive,
  isPreload = false,
  shouldMountVideo = true
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playPromiseRef = useRef<Promise<void> | null>(null);
  const isMountedRef = useRef<boolean>(true);
  const bufferingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const stallRecoveryTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastTapRef = useRef<number>(0);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isBuffering, setIsBuffering] = useState<boolean>(false);
  const [showHeartAnim, setShowHeartAnim] = useState<boolean>(false);
  const [showPlayStateIcon, setShowPlayStateIcon] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  const {
    toggleLike,
    toggleSave,
    toggleFollow,
    openComments,
    openShare,
    openSubscriptionModal
  } = useApp();

  const isVerified = monetizationStore.isUserVerified(reel.creator.id) || reel.creator.verified;

  // Clear buffering state and debounce timers
  const clearBuffering = useCallback(() => {
    if (bufferingTimerRef.current) {
      clearTimeout(bufferingTimerRef.current);
      bufferingTimerRef.current = null;
    }
    if (stallRecoveryTimerRef.current) {
      clearTimeout(stallRecoveryTimerRef.current);
      stallRecoveryTimerRef.current = null;
    }
    setIsBuffering(false);
  }, []);

  // Safe play mechanism preventing promise rejection races
  const safePlay = useCallback(async () => {
    const video = videoRef.current;
    if (!video || !isMountedRef.current || !isActive) return;

    try {
      if (video.ended) {
        video.currentTime = 0;
      }

      playPromiseRef.current = video.play();
      await playPromiseRef.current;

      if (isMountedRef.current && isActive) {
        setIsPlaying(true);
        clearBuffering();
      } else if (video && !isActive) {
        video.pause();
        setIsPlaying(false);
      }
    } catch (err: any) {
      if (err.name === 'NotAllowedError') {
        // Autoplay policy restriction - fallback to muted playback
        video.muted = true;
        setIsMuted(true);
        try {
          playPromiseRef.current = video.play();
          await playPromiseRef.current;
          if (isMountedRef.current && isActive) {
            setIsPlaying(true);
            clearBuffering();
          }
        } catch {
          setIsPlaying(false);
        }
      } else if (err.name === 'AbortError') {
        // Interrupted by pause or fast scrolling - safe to ignore
      } else {
        setIsPlaying(false);
      }
    } finally {
      playPromiseRef.current = null;
    }
  }, [isActive, clearBuffering]);

  // Safe pause mechanism
  const safePause = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    clearBuffering();

    if (playPromiseRef.current) {
      try {
        await playPromiseRef.current;
      } catch {}
    }

    if (video && isMountedRef.current) {
      video.pause();
      setIsPlaying(false);
      // NOTE: We deliberately do NOT reset video.currentTime = 0 here.
      // Keeping buffered frame avoids re-downloading byte range 0 when scrolling back!
    }
  }, [clearBuffering]);

  // Main playback lifecycle on isActive change
  useEffect(() => {
    isMountedRef.current = true;

    if (isActive) {
      safePlay();
    } else {
      safePause();
    }

    return () => {
      clearBuffering();
    };
  }, [isActive, safePlay, safePause, clearBuffering]);

  // Track component unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      clearBuffering();
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.removeAttribute('src');
        videoRef.current.load();
      }
    };
  }, [clearBuffering]);

  // Visibility and Network listeners for auto-pause and auto-recovery
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // App backgrounded / tab hidden -> pause video to conserve resources
        videoRef.current?.pause();
        setIsPlaying(false);
      } else if (isActive && isMountedRef.current) {
        // App returned to foreground -> resume active video
        safePlay();
      }
    };

    const handleOnline = () => {
      if (isActive && isMountedRef.current && videoRef.current) {
        // Reconnected to internet -> resume playback
        safePlay();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('online', handleOnline);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('online', handleOnline);
    };
  }, [isActive, safePlay]);

  // Handle video progress update
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;

    // If time is actively progressing, video is definitively NOT buffering
    clearBuffering();

    const current = video.currentTime;
    const total = video.duration;
    if (total > 0) {
      setProgress((current / total) * 100);
    }
  };

  // Debounced buffering indicator handler
  const handleWaiting = () => {
    if (!isActive) return;

    if (bufferingTimerRef.current) {
      clearTimeout(bufferingTimerRef.current);
    }

    // Debounce by 250ms: micro-stutters and seamless loop restarts will not flash a spinner
    bufferingTimerRef.current = setTimeout(() => {
      const video = videoRef.current;
      if (isMountedRef.current && isActive && video && !video.paused) {
        // Check if readyState is actually stalled
        if (video.readyState < 3) {
          setIsBuffering(true);

          // Stalled recovery watchdog: if stalled for more than 3.5s, trigger recovery
          stallRecoveryTimerRef.current = setTimeout(() => {
            if (isMountedRef.current && isActive && video && video.readyState < 3) {
              const savedTime = video.currentTime;
              video.load();
              video.currentTime = savedTime;
              safePlay();
            }
          }, 3500);
        }
      }
    }, 250);
  };

  const handlePlaying = () => {
    clearBuffering();
    setIsPlaying(true);
  };

  const handleCanPlay = () => {
    clearBuffering();
  };

  // Screen click handler: single tap toggle play/pause, double tap like
  const handleScreenClick = (e: React.MouseEvent) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 280;

    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      // Double tap -> Like
      if (!reel.isLiked) {
        toggleLike(reel.id);
      }
      setShowHeartAnim(true);
      setTimeout(() => setShowHeartAnim(false), 900);
      lastTapRef.current = 0;
      return;
    }

    lastTapRef.current = now;

    // Single tap with slight debounce to allow double tap
    setTimeout(() => {
      if (lastTapRef.current !== 0) {
        const video = videoRef.current;
        if (!video) return;

        if (video.paused) {
          safePlay();
        } else {
          safePause();
        }

        setShowPlayStateIcon(true);
        setTimeout(() => setShowPlayStateIcon(false), 650);
        lastTapRef.current = 0;
      }
    }, DOUBLE_TAP_DELAY);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  return (
    <div
      className="relative w-full h-full bg-black select-none overflow-hidden"
      onClick={handleScreenClick}
    >
      {/* Background Video Element or Lightweight Placeholder */}
      {shouldMountVideo ? (
        <video
          ref={videoRef}
          playsInline
          webkit-playsinline="true"
          x5-playsinline="true"
          x5-video-player-type="h5"
          loop
          muted={isMuted}
          preload={isActive ? 'auto' : isPreload ? 'auto' : 'none'}
          className="w-full h-full object-cover"
          style={{ transform: 'translateZ(0)', willChange: 'transform' }}
          onTimeUpdate={handleTimeUpdate}
          onWaiting={handleWaiting}
          onPlaying={handlePlaying}
          onCanPlay={handleCanPlay}
          onCanPlayThrough={handleCanPlay}
          onError={() => {
            clearBuffering();
            if (isActive) {
              setTimeout(safePlay, 1000);
            }
          }}
        >
          <source src={reel.videoUrl} type="video/mp4" />
        </video>
      ) : (
        /* Lightweight placeholder when scrolled far away, preventing GPU decoder leaks */
        <div className="w-full h-full bg-zinc-950 flex items-center justify-center relative">
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center opacity-40">
            <Play className="w-8 h-8 fill-white/60 text-white/60 ml-1" />
          </div>
        </div>
      )}

      {/* Smooth Debounced Buffering Loading Indicator */}
      <AnimatePresence>
        {isBuffering && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-30 bg-black/40 backdrop-blur-[2px]"
          >
            <ZinistagLoading size="lg" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Gradient Overlay */}
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/70 via-black/25 to-transparent pointer-events-none" />

      {/* Bottom Gradient Overlay */}
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none" />

      {/* Center Play / Pause Animated Indicator */}
      <AnimatePresence>
        {showPlayStateIcon && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1.1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
          >
            <div className="w-20 h-20 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
              {isPlaying ? (
                <Play className="w-10 h-10 fill-white ml-1" />
              ) : (
                <div className="w-8 h-8 flex gap-2 justify-center items-center">
                  <div className="w-2.5 h-7 bg-white rounded-xs" />
                  <div className="w-2.5 h-7 bg-white rounded-xs" />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Big Double-Tap Animated Heart */}
      <AnimatePresence>
        {showHeartAnim && (
          <motion.div
            initial={{ scale: 0, opacity: 0, rotate: -20 }}
            animate={{ scale: 1.3, opacity: 1, rotate: 0 }}
            exit={{ scale: 1.6, opacity: 0, y: -60 }}
            transition={{ type: 'spring', damping: 15 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
          >
            <Heart className="w-28 h-28 text-pink-500 fill-pink-500 drop-shadow-[0_0_25px_rgba(236,72,153,0.8)]" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Volume Quick Toggle */}
      <button
        onClick={toggleMute}
        title={isMuted ? 'Unmute video' : 'Mute video'}
        className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/90 hover:text-white transition-transform active:scale-95 cursor-pointer"
      >
        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </button>

      {/* Right Side Interaction Rail */}
      <div className="absolute right-3 bottom-20 z-20 flex flex-col items-center gap-5.5">
        {/* Creator Avatar with Follow Button */}
        <div className="relative group">
          <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-cyan-400 via-indigo-500 to-pink-500 shadow-lg">
            <img
              src={reel.creator.avatar}
              alt={reel.creator.name}
              className="w-full h-full rounded-full object-cover"
              crossOrigin="anonymous"
              loading="lazy"
            />
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFollow(reel.creator.id);
            }}
            aria-label={reel.creator.isFollowing ? 'Following creator' : 'Follow creator'}
            className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full flex items-center justify-center text-white shadow-md transition-transform cursor-pointer ${
              reel.creator.isFollowing ? 'bg-zinc-700' : 'bg-pink-500 active:scale-110'
            }`}
          >
            {reel.creator.isFollowing ? <Check className="w-3 h-3" /> : <Plus className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Like Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleLike(reel.id);
          }}
          className="flex flex-col items-center gap-1 group active:scale-90 transition-transform cursor-pointer"
        >
          <div className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors ${
            reel.isLiked ? 'bg-pink-500/25 text-pink-500' : 'bg-black/30 text-white hover:bg-black/50'
          }`}>
            <Heart className={`w-6 h-6 transition-all ${reel.isLiked ? 'fill-pink-500 scale-110' : ''}`} />
          </div>
          <span className="text-xs font-semibold text-white drop-shadow-md">
            {reel.likes > 999 ? `${(reel.likes / 1000).toFixed(1)}k` : reel.likes}
          </span>
        </button>

        {/* Comment Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            openComments(reel);
          }}
          className="flex flex-col items-center gap-1 group active:scale-90 transition-transform cursor-pointer"
        >
          <div className="w-11 h-11 rounded-full bg-black/30 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/50 transition-colors">
            <MessageCircle className="w-6 h-6" />
          </div>
          <span className="text-xs font-semibold text-white drop-shadow-md">
            {reel.commentsCount}
          </span>
        </button>

        {/* Save/Bookmark Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleSave(reel.id);
          }}
          className="flex flex-col items-center gap-1 group active:scale-90 transition-transform cursor-pointer"
        >
          <div className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors ${
            reel.isSaved ? 'bg-amber-500/25 text-amber-400' : 'bg-black/30 text-white hover:bg-black/50'
          }`}>
            <Bookmark className={`w-6 h-6 ${reel.isSaved ? 'fill-amber-400' : ''}`} />
          </div>
          <span className="text-xs font-semibold text-white drop-shadow-md">
            {reel.isSaved ? 'Saved' : 'Save'}
          </span>
        </button>

        {/* Share Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            openShare(reel);
          }}
          className="flex flex-col items-center gap-1 group active:scale-90 transition-transform cursor-pointer"
        >
          <div className="w-11 h-11 rounded-full bg-black/30 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/50 transition-colors">
            <Share2 className="w-6 h-6" />
          </div>
          <span className="text-xs font-semibold text-white drop-shadow-md">
            {reel.sharesCount > 999 ? `${(reel.sharesCount / 1000).toFixed(1)}k` : reel.sharesCount}
          </span>
        </button>

        {/* Rotating Music Disc */}
        <div
          className={`w-10 h-10 rounded-full border-2 border-zinc-700 bg-zinc-900 overflow-hidden relative flex items-center justify-center shadow-lg ${
            isPlaying ? 'animate-spin' : ''
          }`}
          style={{ animationDuration: '4s' }}
        >
          {reel.audio.cover ? (
            <img
              src={reel.audio.cover}
              alt="audio cover"
              className="w-full h-full object-cover"
              crossOrigin="anonymous"
              loading="lazy"
            />
          ) : (
            <Music className="w-4 h-4 text-cyan-400" />
          )}
        </div>
      </div>

      {/* Bottom Info Section */}
      <div className="absolute left-4 right-18 bottom-6 z-20 text-white space-y-2 pointer-events-auto">
        {/* Creator Name & Badge */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-bold text-sm tracking-wide drop-shadow-md">
            @{reel.creator.username}
          </span>
          {isVerified && <VerifiedBadge size="sm" />}
          <span className="text-[11px] text-zinc-400 font-medium drop-shadow-sm">
            • {reel.createdAt}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              openSubscriptionModal(reel.creator);
            }}
            className="ml-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-pink-500/80 to-purple-600/80 hover:from-pink-500 hover:to-purple-600 text-white font-bold text-[10px] flex items-center gap-1 shadow-md shadow-pink-500/20 active:scale-95 cursor-pointer backdrop-blur-sm"
          >
            <Sparkles className="w-2.5 h-2.5" />
            <span>VIP</span>
          </button>
        </div>

        {/* Caption */}
        <p className="text-xs text-zinc-100 line-clamp-2 leading-relaxed drop-shadow-md pr-2">
          {reel.caption}
        </p>

        {/* Audio Track Marquee */}
        <div className="flex items-center gap-2 text-[11px] text-zinc-300 drop-shadow-sm pt-0.5">
          <Music className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span className="truncate max-w-[210px]">
            {reel.audio.title} • {reel.audio.artist}
          </span>
        </div>
      </div>

      {/* Thin Bottom Video Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-30">
        <div
          className="h-full bg-gradient-to-r from-cyan-400 to-pink-500 transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export const VideoPlayerCard = memo(VideoPlayerCardComponent, (prevProps, nextProps) => {
  return (
    prevProps.isActive === nextProps.isActive &&
    prevProps.isPreload === nextProps.isPreload &&
    prevProps.shouldMountVideo === nextProps.shouldMountVideo &&
    prevProps.reel.id === nextProps.reel.id &&
    prevProps.reel.isLiked === nextProps.reel.isLiked &&
    prevProps.reel.isSaved === nextProps.reel.isSaved &&
    prevProps.reel.likes === nextProps.reel.likes &&
    prevProps.reel.creator.isFollowing === nextProps.reel.creator.isFollowing
  );
});
