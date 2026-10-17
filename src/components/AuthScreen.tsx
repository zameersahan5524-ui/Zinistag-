import React, { useState } from 'react';
import { X, Mail, Lock, User, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ZinistagLogo } from './ZinistagLogo';

export const AuthScreen: React.FC = () => {
  const { isAuthOpen, closeAuth, showToast } = useApp();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  if (!isAuthOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(isSignUp ? 'Account created! Welcome to Zinistag 🚀' : 'Logged in successfully! ✨');
    closeAuth();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-sm bg-zinc-900 border border-white/10 rounded-3xl text-white p-6 shadow-2xl relative space-y-5">
        <button
          onClick={closeAuth}
          className="absolute top-4 right-4 p-1 rounded-full text-zinc-400 hover:text-white cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center space-y-1.5 pt-2">
          <ZinistagLogo size="lg" layout="vertical" showText={true} wordmarkCase="title" />
          <p className="text-xs text-zinc-400">
            {isSignUp ? 'Create your creator account' : 'Sign in to your Zinistag account'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {isSignUp && (
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full bg-zinc-950 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full bg-zinc-950 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-zinc-950 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-pink-500 text-white font-bold text-xs shadow-lg shadow-pink-500/25 active:scale-98 transition-transform cursor-pointer"
          >
            {isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="text-center pt-1">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs text-zinc-400 hover:text-cyan-400 transition-colors cursor-pointer"
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
};
