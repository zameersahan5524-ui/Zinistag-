import React, { useState, useEffect } from 'react';
import {
  X,
  TrendingUp,
  DollarSign,
  Briefcase,
  Users,
  CreditCard,
  ShieldCheck,
  Award,
  ChevronRight,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ExternalLink,
  Plus,
  Send,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { monetizationStore } from '../services/monetizationStore';
import {
  CreatorMonetizationProfile,
  BrandCampaign,
  CollaborationDeal,
  SubscriptionTier,
  PayoutMethod,
  PayoutRequest,
  VerificationRequest
} from '../types/monetization';
import { VerifiedBadge } from './VerifiedBadge';
import { ZinistagSymbol } from './ZinistagLogo';

interface CreatorStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'overview' | 'monetization' | 'brand_deals' | 'subscriptions' | 'payouts' | 'verification';
}

export const CreatorStudioModal: React.FC<CreatorStudioModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'overview'
}) => {
  const { currentUser, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'monetization' | 'brand_deals' | 'subscriptions' | 'payouts' | 'verification'>(initialTab);

  // Studio data state
  const [profile, setProfile] = useState<CreatorMonetizationProfile>(() => monetizationStore.getCreatorProfile(currentUser.id));
  const [campaigns, setCampaigns] = useState<BrandCampaign[]>(() => monetizationStore.getState().campaigns);
  const [deals, setDeals] = useState<CollaborationDeal[]>(() => monetizationStore.getState().deals);
  const [tiers, setTiers] = useState<SubscriptionTier[]>(() => monetizationStore.getState().tiers);
  const [payoutMethods, setPayoutMethods] = useState<PayoutMethod[]>(() => monetizationStore.getState().payoutMethods);
  const [payoutRequests, setPayoutRequests] = useState<PayoutRequest[]>(() => monetizationStore.getState().payoutRequests);
  const [existingVerification, setExistingVerification] = useState<VerificationRequest | undefined>(() => monetizationStore.getCreatorVerificationRequest(currentUser.id));

  // Payout request form state
  const [payoutAmount, setPayoutAmount] = useState<string>('');
  const [selectedMethodId, setSelectedMethodId] = useState<string>('');
  const [isSubmittingPayout, setIsSubmittingPayout] = useState(false);

  // New Payout Method state
  const [showAddMethodModal, setShowAddMethodModal] = useState(false);
  const [newMethodType, setNewMethodType] = useState<'bank_transfer' | 'paypal' | 'upi'>('bank_transfer');
  const [newMethodTitle, setNewMethodTitle] = useState('');
  const [newMethodDetails, setNewMethodDetails] = useState('');

  // Deliverable Submission state
  const [selectedDealForDeliverable, setSelectedDealForDeliverable] = useState<CollaborationDeal | null>(null);
  const [deliverableLink, setDeliverableLink] = useState('');
  const [deliverableNotes, setDeliverableNotes] = useState('');

  // Verification request form state
  const [legalName, setLegalName] = useState('');
  const [category, setCategory] = useState('Digital Creator & Motion Graphics');
  const [idType, setIdType] = useState<'passport' | 'drivers_license' | 'national_id' | 'business_doc'>('passport');
  const [idRefNumber, setIdRefNumber] = useState('');
  const [socialLink1, setSocialLink1] = useState('');
  const [portfolioLink, setPortfolioLink] = useState('');
  const [justification, setJustification] = useState('');

  // Refresh data helper
  const reloadData = () => {
    setProfile(monetizationStore.getCreatorProfile(currentUser.id));
    setCampaigns(monetizationStore.getState().campaigns);
    setDeals(monetizationStore.getState().deals);
    setTiers(monetizationStore.getState().tiers);
    setPayoutMethods(monetizationStore.getState().payoutMethods);
    setPayoutRequests(monetizationStore.getState().payoutRequests);
    setExistingVerification(monetizationStore.getCreatorVerificationRequest(currentUser.id));
  };

  useEffect(() => {
    if (isOpen) {
      reloadData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isVerified = monetizationStore.isUserVerified(currentUser.id);

  // Handle Apply to Campaign
  const handleApplyToCampaign = (campaign: BrandCampaign) => {
    const res = monetizationStore.applyToCampaign(campaign.id, currentUser.id, currentUser.username, currentUser.name);
    if (res.success) {
      showToast(`Applied to ${campaign.brandName} campaign! 🚀`);
      reloadData();
    } else {
      showToast(res.error || 'Failed to apply');
    }
  };

  // Handle Accept Deal
  const handleAcceptDeal = (dealId: string) => {
    if (monetizationStore.acceptDeal(dealId)) {
      showToast('Brand deal accepted! 80% creator revenue secured 🤝');
      reloadData();
    }
  };

  // Handle Submit Deliverable
  const handleSubmitDeliverable = () => {
    if (!selectedDealForDeliverable || !deliverableLink.trim()) {
      showToast('Please provide a valid content link');
      return;
    }
    if (monetizationStore.submitDeliverable(selectedDealForDeliverable.id, deliverableLink, deliverableNotes)) {
      showToast('Deliverables submitted for brand approval! 📤');
      setSelectedDealForDeliverable(null);
      setDeliverableLink('');
      setDeliverableNotes('');
      reloadData();
    }
  };

  // Handle Request Payout
  const handleRequestPayout = () => {
    const amountNum = parseFloat(payoutAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      showToast('Please enter a valid payout amount');
      return;
    }

    setIsSubmittingPayout(true);
    const methodId = selectedMethodId || (payoutMethods[0] ? payoutMethods[0].id : '');
    const res = monetizationStore.requestPayout(currentUser.id, amountNum, methodId);

    setIsSubmittingPayout(false);
    if (res.success) {
      showToast(`Payout request for $${amountNum.toFixed(2)} submitted! 💸`);
      setPayoutAmount('');
      reloadData();
    } else {
      showToast(res.error || 'Payout request failed');
    }
  };

  // Handle Add Payout Method
  const handleSavePayoutMethod = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMethodTitle || !newMethodDetails) {
      showToast('Please fill all payment method details');
      return;
    }

    monetizationStore.addPayoutMethod({
      type: newMethodType,
      title: newMethodTitle,
      accountDetails: newMethodDetails,
      isDefault: payoutMethods.length === 0
    });

    showToast('New payout method added and verified! 💳');
    setShowAddMethodModal(false);
    setNewMethodTitle('');
    setNewMethodDetails('');
    reloadData();
  };

  // Handle Submit Verification Request
  const handleSubmitVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!legalName || !idRefNumber || !justification) {
      showToast('Please complete all required verification fields');
      return;
    }

    const res = monetizationStore.submitVerificationRequest({
      creatorId: currentUser.id,
      creatorName: legalName,
      creatorUsername: currentUser.username,
      category,
      officialIdType: idType,
      idReference: idRefNumber,
      socialLinks: socialLink1 ? [socialLink1] : [],
      portfolioUrl: portfolioLink,
      justification
    });

    if (res.success) {
      showToast(res.message);
      reloadData();
    } else {
      showToast(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col justify-end sm:justify-center items-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg h-[92vh] sm:h-[840px] bg-zinc-950 text-white rounded-t-3xl sm:rounded-3xl border border-white/10 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-zinc-950/95 backdrop-blur-md px-5 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <ZinistagSymbol sizeClass="w-5 h-5" glow={false} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black tracking-wide text-white font-['Outfit']">
                  Creator Studio
                </h2>
                {isVerified && <VerifiedBadge size="sm" />}
              </div>
              <p className="text-[11px] text-zinc-400">
                Monetization, Analytics & Brand Deals
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex border-b border-white/10 bg-zinc-900/60 overflow-x-auto no-scrollbar px-3 py-2 gap-1.5 shrink-0">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'overview'
                ? 'bg-cyan-500 text-zinc-950 shadow-md shadow-cyan-500/20'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('monetization')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'monetization'
                ? 'bg-cyan-500 text-zinc-950 shadow-md shadow-cyan-500/20'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>80/20 Revenue</span>
          </button>

          <button
            onClick={() => setActiveTab('brand_deals')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'brand_deals'
                ? 'bg-cyan-500 text-zinc-950 shadow-md shadow-cyan-500/20'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Brand Deals</span>
            {deals.filter((d) => d.status === 'offer_received').length > 0 && (
              <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('subscriptions')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'subscriptions'
                ? 'bg-cyan-500 text-zinc-950 shadow-md shadow-cyan-500/20'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Memberships</span>
          </button>

          <button
            onClick={() => setActiveTab('payouts')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'payouts'
                ? 'bg-cyan-500 text-zinc-950 shadow-md shadow-cyan-500/20'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Payouts</span>
          </button>

          <button
            onClick={() => setActiveTab('verification')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'verification'
                ? 'bg-cyan-500 text-zinc-950 shadow-md shadow-cyan-500/20'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Blue Badge</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* ================= OVERVIEW TAB ================= */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Creator Greeting & Status Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-zinc-900 to-zinc-900/60 border border-white/10 relative overflow-hidden">
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                      Live Performance Dashboard
                    </span>
                    <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                      <span>Welcome, {currentUser.name}</span>
                      {isVerified && <VerifiedBadge size="xs" />}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Monetization Status: <span className="text-emerald-400 font-semibold">Active & Good Standing</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-zinc-400 block">Available Balance</span>
                    <span className="text-xl font-black text-emerald-400">
                      ${profile.availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Analytics Metric Cards Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3.5 rounded-2xl bg-zinc-900/90 border border-white/5 space-y-1">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="text-xs font-medium">Total Views</span>
                    <Eye className="w-4 h-4 text-cyan-400" />
                  </div>
                  <p className="text-xl font-black text-white">
                    {(profile.totalViews / 1000).toFixed(1)}k
                  </p>
                  <p className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                    <ArrowUpRight className="w-3 h-3" /> +18.4% this week
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-zinc-900/90 border border-white/5 space-y-1">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="text-xs font-medium">Watch Time</span>
                    <Clock className="w-4 h-4 text-pink-400" />
                  </div>
                  <p className="text-xl font-black text-white">
                    {profile.totalWatchHours.toLocaleString()} hrs
                  </p>
                  <p className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                    <ArrowUpRight className="w-3 h-3" /> +12.1% engagement
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-zinc-900/90 border border-white/5 space-y-1">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="text-xs font-medium">Followers</span>
                    <Users className="w-4 h-4 text-indigo-400" />
                  </div>
                  <p className="text-xl font-black text-white">
                    {currentUser.followers ? (currentUser.followers / 1000).toFixed(1) + 'k' : '14.2k'}
                  </p>
                  <p className="text-[10px] text-cyan-400 font-semibold">
                    Organic Growth Rate: 9.2%
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-zinc-900/90 border border-white/5 space-y-1">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="text-xs font-medium">Avg Engagement</span>
                    <Sparkles className="w-4 h-4 text-amber-400" />
                  </div>
                  <p className="text-xl font-black text-white">
                    {profile.avgEngagementRate}%
                  </p>
                  <p className="text-[10px] text-zinc-400">
                    Top 5% of video creators
                  </p>
                </div>
              </div>

              {/* Fast Quick Actions */}
              <div className="p-4 rounded-2xl bg-zinc-900/50 border border-white/10 space-y-3">
                <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  Quick Actions
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setActiveTab('brand_deals')}
                    className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-colors cursor-pointer"
                  >
                    <span className="text-xs font-bold text-white block">Browse Brand Deals</span>
                    <span className="text-[10px] text-zinc-400">3 high-budget campaigns open</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('payouts')}
                    className="p-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-left transition-colors cursor-pointer"
                  >
                    <span className="text-xs font-bold text-emerald-400 block">Request Payout</span>
                    <span className="text-[10px] text-zinc-400">${profile.availableBalance.toFixed(2)} available</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= MONETIZATION & 80/20 SPLIT TAB ================= */}
          {activeTab === 'monetization' && (
            <div className="space-y-4">
              {/* Official 80/20 Split Breakdown Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-950/40 via-zinc-900 to-zinc-950 border border-cyan-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-cyan-400" />
                    <h3 className="text-sm font-black text-white">
                      Automatic 80/20 Revenue Policy
                    </h3>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-[10px] font-bold text-cyan-300">
                    Transparent Splits
                  </span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  ZINISTAG operates on an industry-leading creator-first split. For every completed brand collaboration, you keep <strong className="text-white">80% of confirmed revenue</strong>, while Zinistag retains 20% to cover payment infrastructure and platform operations.
                </p>

                {/* Visual Ratio Bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="h-3.5 w-full bg-zinc-800 rounded-full overflow-hidden flex">
                    <div className="bg-cyan-400 h-full flex items-center justify-center text-[9px] font-black text-zinc-950" style={{ width: '80%' }}>
                      80% Creator
                    </div>
                    <div className="bg-pink-500 h-full flex items-center justify-center text-[9px] font-black text-white" style={{ width: '20%' }}>
                      20%
                    </div>
                  </div>
                  <div className="flex justify-between text-[11px] text-zinc-400 font-medium">
                    <span>Your Share: 80%</span>
                    <span>Platform Fee: 20%</span>
                  </div>
                </div>
              </div>

              {/* Financial Balances Card */}
              <div className="grid grid-cols-3 gap-2">
                <div className="p-3 rounded-2xl bg-zinc-900 border border-white/5 text-center">
                  <span className="text-[10px] text-zinc-400 uppercase font-bold block">Available</span>
                  <span className="text-base font-black text-emerald-400">
                    ${profile.availableBalance.toFixed(2)}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-zinc-900 border border-white/5 text-center">
                  <span className="text-[10px] text-zinc-400 uppercase font-bold block">Pending</span>
                  <span className="text-base font-black text-amber-400">
                    ${profile.pendingBalance.toFixed(2)}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-zinc-900 border border-white/5 text-center">
                  <span className="text-[10px] text-zinc-400 uppercase font-bold block">Total Paid</span>
                  <span className="text-base font-black text-white">
                    ${profile.totalPaidOut.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Recent Transactions Ledger */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Recent Monetization Ledger
                </h4>
                <div className="space-y-2">
                  {monetizationStore.getState().transactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="p-3 rounded-xl bg-zinc-900/80 border border-white/5 flex items-center justify-between"
                    >
                      <div>
                        <p className="text-xs font-bold text-white">{tx.description}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-zinc-400">
                            {new Date(tx.createdAt).toLocaleDateString()}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-semibold">
                            {tx.status}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-black text-emerald-400 block">
                          +${tx.creatorShare.toFixed(2)}
                        </span>
                        <span className="text-[10px] text-zinc-500">
                          Gross: ${tx.grossAmount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= BRAND DEALS MARKETPLACE TAB ================= */}
          {activeTab === 'brand_deals' && (
            <div className="space-y-4">
              {/* Active Collaborations Section */}
              {deals.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Your Active Collaborations ({deals.length})</span>
                  </h4>
                  <div className="space-y-2.5">
                    {deals.map((deal) => (
                      <div
                        key={deal.id}
                        className="p-3.5 rounded-2xl bg-zinc-900 border border-white/10 space-y-2.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={deal.brandLogo}
                              alt={deal.brandName}
                              className="w-9 h-9 rounded-xl object-cover border border-white/10"
                              crossOrigin="anonymous"
                            />
                            <div>
                              <span className="text-[10px] text-cyan-400 font-bold uppercase">{deal.brandName}</span>
                              <h5 className="text-xs font-bold text-white line-clamp-1">{deal.campaignTitle}</h5>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-xs font-black text-emerald-400 block">
                              ${deal.creatorShareAmount.toLocaleString()}
                            </span>
                            <span className="text-[9px] text-zinc-400">(Your 80% Cut)</span>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className="flex items-center justify-between pt-1 border-t border-white/5 text-xs">
                          <span className="text-[11px] text-zinc-400">
                            Status: <strong className="text-white capitalize">{deal.status.replace('_', ' ')}</strong>
                          </span>

                          {deal.status === 'offer_received' && (
                            <button
                              onClick={() => handleAcceptDeal(deal.id)}
                              className="px-3 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-[11px] cursor-pointer"
                            >
                              Accept Deal (80%)
                            </button>
                          )}

                          {deal.status === 'accepted' && (
                            <button
                              onClick={() => setSelectedDealForDeliverable(deal)}
                              className="px-3 py-1 rounded-lg bg-pink-500 hover:bg-pink-400 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                            >
                              <Send className="w-3 h-3" />
                              <span>Submit Content</span>
                            </button>
                          )}

                          {deal.status === 'content_submitted' && (
                            <span className="text-[11px] text-amber-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              In Brand Review
                            </span>
                          )}

                          {deal.status === 'approved_and_paid' && (
                            <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Paid & Completed
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Browse Open Campaigns */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                    Available Brand Campaigns
                  </h4>
                  <span className="text-[11px] text-cyan-400 font-semibold">
                    {campaigns.length} Opportunities
                  </span>
                </div>

                <div className="space-y-3">
                  {campaigns.map((camp) => {
                    const split = monetizationStore.calculateDealSplit(camp.budget);
                    const alreadyApplied = deals.some((d) => d.campaignId === camp.id);

                    return (
                      <div
                        key={camp.id}
                        className="p-4 rounded-2xl bg-zinc-900/90 border border-white/10 space-y-3"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={camp.brandLogo}
                              alt={camp.brandName}
                              className="w-10 h-10 rounded-xl object-cover border border-white/10"
                              crossOrigin="anonymous"
                            />
                            <div>
                              <span className="text-[10px] font-bold text-pink-400 uppercase tracking-wide">
                                {camp.category} • {camp.brandName}
                              </span>
                              <h5 className="text-sm font-bold text-white">{camp.title}</h5>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-zinc-400">
                            Due {camp.deadline}
                          </span>
                        </div>

                        <p className="text-xs text-zinc-300 leading-relaxed">
                          {camp.description}
                        </p>

                        {/* Deliverables Checklist */}
                        <div className="flex flex-wrap gap-1.5">
                          {camp.deliverables.map((item, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-lg bg-zinc-800 text-[10px] text-zinc-300 border border-white/5"
                            >
                              ✓ {item}
                            </span>
                          ))}
                        </div>

                        {/* Revenue Split & Apply */}
                        <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-white/5 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-zinc-400 block">Total Budget: ${camp.budget.toLocaleString()}</span>
                            <span className="text-xs font-black text-emerald-400">
                              Your 80% Payout: ${split.creatorShare.toLocaleString()}
                            </span>
                          </div>

                          <button
                            disabled={alreadyApplied}
                            onClick={() => handleApplyToCampaign(camp)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              alreadyApplied
                                ? 'bg-zinc-800 text-zinc-400 cursor-not-allowed'
                                : 'bg-cyan-500 hover:bg-cyan-400 text-zinc-950'
                            }`}
                          >
                            {alreadyApplied ? 'Applied' : 'Apply (Media Kit)'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ================= PAID SUBSCRIPTIONS TAB ================= */}
          {activeTab === 'subscriptions' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-950/30 to-purple-950/30 border border-pink-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-pink-400" />
                    <span>Fan Memberships & Exclusive Content</span>
                  </h3>
                  <span className="text-xs font-black text-pink-400">
                    {profile.subscriberCount} Active Subscribers
                  </span>
                </div>
                <p className="text-xs text-zinc-300">
                  Allow your top supporters to subscribe for exclusive behind-the-scenes reels, badge colors, and project files. Subscriptions use an independent creator-first commission model.
                </p>
              </div>

              {/* Tiers List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                    Your Membership Tiers
                  </h4>
                  <button
                    onClick={() => showToast('Tier customization enabled!')}
                    className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Tier</span>
                  </button>
                </div>

                {tiers.map((tier) => (
                  <div
                    key={tier.id}
                    className="p-4 rounded-2xl bg-zinc-900 border border-white/10 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: tier.badgeColor }}
                        />
                        <h5 className="text-sm font-bold text-white">{tier.name}</h5>
                      </div>
                      <span className="text-base font-black text-white">
                        ${tier.priceMonthly.toFixed(2)}<span className="text-xs text-zinc-400 font-normal">/mo</span>
                      </span>
                    </div>

                    <p className="text-xs text-zinc-300">{tier.description}</p>

                    <div className="space-y-1 pt-1">
                      {tier.perks.map((perk, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-zinc-400">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span>{perk}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= PAYOUT SETTINGS TAB ================= */}
          {activeTab === 'payouts' && (
            <div className="space-y-4">
              {/* Balance & Threshold Card */}
              <div className="p-4 rounded-2xl bg-zinc-900 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-zinc-400 uppercase font-bold block">
                      Available for Immediate Payout
                    </span>
                    <span className="text-2xl font-black text-emerald-400">
                      ${profile.availableBalance.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-zinc-400 block">Min Threshold</span>
                    <span className="text-xs font-bold text-zinc-200">$50.00</span>
                  </div>
                </div>

                {/* Progress to Minimum Threshold */}
                <div className="space-y-1">
                  <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-400 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (profile.availableBalance / 50) * 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-zinc-400">
                    <span>{profile.availableBalance >= 50 ? 'Eligible for instant withdrawal' : 'Threshold not yet reached'}</span>
                    <span>100% Secure & Idempotent</span>
                  </div>
                </div>

                {/* Request Payout Form */}
                <div className="pt-2 border-t border-white/10 space-y-2.5">
                  <label className="text-xs font-bold text-zinc-300 block">
                    Withdrawal Amount ($ USD)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={payoutAmount}
                      onChange={(e) => setPayoutAmount(e.target.value)}
                      placeholder={`Max: $${profile.availableBalance.toFixed(2)}`}
                      className="flex-1 px-3 py-2 rounded-xl bg-zinc-950 border border-white/10 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400"
                    />
                    <button
                      onClick={() => setPayoutAmount(profile.availableBalance.toString())}
                      className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-cyan-400 cursor-pointer"
                    >
                      Max
                    </button>
                    <button
                      disabled={profile.availableBalance < 50 || isSubmittingPayout}
                      onClick={handleRequestPayout}
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-zinc-950 font-black text-xs cursor-pointer transition-all"
                    >
                      {isSubmittingPayout ? 'Processing...' : 'Withdraw'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Payout Methods List */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                    Linked Payout Accounts
                  </h4>
                  <button
                    onClick={() => setShowAddMethodModal(true)}
                    className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Method</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {payoutMethods.map((method) => (
                    <div
                      key={method.id}
                      className="p-3 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-cyan-400">
                          <CreditCard className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">{method.title}</span>
                            {method.isDefault && (
                              <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-400 text-[9px] font-bold">
                                Default
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-zinc-400 block">{method.accountDetails}</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Verified
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payout History List */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Payout History
                </h4>
                <div className="space-y-2">
                  {payoutRequests.map((req) => (
                    <div
                      key={req.id}
                      className="p-3 rounded-xl bg-zinc-900/60 border border-white/5 flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">
                            ${req.amount.toFixed(2)}
                          </span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold capitalize ${
                            req.status === 'completed'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-amber-500/20 text-amber-400'
                          }`}>
                            {req.status}
                          </span>
                        </div>
                        <span className="text-[10px] text-zinc-400 block mt-0.5">
                          {req.payoutMethodDetails} • {new Date(req.requestedAt).toLocaleDateString()}
                        </span>
                      </div>
                      {req.transactionRef && (
                        <span className="text-[10px] text-zinc-500 font-mono">
                          {req.transactionRef}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= BLUE BADGE & VERIFICATION TAB ================= */}
          {activeTab === 'verification' && (
            <div className="space-y-4">
              {/* Badge Status Banner */}
              <div className="p-4 rounded-2xl bg-zinc-900 border border-white/10 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0">
                  <VerifiedBadge size="lg" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">Official Verification Status</h3>
                    {isVerified ? (
                      <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold">
                        Verified Creator
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                        Unverified
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">
                    {isVerified
                      ? 'Your account has been officially validated and granted the blue badge by the authorized ZINISTAG Super-Admin.'
                      : 'Submit an application below. Only the authorized Super-Admin can grant official badges.'}
                  </p>
                </div>
              </div>

              {/* Pending Request Banner if existing */}
              {existingVerification && existingVerification.status === 'pending' && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-amber-300">
                      Verification Application Pending Super-Admin Review
                    </h4>
                    <p className="text-[11px] text-zinc-300 mt-1">
                      Submitted on {new Date(existingVerification.submittedAt).toLocaleDateString()}. The Super-Admin reviews identity documents and content authenticity before issuing the official badge.
                    </p>
                  </div>
                </div>
              )}

              {/* Verification Request Form (Only if not verified) */}
              {!isVerified && (!existingVerification || existingVerification.status === 'rejected') && (
                <form onSubmit={handleSubmitVerification} className="space-y-3 p-4 rounded-2xl bg-zinc-900 border border-white/10">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Official Verification Application
                  </h4>
                  <p className="text-xs text-zinc-400">
                    Provide verified government credentials and portfolio links. Applications are manually audited for security compliance.
                  </p>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-zinc-300">Legal Full Name</label>
                    <input
                      type="text"
                      required
                      value={legalName}
                      onChange={(e) => setLegalName(e.target.value)}
                      placeholder="e.g. Zameer Sahan"
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-zinc-300">Document Type</label>
                      <select
                        value={idType}
                        onChange={(e: any) => setIdType(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
                      >
                        <option value="passport">Passport</option>
                        <option value="drivers_license">Driver License</option>
                        <option value="national_id">National ID</option>
                        <option value="business_doc">Business Reg</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-zinc-300">ID Reference Number</label>
                      <input
                        type="text"
                        required
                        value={idRefNumber}
                        onChange={(e) => setIdRefNumber(e.target.value)}
                        placeholder="e.g. AB-1948201"
                        className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-zinc-300">Content Category</label>
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-zinc-300">Portfolio / Social URL</label>
                    <input
                      type="url"
                      value={socialLink1}
                      onChange={(e) => setSocialLink1(e.target.value)}
                      placeholder="https://instagram.com/yourhandle or website"
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-zinc-300">Why should your account be verified?</label>
                    <textarea
                      rows={2}
                      required
                      value={justification}
                      onChange={(e) => setJustification(e.target.value)}
                      placeholder="Briefly describe your original content and public audience presence..."
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-black text-xs transition-colors cursor-pointer"
                  >
                    Submit for Super-Admin Evaluation
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Deliverable Submission Modal Overlay */}
        {selectedDealForDeliverable && (
          <div className="absolute inset-0 z-40 bg-black/90 backdrop-blur-md p-5 flex flex-col justify-center space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white">Submit Campaign Deliverable</h3>
              <button
                onClick={() => setSelectedDealForDeliverable(null)}
                className="p-1 rounded-full text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-zinc-300">
              Submit your draft or published reel link for {selectedDealForDeliverable.brandName}. Once approved, your 80% share (${selectedDealForDeliverable.creatorShareAmount.toLocaleString()}) will disburse immediately.
            </p>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-300">Reel Content URL</label>
              <input
                type="url"
                required
                value={deliverableLink}
                onChange={(e) => setDeliverableLink(e.target.value)}
                placeholder="https://zinistag.app/reel/... or draft preview URL"
                className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-300">Creator Notes for Brand (Optional)</label>
              <textarea
                rows={2}
                value={deliverableNotes}
                onChange={(e) => setDeliverableNotes(e.target.value)}
                placeholder="Audio track details, tags used, or caption breakdown..."
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400 resize-none"
              />
            </div>
            <button
              onClick={handleSubmitDeliverable}
              className="w-full py-2.5 rounded-xl bg-pink-500 hover:bg-pink-400 text-white font-bold text-xs cursor-pointer"
            >
              Confirm & Submit Deliverable
            </button>
          </div>
        )}

        {/* Add Payout Method Modal Overlay */}
        {showAddMethodModal && (
          <div className="absolute inset-0 z-40 bg-black/90 backdrop-blur-md p-5 flex flex-col justify-center space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white">Add Payout Method</h3>
              <button
                onClick={() => setShowAddMethodModal(false)}
                className="p-1 rounded-full text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSavePayoutMethod} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-300">Method Type</label>
                <select
                  value={newMethodType}
                  onChange={(e: any) => setNewMethodType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white"
                >
                  <option value="bank_transfer">Direct Bank Transfer (ACH / SWIFT / IBAN)</option>
                  <option value="paypal">PayPal</option>
                  <option value="upi">UPI / Instant Digital Wallet</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-300">Account Label</label>
                <input
                  type="text"
                  required
                  value={newMethodTitle}
                  onChange={(e) => setNewMethodTitle(e.target.value)}
                  placeholder="e.g. Citibank Primary Checking or PayPal"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-300">Account / Routing Details</label>
                <input
                  type="text"
                  required
                  value={newMethodDetails}
                  onChange={(e) => setNewMethodDetails(e.target.value)}
                  placeholder="Account number / email / UPI ID"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs cursor-pointer"
              >
                Verify & Save Payout Method
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
