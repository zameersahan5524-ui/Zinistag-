import React, { useState, useMemo } from 'react';
import {
  Search,
  Flame,
  TrendingUp,
  Sparkles,
  Compass,
  Zap,
  Sliders,
  Award,
  Crown
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MOCK_CREATORS } from '../data/mockData';
import { VerifiedBadge } from './VerifiedBadge';
import { monetizationStore } from '../services/monetizationStore';

export const DiscoverScreen: React.FC = () => {
  const {
    reels,
    setCurrentReelIndex,
    setActiveTab,
    toggleFollow,
    openSubscriptionModal,
    openAdminDashboard
  } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [discoverySort, setDiscoverySort] = useState<'ai_algorithm' | 'trending' | 'latest'>('ai_algorithm');

  const trendingTags = ['#zinistag', '#cyberpunk', '#motionvfx', '#dronefpv', '#streetstyle', '#nightlife', '#tokyo', '#synthwave'];

  // Calculate AI Discovery scores & sort
  const scoredReels = useMemo(() => {
    return reels.map((reel) => {
      const scoreData = monetizationStore.computeReelDiscoveryScore(reel);
      return {
        ...reel,
        discoveryScore: scoreData.totalScore,
        scoreBreakdown: scoreData.breakdown
      };
    });
  }, [reels]);

  const filteredReels = useMemo(() => {
    let list = scoredReels.filter(
      (reel) =>
        reel.caption.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reel.creator.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reel.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (discoverySort === 'ai_algorithm') {
      list.sort((a, b) => b.discoveryScore - a.discoveryScore);
    } else if (discoverySort === 'trending') {
      list.sort((a, b) => b.likes - a.likes);
    }
    return list;
  }, [scoredReels, searchTerm, discoverySort]);

  return (
    <div className="w-full h-full bg-zinc-950 text-white overflow-y-auto pb-24 select-none">
      {/* Search Header */}
      <div className="sticky top-0 z-30 bg-zinc-950/90 backdrop-blur-md px-4 pt-4 pb-3 border-b border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-cyan-400" />
            <h1 className="text-lg font-black tracking-wide font-['Outfit']">Discover</h1>
          </div>
          <button
            onClick={openAdminDashboard}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-zinc-300 font-semibold cursor-pointer transition-colors"
          >
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI Weights</span>
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search creators, hashtags, or reels..."
            className="w-full bg-zinc-900 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Algorithm Sort Switcher */}
        <div className="flex items-center gap-1.5 pt-0.5">
          <button
            onClick={() => setDiscoverySort('ai_algorithm')}
            className={`px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              discoverySort === 'ai_algorithm'
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md shadow-cyan-500/20'
                : 'bg-white/5 text-zinc-400 hover:text-white'
            }`}
          >
            <Zap className="w-3 h-3 text-amber-300" />
            <span>AI Discovery Algorithm</span>
          </button>
          <button
            onClick={() => setDiscoverySort('trending')}
            className={`px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
              discoverySort === 'trending'
                ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-md shadow-pink-500/20'
                : 'bg-white/5 text-zinc-400 hover:text-white'
            }`}
          >
            <Flame className="w-3 h-3" />
            <span>Trending</span>
          </button>
        </div>
      </div>

      {/* Trending Topics Chip Bar */}
      <div className="px-4 py-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 mb-2 uppercase tracking-wider">
          <Flame className="w-3.5 h-3.5 text-pink-500" />
          Trending Topics
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {trendingTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSearchTerm(tag.replace('#', ''))}
              className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-zinc-300 shrink-0 transition-colors cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Creators Carousel with Verified Badges & Subscriptions */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between text-xs font-bold text-zinc-400 mb-2.5 uppercase tracking-wider">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Top Creators</span>
          </div>
          <span className="text-[10px] text-zinc-500 lowercase">swipe & explore</span>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {MOCK_CREATORS.map((creator) => {
            const isVerified = monetizationStore.isUserVerified(creator.id) || creator.verified;

            return (
              <div
                key={creator.id}
                className="w-40 shrink-0 bg-zinc-900 border border-white/10 rounded-2xl p-3 flex flex-col items-center text-center space-y-2 relative"
              >
                <div className="w-14 h-14 rounded-full p-0.5 bg-gradient-to-tr from-cyan-400 to-pink-500 overflow-hidden relative">
                  <img
                    src={creator.avatar}
                    alt={creator.name}
                    className="w-full h-full object-cover rounded-full"
                    crossOrigin="anonymous"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-center gap-1">
                    <p className="text-xs font-bold text-white truncate max-w-[110px]">
                      {creator.name}
                    </p>
                    {isVerified && <VerifiedBadge size="xs" />}
                  </div>
                  <p className="text-[10px] text-zinc-400 truncate max-w-[110px]">
                    @{creator.username}
                  </p>
                </div>

                <div className="w-full space-y-1.5">
                  <button
                    onClick={() => toggleFollow(creator.id)}
                    className={`w-full py-1 text-[11px] font-bold rounded-lg transition-colors cursor-pointer ${
                      creator.isFollowing
                        ? 'bg-zinc-800 text-zinc-300 border border-white/10'
                        : 'bg-cyan-500 text-zinc-950 hover:bg-cyan-400'
                    }`}
                  >
                    {creator.isFollowing ? 'Following' : 'Follow'}
                  </button>

                  <button
                    onClick={() => openSubscriptionModal(creator)}
                    className="w-full py-0.5 text-[10px] font-bold rounded-lg bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 border border-pink-500/30 flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    <Crown className="w-2.5 h-2.5" />
                    <span>Join VIP</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Discovery Reels Grid */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between text-xs font-bold text-zinc-400 mb-3 uppercase tracking-wider">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI Ranked Reels ({filteredReels.length})</span>
          </div>
          {discoverySort === 'ai_algorithm' && (
            <span className="text-[10px] text-cyan-400 font-semibold lowercase">
              neural scoring active
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {filteredReels.map((reel) => {
            const isVerified = monetizationStore.isUserVerified(reel.creator.id) || reel.creator.verified;

            return (
              <div
                key={reel.id}
                onClick={() => {
                  const originalIndex = reels.findIndex((r) => r.id === reel.id);
                  if (originalIndex !== -1) {
                    setCurrentReelIndex(originalIndex);
                  }
                  setActiveTab('reels');
                }}
                className="relative aspect-[9/16] rounded-xl overflow-hidden bg-zinc-900 border border-white/10 group cursor-pointer"
              >
                <video
                  src={reel.videoUrl}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  muted
                  playsInline
                  preload="metadata"
                />

                {/* AI Score Badge in Top-Right Corner */}
                <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-cyan-500/30 text-[9px] font-black text-cyan-300 flex items-center gap-0.5">
                  <Zap className="w-2.5 h-2.5 text-amber-400" />
                  <span>{reel.discoveryScore}%</span>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-2.5">
                  <div className="flex items-center gap-1">
                    <p className="text-[11px] font-bold text-white truncate max-w-[90px]">
                      @{reel.creator.username}
                    </p>
                    {isVerified && <VerifiedBadge size="xs" />}
                  </div>
                  <p className="text-[10px] text-zinc-300 line-clamp-1">
                    {reel.caption}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-pink-400 mt-1">
                    <span>♥ {reel.likes.toLocaleString()}</span>
                    <span className="text-zinc-400 text-[9px]">{reel.createdAt}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
