import React from 'react';
import { Home, Compass, Plus, Bell, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ActiveTab } from '../types';

export const BottomNavBar: React.FC = () => {
  const { activeTab, setActiveTab, currentUser } = useApp();

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'reels',
      label: 'Reels',
      icon: <Home className="w-5 h-5" />
    },
    {
      id: 'discover',
      label: 'Discover',
      icon: <Compass className="w-5 h-5" />
    },
    {
      id: 'create',
      label: 'Create',
      icon: (
        <div className="w-10 h-7 rounded-lg bg-gradient-to-r from-cyan-400 via-indigo-500 to-pink-500 p-0.5 flex items-center justify-center shadow-lg shadow-pink-500/20 active:scale-95 transition-transform">
          <div className="w-full h-full bg-zinc-950 rounded-[6px] flex items-center justify-center">
            <Plus className="w-4 h-4 text-white font-bold" />
          </div>
        </div>
      )
    },
    {
      id: 'notifications',
      label: 'Activity',
      icon: (
        <div className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
        </div>
      )
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: (
        <div className={`w-6 h-6 rounded-full overflow-hidden border ${
          activeTab === 'profile' ? 'border-pink-500 ring-1 ring-pink-500' : 'border-zinc-500'
        }`}>
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-full h-full object-cover"
            crossOrigin="anonymous"
          />
        </div>
      )
    }
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-black/90 backdrop-blur-md border-t border-white/10 px-4 py-2 flex items-center justify-around select-none">
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            id={`nav-${item.id}`}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1 transition-colors cursor-pointer py-1 px-3 ${
              isActive ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {item.icon}
            <span className={`text-[10px] font-medium tracking-tight ${
              isActive ? 'text-white font-semibold' : 'text-zinc-400'
            }`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
