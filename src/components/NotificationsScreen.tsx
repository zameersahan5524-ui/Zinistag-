import React, { useState } from 'react';
import { Bell, Heart, MessageCircle, UserPlus, Sparkles } from 'lucide-react';
import { MOCK_NOTIFICATIONS } from '../data/mockData';
import { NotificationItem } from '../types';

export const NotificationsScreen: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState<'all' | 'like' | 'comment' | 'follow'>('all');

  const filtered = notifications.filter((n) => filter === 'all' || n.type === filter);

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'like':
        return <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />;
      case 'comment':
        return <MessageCircle className="w-3.5 h-3.5 text-cyan-400" />;
      case 'follow':
        return <UserPlus className="w-3.5 h-3.5 text-indigo-400" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-amber-400" />;
    }
  };

  return (
    <div className="w-full h-full bg-zinc-950 text-white overflow-y-auto pb-20 select-none">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-zinc-950/90 backdrop-blur-md px-4 pt-4 pb-3 border-b border-white/10 space-y-3">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-pink-500" />
          <h1 className="text-lg font-black tracking-wide font-['Outfit']">Activity</h1>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2">
          {(['all', 'like', 'comment', 'follow'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-colors cursor-pointer ${
                filter === f
                  ? 'bg-gradient-to-r from-cyan-500 to-pink-500 text-white'
                  : 'bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white'
              }`}
            >
              {f === 'all' ? 'All Activity' : `${f}s`}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="divide-y divide-white/5">
        {filtered.map((item) => (
          <div
            key={item.id}
            className={`p-4 flex items-center gap-3 hover:bg-white/5 transition-colors ${
              !item.read ? 'bg-cyan-500/5' : ''
            }`}
          >
            <div className="relative shrink-0">
              <div className="w-11 h-11 rounded-full overflow-hidden border border-white/10">
                <img
                  src={item.user.avatar}
                  alt={item.user.name}
                  className="w-full h-full object-cover"
                  crossOrigin="anonymous"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-zinc-900 border border-white/20 flex items-center justify-center">
                {getIcon(item.type)}
              </div>
            </div>

            <div className="flex-1 min-w-0 space-y-0.5">
              <p className="text-xs text-zinc-200 leading-snug">
                <span className="font-bold text-white">@{item.user.username} </span>
                {item.text}
              </p>
              <p className="text-[10px] text-zinc-400">{item.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
