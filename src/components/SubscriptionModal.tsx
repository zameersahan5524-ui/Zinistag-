import React, { useState } from 'react';
import {
  X,
  Sparkles,
  CheckCircle2,
  Lock,
  CreditCard,
  ShieldCheck,
  Star,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { monetizationStore } from '../services/monetizationStore';
import { SubscriptionTier, UserSubscription } from '../types/monetization';
import { VerifiedBadge } from './VerifiedBadge';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  creatorId?: string;
  creatorName?: string;
  creatorUsername?: string;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  creatorId = 'creator_1',
  creatorName = 'Elena Rostova',
  creatorUsername = 'elenarost'
}) => {
  const { showToast } = useApp();
  const tiers = monetizationStore.getState().tiers;
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>(tiers[0]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeSub, setActiveSub] = useState<UserSubscription | null>(null);

  if (!isOpen) return null;

  const handleSubscribe = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const sub = monetizationStore.subscribeToCreator(creatorId, creatorUsername, selectedTier);
      setActiveSub(sub);
      setIsProcessing(false);
      showToast(`Subscribed to @${creatorUsername}'s ${selectedTier.name}! 🎉`);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col justify-end sm:justify-center items-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-zinc-950 text-white rounded-t-3xl sm:rounded-3xl border border-pink-500/30 shadow-2xl p-5 space-y-4">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-pink-500/20 text-pink-400">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-pink-400">
              VIP Membership
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Creator Header */}
        <div className="text-center space-y-1">
          <h3 className="text-base font-black text-white flex items-center justify-center gap-1.5">
            <span>Subscribe to {creatorName}</span>
            <VerifiedBadge size="xs" />
          </h3>
          <p className="text-xs text-zinc-400">
            Unlock exclusive reels, behind-the-scenes cuts, and custom badges.
          </p>
        </div>

        {/* Active subscription receipt if already subscribed */}
        {activeSub ? (
          <div className="p-4 rounded-2xl bg-zinc-900 border border-emerald-500/30 text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <Check className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Membership Active!</h4>
              <p className="text-xs text-zinc-400 mt-0.5">
                Tier: <span className="text-emerald-400 font-semibold">{activeSub.tierName}</span> (${activeSub.monthlyAmount}/mo)
              </p>
              <p className="text-[10px] text-zinc-500 mt-1">
                Next renewal: {activeSub.nextRenewalAt} • Cancel anytime
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-full py-2 rounded-xl bg-zinc-800 text-white font-bold text-xs"
            >
              Done & Return to Feed
            </button>
          </div>
        ) : (
          <>
            {/* Tiers List */}
            <div className="space-y-2">
              {tiers.map((tier) => {
                const isSelected = selectedTier.id === tier.id;

                return (
                  <div
                    key={tier.id}
                    onClick={() => setSelectedTier(tier)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-zinc-900 border-pink-500 shadow-md shadow-pink-500/10'
                        : 'bg-zinc-900/50 border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-pink-500 bg-pink-500' : 'border-zinc-600'
                          }`}
                        >
                          {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                        </div>
                        <span className="text-xs font-bold text-white">{tier.name}</span>
                      </div>
                      <span className="text-sm font-black text-white">
                        ${tier.priceMonthly.toFixed(2)}<span className="text-[10px] text-zinc-400 font-normal">/mo</span>
                      </span>
                    </div>

                    <div className="pl-6 pt-1.5 space-y-1">
                      {tier.perks.slice(0, 2).map((perk, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                          <CheckCircle2 className="w-3 h-3 text-cyan-400 shrink-0" />
                          <span>{perk}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Price & Guarantee Notice */}
            <div className="p-3 rounded-xl bg-zinc-900/40 border border-white/5 flex items-center justify-between text-xs">
              <span className="text-zinc-400">Billed monthly</span>
              <span className="text-zinc-300 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                Cancel Anytime
              </span>
            </div>

            {/* Subscribe Action */}
            <button
              disabled={isProcessing}
              onClick={handleSubscribe}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:opacity-95 text-white font-black text-xs shadow-lg shadow-pink-500/25 transition-transform active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              <CreditCard className="w-4 h-4" />
              <span>{isProcessing ? 'Processing...' : `Subscribe for $${selectedTier.priceMonthly.toFixed(2)}/mo`}</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};
