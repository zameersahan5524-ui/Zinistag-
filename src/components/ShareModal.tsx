import React from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  Copy, 
  Share2, 
  Send, 
  Download, 
  QrCode, 
  MessageSquare, 
  Check, 
  Sparkles 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MOCK_CREATORS } from '../data/mockData';

export const ShareModal: React.FC = () => {
  const { activeSharePost, closeShare, showToast } = useApp();

  if (!activeSharePost) return null;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(`https://zinistag.app/p/${activeSharePost.id}`);
    showToast('Post link copied to clipboard! 📋');
    closeShare();
  };

  const handleSendDirect = (recipientName: string) => {
    showToast(`Shared post with @${recipientName} 🚀`);
    closeShare();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/65 backdrop-blur-xs select-none">
      <div className="flex-1" onClick={closeShare} />

      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 26, stiffness: 280 }}
        className="w-full bg-zinc-900 border-t border-white/15 rounded-t-3xl text-white p-5 space-y-4 shadow-2xl"
      >
        {/* Handle & Header */}
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Share Reel</h3>
          </div>
          <button
            onClick={closeShare}
            className="p-1 rounded-full text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Send to Friends */}
        <div>
          <div className="text-[11px] font-bold text-zinc-400 mb-2 uppercase tracking-wider">
            Send via Direct Message
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
            {MOCK_CREATORS.map((creator) => (
              <button
                key={creator.id}
                onClick={() => handleSendDirect(creator.username)}
                className="flex flex-col items-center gap-1.5 w-14 shrink-0 group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-cyan-400 to-purple-500 overflow-hidden group-hover:scale-105 transition-transform">
                  <img
                    src={creator.avatar}
                    alt={creator.name}
                    className="w-full h-full object-cover rounded-full"
                    crossOrigin="anonymous"
                  />
                </div>
                <span className="text-[10px] text-zinc-300 truncate w-full text-center">
                  {creator.name.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Action Grid */}
        <div className="pt-2 border-t border-white/10 grid grid-cols-4 gap-3 text-center">
          <button
            id="share-copy-link-btn"
            onClick={handleCopyLink}
            className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
          >
            <div className="w-11 h-11 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Copy className="w-5 h-5" />
            </div>
            <span className="text-[11px] text-zinc-200">Copy Link</span>
          </button>

          <button
            onClick={() => {
              showToast('Simulating WhatsApp share...');
              closeShare();
            }}
            className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
          >
            <div className="w-11 h-11 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <span className="text-[11px] text-zinc-200">Chat</span>
          </button>

          <button
            onClick={() => {
              showToast('Saving video locally to photos library...');
              closeShare();
            }}
            className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
          >
            <div className="w-11 h-11 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
            <span className="text-[11px] text-zinc-200">Save</span>
          </button>

          <button
            onClick={() => {
              showToast('Generated QR code for ZINISTAG reel');
              closeShare();
            }}
            className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
          >
            <div className="w-11 h-11 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <QrCode className="w-5 h-5" />
            </div>
            <span className="text-[11px] text-zinc-200">QR Code</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
