import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Send, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { VerifiedBadge } from './VerifiedBadge';
import { monetizationStore } from '../services/monetizationStore';

export const CommentsModal: React.FC = () => {
  const { activeCommentsPost, closeComments, comments, addComment, currentUser } = useApp();
  const [newText, setNewText] = useState('');

  if (!activeCommentsPost) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;
    addComment(newText);
    setNewText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/70 backdrop-blur-xs select-none">
      <div className="flex-1" onClick={closeComments} />
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        className="w-full max-h-[70vh] bg-zinc-900 border-t border-white/10 rounded-t-3xl text-white flex flex-col shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10">
          <div className="w-6" />
          <h3 className="text-sm font-bold text-zinc-100">
            {activeCommentsPost.commentsCount} Comments
          </h3>
          <button
            onClick={closeComments}
            className="p-1 rounded-full text-zinc-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comment List */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 max-h-[45vh]">
          {comments.map((comment) => {
            const isAuthorVerified = monetizationStore.isUserVerified(comment.author.id) || comment.author.verified;

            return (
              <div key={comment.id} className="flex gap-3 items-start group">
                <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-white/10">
                  <img
                    src={comment.author.avatar}
                    alt={comment.author.name}
                    className="w-full h-full object-cover"
                    crossOrigin="anonymous"
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-bold text-zinc-200">
                      @{comment.author.username}
                    </span>
                    {isAuthorVerified && <VerifiedBadge size="xs" />}
                    <span className="text-[10px] text-zinc-400">
                      • {comment.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {comment.text}
                  </p>
                </div>
                <button className="flex flex-col items-center gap-0.5 text-zinc-400 hover:text-pink-500 pt-1">
                  <Heart className="w-3.5 h-3.5" />
                  <span className="text-[10px]">{comment.likes}</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Comment Input */}
        <form
          onSubmit={handleSubmit}
          className="p-3 bg-zinc-950 border-t border-white/10 flex items-center gap-2.5"
        >
          <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-white/10">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-full h-full object-cover"
              crossOrigin="anonymous"
            />
          </div>
          <input
            type="text"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="Add a comment on ZINISTAG..."
            className="flex-1 bg-zinc-900 border border-white/10 rounded-full px-4 py-2 text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-cyan-500"
          />
          <button
            type="submit"
            disabled={!newText.trim()}
            className="p-2 rounded-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:hover:bg-cyan-500 text-zinc-950 transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </motion.div>
    </div>
  );
};
