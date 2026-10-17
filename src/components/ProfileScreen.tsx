import React, { useState } from 'react';
import {
  Settings,
  Bookmark,
  Heart,
  Grid,
  Download,
  ShieldCheck,
  Share2,
  DollarSign,
  Briefcase,
  TrendingUp,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ZinistagSymbol } from './ZinistagLogo';
import { VerifiedBadge } from './VerifiedBadge';
import { monetizationStore } from '../services/monetizationStore';

export const ProfileScreen: React.FC = () => {
  const {
    currentUser,
    reels,
    openDownloadModal,
    openSettings,
    setCurrentReelIndex,
    setActiveTab,
    openShare,
    openCreatorStudio,
    openAdminDashboard
  } = useApp();
  const [profileTab, setProfileTab] = useState<'reels' | 'saved' | 'liked'>('reels');

  const isVerified = monetizationStore.isUserVerified(currentUser.id);
  const profileStats = monetizationStore.getCreatorProfile(currentUser.id);

  const myReels = reels.filter((r) => r.creator.username === currentUser.username || r.id.startsWith('reel_'));
  const savedReels = reels.filter((r) => r.isSaved);
  const likedReels = reels.filter((r) => r.isLiked);

  const displayedReels =
    profileTab === 'reels'
      ? (myReels.length > 0 ? myReels : reels.slice(0, 3))
      : profileTab === 'saved'
      ? savedReels
      : likedReels;

  return (
    <div className="w-full h-full bg-zinc-950 text-white overflow-y-auto pb-24 select-none">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-zinc-950/90 backdrop-blur-md px-4 py-3.5 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold tracking-wide">@{currentUser.username}</span>
          {isVerified && <VerifiedBadge size="sm" />}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={openAdminDashboard}
            className="px-2 py-1 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
            title="Super-Admin Security & Verification Engine"
          >
            <ShieldAlert className="w-3 h-3" />
            <span>Admin</span>
          </button>
          <button
            onClick={openDownloadModal}
            className="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5 hover:bg-cyan-500/30 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>AAB</span>
          </button>
          <button
            onClick={openSettings}
            className="p-1.5 rounded-full text-zinc-400 hover:text-white cursor-pointer"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="px-5 py-4 space-y-4">
        {/* Profile Header Stats */}
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-cyan-400 via-indigo-500 to-pink-500 shadow-xl shadow-cyan-500/10">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-full h-full object-cover rounded-full"
                crossOrigin="anonymous"
              />
            </div>
          </div>

          <div className="flex-1 flex justify-around text-center">
            <div>
              <p className="text-base font-black text-white">
                {myReels.length || 3}
              </p>
              <p className="text-[11px] text-zinc-400 font-medium">Reels</p>
            </div>
            <div>
              <p className="text-base font-black text-white">
                {currentUser.followers ? `${(currentUser.followers / 1000).toFixed(1)}k` : '14.2k'}
              </p>
              <p className="text-[11px] text-zinc-400 font-medium">Followers</p>
            </div>
            <div>
              <p className="text-base font-black text-white">
                {currentUser.following || 342}
              </p>
              <p className="text-[11px] text-zinc-400 font-medium">Following</p>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-white">{currentUser.name}</h2>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-semibold text-cyan-400">
              <ZinistagSymbol sizeClass="w-2.5 h-2.5" glow={false} />
              <span>Official Creator</span>
            </span>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed">{currentUser.bio}</p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={openSettings}
            className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-center transition-colors cursor-pointer"
          >
            Edit Profile
          </button>
          <button
            onClick={openDownloadModal}
            className="py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-pink-500 text-xs font-bold text-center text-white shadow-md shadow-cyan-500/20 transition-transform active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Get Android AAB</span>
          </button>
        </div>

        {/* PROMINENT CREATOR STUDIO NAVIGATION AREA */}
        <div
          onClick={openCreatorStudio}
          className="p-3.5 rounded-2xl bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-cyan-950/40 border border-cyan-500/30 hover:border-cyan-400/50 shadow-lg shadow-cyan-500/5 transition-all active:scale-[0.99] cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500/30 transition-colors">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-white tracking-wide">Creator Studio</span>
                  <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 text-[9px] font-bold">
                    80/20 Splits
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Available: <strong className="text-emerald-400 font-bold">${profileStats.availableBalance.toFixed(2)}</strong> • 3 Brand Deals Open
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-cyan-400 text-xs font-bold">
              <span>Open</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-t border-b border-white/10 flex justify-around text-zinc-400">
        <button
          onClick={() => setProfileTab('reels')}
          className={`py-3 flex-1 flex justify-center items-center border-b-2 transition-colors cursor-pointer ${
            profileTab === 'reels' ? 'border-cyan-400 text-white' : 'border-transparent hover:text-zinc-200'
          }`}
        >
          <Grid className="w-4 h-4" />
        </button>
        <button
          onClick={() => setProfileTab('saved')}
          className={`py-3 flex-1 flex justify-center items-center border-b-2 transition-colors cursor-pointer ${
            profileTab === 'saved' ? 'border-amber-400 text-white' : 'border-transparent hover:text-zinc-200'
          }`}
        >
          <Bookmark className="w-4 h-4" />
        </button>
        <button
          onClick={() => setProfileTab('liked')}
          className={`py-3 flex-1 flex justify-center items-center border-b-2 transition-colors cursor-pointer ${
            profileTab === 'liked' ? 'border-pink-500 text-white' : 'border-transparent hover:text-zinc-200'
          }`}
        >
          <Heart className="w-4 h-4" />
        </button>
      </div>

      {/* Grid Display */}
      <div className="p-3">
        {displayedReels.length === 0 ? (
          <div className="py-12 text-center text-zinc-500 space-y-2">
            <p className="text-xs">No reels in this tab yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1.5">
            {displayedReels.map((reel) => (
              <div
                key={reel.id}
                onClick={() => {
                  const idx = reels.findIndex((r) => r.id === reel.id);
                  if (idx !== -1) setCurrentReelIndex(idx);
                  setActiveTab('reels');
                }}
                className="relative aspect-[9/16] bg-zinc-900 rounded-lg overflow-hidden group cursor-pointer"
              >
                <video
                  src={reel.videoUrl}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  muted
                  playsInline
                  preload="metadata"
                />
                <div className="absolute bottom-1 left-1.5 flex items-center gap-1 text-[10px] text-white drop-shadow-md">
                  <span>♥</span>
                  <span>{reel.likes}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* BOTTOM PROFILE NAVIGATION AREA: CREATOR STUDIO BUTTON */}
        <div className="pt-4 pb-2 px-1">
          <div
            onClick={openCreatorStudio}
            className="w-full py-3 px-4 rounded-2xl bg-zinc-900/90 border border-cyan-500/30 hover:border-cyan-400 text-white flex items-center justify-between cursor-pointer group shadow-lg transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-zinc-950 font-black">
                <ZinistagSymbol sizeClass="w-4 h-4" glow={false} />
              </div>
              <div className="text-left">
                <span className="text-xs font-black text-white block">Creator Studio</span>
                <span className="text-[10px] text-zinc-400">Manage 80/20 brand deals, memberships & payouts</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-cyan-400 text-xs font-bold">
              <span>Enter</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
