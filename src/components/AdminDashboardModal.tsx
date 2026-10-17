import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  ShieldAlert,
  Users,
  DollarSign,
  Briefcase,
  Sliders,
  FileText,
  Lock,
  Unlock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Search,
  ArrowRight,
  TrendingUp,
  Percent
} from 'lucide-react';
import { monetizationStore, MonetizationState } from '../services/monetizationStore';
import {
  VerificationRequest,
  AdminAuditLog,
  CollaborationDeal,
  AlgorithmConfig
} from '../types/monetization';
import { useApp } from '../context/AppContext';
import { MOCK_CREATORS } from '../data/mockData';
import { VerifiedBadge } from './VerifiedBadge';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({ isOpen, onClose }) => {
  const { showToast } = useApp();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => monetizationStore.isAdminAuthenticated());
  const [passkeyInput, setPasskeyInput] = useState<string>('');
  const [authError, setAuthError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'overview' | 'verifications' | 'creators' | 'deals' | 'algorithm' | 'audit_logs'>('overview');

  // Dynamic store state
  const [storeState, setStoreState] = useState<MonetizationState>(() => monetizationStore.getState());
  const [revenueStats, setRevenueStats] = useState(() => monetizationStore.getPlatformRevenueStats());

  // Reason modal for grant/revoke
  const [actionTarget, setActionTarget] = useState<{ userId: string; username: string; grant: boolean } | null>(null);
  const [actionReason, setActionReason] = useState<string>('');

  // Rejection modal
  const [rejectingReq, setRejectingReq] = useState<VerificationRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('');

  // Commission split edit state
  const [creatorShareSlider, setCreatorShareSlider] = useState<number>(storeState.defaultCommissionSplit.creatorPercent);

  // Algorithm weights state
  const [algoWeights, setAlgoWeights] = useState<AlgorithmConfig>(() => monetizationStore.getAlgorithmConfig());

  // Search filter
  const [creatorSearch, setCreatorSearch] = useState<string>('');

  const refreshState = () => {
    setStoreState(monetizationStore.getState());
    setRevenueStats(monetizationStore.getPlatformRevenueStats());
    setAlgoWeights(monetizationStore.getAlgorithmConfig());
  };

  useEffect(() => {
    if (isOpen) {
      setIsAuthenticated(monetizationStore.isAdminAuthenticated());
      refreshState();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle Admin Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const res = monetizationStore.loginAdmin(passkeyInput.trim());
    if (res.success) {
      setIsAuthenticated(true);
      setAuthError(null);
      setPasskeyInput('');
      refreshState();
      showToast('Super-Admin authenticated! 🛡️');
    } else {
      setAuthError(res.message);
    }
  };

  const handleLogout = () => {
    monetizationStore.logoutAdmin();
    setIsAuthenticated(false);
    showToast('Super-Admin session terminated.');
  };

  // Handle Grant/Revoke Badge with Reason
  const handleConfirmVerificationAction = () => {
    if (!actionTarget || !actionReason.trim()) {
      showToast('A clear audit reason is required for verification modification');
      return;
    }

    const res = monetizationStore.setVerificationStatus(
      actionTarget.userId,
      actionTarget.username,
      actionTarget.grant,
      actionReason.trim()
    );

    if (res.success) {
      showToast(actionTarget.grant ? `Blue Badge granted to @${actionTarget.username}!` : `Blue Badge revoked from @${actionTarget.username}`);
      setActionTarget(null);
      setActionReason('');
      refreshState();
    } else {
      showToast(res.error || 'Action failed');
    }
  };

  // Handle Approve Request
  const handleApproveRequest = (req: VerificationRequest) => {
    const res = monetizationStore.setVerificationStatus(
      req.creatorId,
      req.creatorUsername,
      true,
      `Official Verification Approved: Met criteria for ${req.category} (${req.officialIdType}: ${req.idReference})`
    );
    if (res.success) {
      showToast(`Verification approved! Blue badge granted to @${req.creatorUsername} ✨`);
      refreshState();
    } else {
      showToast(res.error || 'Failed to approve');
    }
  };

  // Handle Reject Request
  const handleConfirmRejection = () => {
    if (!rejectingReq || !rejectionReason.trim()) {
      showToast('Please provide a valid rejection explanation');
      return;
    }

    const res = monetizationStore.setVerificationStatus(
      rejectingReq.creatorId,
      rejectingReq.creatorUsername,
      false,
      `Verification Rejected: ${rejectionReason.trim()}`
    );

    if (res.success) {
      showToast(`Verification rejected for @${rejectingReq.creatorUsername}`);
      setRejectingReq(null);
      setRejectionReason('');
      refreshState();
    }
  };

  // Handle Commission Update
  const handleUpdateCommission = () => {
    if (monetizationStore.updateDefaultCommission(creatorShareSlider, `Super-Admin updated commission split to ${creatorShareSlider}% / ${100 - creatorShareSlider}%`)) {
      showToast(`Commission updated to ${creatorShareSlider}% Creator / ${100 - creatorShareSlider}% Platform! 💸`);
      refreshState();
    }
  };

  // Handle Algorithm Tuning Update
  const handleSaveAlgorithm = () => {
    monetizationStore.updateAlgorithmConfig(algoWeights);
    showToast('AI Discovery algorithm weights deployed across feed! 🤖');
    refreshState();
  };

  // Handle Approve Deal & Disburse Payout (Admin action)
  const handleApproveDealPayout = (dealId: string) => {
    const res = monetizationStore.approveAndDisburseDeal(dealId);
    if (res.success) {
      showToast('Collaboration approved & 80/20 revenue disbursed! 💰');
      refreshState();
    } else {
      showToast(res.error || 'Action failed');
    }
  };

  // Combine user list for management
  const allUsers = [
    { id: 'current_user', name: 'Zameer Sahan', username: 'zameersahan', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80', followers: 14200 },
    ...MOCK_CREATORS
  ].filter((u) => u.username.toLowerCase().includes(creatorSearch.toLowerCase()) || u.name.toLowerCase().includes(creatorSearch.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-end sm:justify-center items-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg h-[92vh] sm:h-[840px] bg-zinc-950 text-white rounded-t-3xl sm:rounded-3xl border border-red-500/20 shadow-2xl shadow-red-950/20 flex flex-col overflow-hidden">
        {/* Admin Header */}
        <div className="sticky top-0 z-30 bg-zinc-950/95 backdrop-blur-md px-5 py-4 border-b border-red-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 via-rose-500 to-amber-500 flex items-center justify-center shadow-lg shadow-red-500/20">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black tracking-wide text-white font-['Outfit']">
                  Super-Admin Control
                </h2>
                <span className="px-1.5 py-0.2 rounded bg-red-500/20 text-red-400 text-[10px] font-bold">
                  Authorized Owner
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Verification Security, Revenue & Platform Engine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-white/10 text-[10px] text-zinc-400 hover:text-white font-semibold cursor-pointer"
              >
                Logout
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* AUTHENTICATION GATE */}
        {!isAuthenticated ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 shadow-xl shadow-red-500/10">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-white">Super-Admin Access Restricted</h3>
              <p className="text-xs text-zinc-400 max-w-xs mx-auto leading-relaxed">
                Verification badges, financial revenue splits, and user account controls are strictly restricted to the authorized application owner.
              </p>
            </div>

            <form onSubmit={handleLogin} className="w-full max-w-xs space-y-3 pt-2">
              <div className="space-y-1 text-left">
                <label className="text-[11px] font-bold text-zinc-400">Owner Super-Admin Passkey</label>
                <input
                  type="password"
                  required
                  value={passkeyInput}
                  onChange={(e) => setPasskeyInput(e.target.value)}
                  placeholder="Enter super-admin passkey..."
                  className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-400 font-mono"
                />
                <span className="text-[10px] text-zinc-500 block">
                  Quick owner demo passkey: <code className="text-cyan-400">zinistag2025</code>
                </span>
              </div>

              {authError && (
                <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-2 rounded-xl">
                  {authError}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs shadow-lg shadow-red-600/20 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Unlock className="w-4 h-4" />
                <span>Verify Super-Admin Authority</span>
              </button>
            </form>
          </div>
        ) : (
          <>
            {/* Authenticated Navigation Tabs */}
            <div className="flex border-b border-white/10 bg-zinc-900/60 overflow-x-auto no-scrollbar px-3 py-2 gap-1.5 shrink-0">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'overview'
                    ? 'bg-red-500 text-white shadow-md shadow-red-500/20'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Revenue & Stats</span>
              </button>

              <button
                onClick={() => setActiveTab('verifications')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'verifications'
                    ? 'bg-red-500 text-white shadow-md shadow-red-500/20'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verification Requests</span>
                {revenueStats.pendingVerifications > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-cyan-400 text-zinc-950 font-black text-[9px]">
                    {revenueStats.pendingVerifications}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('creators')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'creators'
                    ? 'bg-red-500 text-white shadow-md shadow-red-500/20'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Creators & Badges</span>
              </button>

              <button
                onClick={() => setActiveTab('deals')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'deals'
                    ? 'bg-red-500 text-white shadow-md shadow-red-500/20'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Brand Deals</span>
              </button>

              <button
                onClick={() => setActiveTab('algorithm')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'algorithm'
                    ? 'bg-red-500 text-white shadow-md shadow-red-500/20'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>AI Discovery</span>
              </button>

              <button
                onClick={() => setActiveTab('audit_logs')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'audit_logs'
                    ? 'bg-red-500 text-white shadow-md shadow-red-500/20'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Audit Logs</span>
              </button>
            </div>

            {/* Main Admin Tab Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* ================= TAB: REVENUE & STATS ================= */}
              {activeTab === 'overview' && (
                <div className="space-y-4">
                  {/* Platform Financial Metrics */}
                  <div className="grid grid-cols-3 gap-2.5">
                    <div className="p-3.5 rounded-2xl bg-zinc-900 border border-white/5 space-y-1">
                      <span className="text-[10px] text-zinc-400 uppercase font-bold block">Gross Volume</span>
                      <p className="text-lg font-black text-white">
                        ${revenueStats.grossVolume.toLocaleString()}
                      </p>
                      <span className="text-[10px] text-zinc-400">Brand + Subscriptions</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-zinc-900 border border-cyan-500/20 space-y-1">
                      <span className="text-[10px] text-cyan-400 uppercase font-bold block">Platform 20% Fee</span>
                      <p className="text-lg font-black text-cyan-400">
                        ${revenueStats.platformEarnings.toLocaleString()}
                      </p>
                      <span className="text-[10px] text-zinc-400">Zinistag share</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-zinc-900 border border-emerald-500/20 space-y-1">
                      <span className="text-[10px] text-emerald-400 uppercase font-bold block">Creator 80% Paid</span>
                      <p className="text-lg font-black text-emerald-400">
                        ${revenueStats.creatorPayouts.toLocaleString()}
                      </p>
                      <span className="text-[10px] text-zinc-400">Direct creator pay</span>
                    </div>
                  </div>

                  {/* Configurable Commission Split Policy */}
                  <div className="p-4 rounded-2xl bg-zinc-900 border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Percent className="w-4 h-4 text-cyan-400" />
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                          Revenue Sharing Commission Policy
                        </h4>
                      </div>
                      <span className="text-xs font-black text-cyan-400">
                        {creatorShareSlider}% Creator / {100 - creatorShareSlider}% Platform
                      </span>
                    </div>

                    <p className="text-xs text-zinc-300">
                      ZINISTAG standard defaults to 80% creator / 20% platform. As Super-Admin, you can tune the split dynamically.
                    </p>

                    <div className="space-y-1">
                      <input
                        type="range"
                        min="50"
                        max="95"
                        step="1"
                        value={creatorShareSlider}
                        onChange={(e) => setCreatorShareSlider(parseInt(e.target.value))}
                        className="w-full accent-cyan-400 cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-zinc-400">
                        <span>50/50</span>
                        <span className="font-bold text-white">Default 80/20</span>
                        <span>95/5</span>
                      </div>
                    </div>

                    <button
                      onClick={handleUpdateCommission}
                      className="w-full py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs cursor-pointer transition-colors"
                    >
                      Deploy Updated Commission Split
                    </button>
                  </div>
                </div>
              )}

              {/* ================= TAB: VERIFICATION REQUESTS ================= */}
              {activeTab === 'verifications' && (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        Pending Verification Applications
                      </h4>
                      <p className="text-[11px] text-zinc-400">
                        Review identity credentials and grant or reject official blue badges.
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-400 font-black text-xs">
                      {storeState.verificationRequests.filter((r) => r.status === 'pending').length} Pending
                    </span>
                  </div>

                  {storeState.verificationRequests.filter((r) => r.status === 'pending').length === 0 ? (
                    <div className="py-12 text-center text-zinc-500 space-y-1">
                      <CheckCircle2 className="w-8 h-8 text-zinc-600 mx-auto" />
                      <p className="text-xs">No pending verification requests</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {storeState.verificationRequests
                        .filter((r) => r.status === 'pending')
                        .map((req) => (
                          <div
                            key={req.id}
                            className="p-4 rounded-2xl bg-zinc-900 border border-white/10 space-y-3"
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h5 className="text-sm font-bold text-white">{req.creatorName}</h5>
                                  <span className="text-xs text-zinc-400">@{req.creatorUsername}</span>
                                </div>
                                <span className="text-[10px] text-cyan-400 font-semibold block mt-0.5">
                                  Category: {req.category}
                                </span>
                              </div>
                              <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-[10px] text-zinc-400">
                                {new Date(req.submittedAt).toLocaleDateString()}
                              </span>
                            </div>

                            {/* ID Credentials Box */}
                            <div className="p-2.5 rounded-xl bg-zinc-950 border border-white/5 space-y-1 text-xs">
                              <div className="flex justify-between text-zinc-400 text-[11px]">
                                <span>Doc: <strong className="text-zinc-200 capitalize">{req.officialIdType.replace('_', ' ')}</strong></span>
                                <span>Ref: <strong className="text-zinc-200 font-mono">{req.idReference}</strong></span>
                              </div>
                              {req.portfolioUrl && (
                                <p className="text-zinc-400 text-[11px] truncate">
                                  Portfolio: <a href={req.portfolioUrl} target="_blank" rel="noreferrer" className="text-cyan-400 underline">{req.portfolioUrl}</a>
                                </p>
                              )}
                              <p className="text-zinc-300 text-[11px] italic pt-1 border-t border-white/5">
                                "{req.justification}"
                              </p>
                            </div>

                            {/* Approval / Rejection Actions */}
                            <div className="flex gap-2 pt-1">
                              <button
                                onClick={() => handleApproveRequest(req)}
                                className="flex-1 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Approve & Grant Blue Badge</span>
                              </button>

                              <button
                                onClick={() => setRejectingReq(req)}
                                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-red-400 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Reject</span>
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}

              {/* ================= TAB: CREATORS & DIRECT BADGE CONTROL ================= */}
              {activeTab === 'creators' && (
                <div className="space-y-4">
                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input
                      type="text"
                      value={creatorSearch}
                      onChange={(e) => setCreatorSearch(e.target.value)}
                      placeholder="Search accounts to grant or revoke verified badges..."
                      className="w-full bg-zinc-900 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-400"
                    />
                  </div>

                  {/* Creator Directory */}
                  <div className="space-y-2">
                    {allUsers.map((user) => {
                      const isUserVerified = monetizationStore.isUserVerified(user.id);

                      return (
                        <div
                          key={user.id}
                          className="p-3 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-10 h-10 rounded-full object-cover border border-white/10"
                              crossOrigin="anonymous"
                            />
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-white">{user.name}</span>
                                {isUserVerified && <VerifiedBadge size="xs" />}
                              </div>
                              <span className="text-[10px] text-zinc-400 block">
                                @{user.username} • {user.followers?.toLocaleString()} followers
                              </span>
                            </div>
                          </div>

                          <div>
                            {isUserVerified ? (
                              <button
                                onClick={() => setActionTarget({ userId: user.id, username: user.username, grant: false })}
                                className="px-3 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 text-[11px] font-bold cursor-pointer"
                              >
                                Revoke Badge
                              </button>
                            ) : (
                              <button
                                onClick={() => setActionTarget({ userId: user.id, username: user.username, grant: true })}
                                className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30 text-[11px] font-bold cursor-pointer"
                              >
                                Grant Blue Badge
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ================= TAB: BRAND DEALS & ESCROW ================= */}
              {activeTab === 'deals' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Brand Collaboration Transactions
                    </h4>
                    <span className="text-xs text-zinc-400">
                      {storeState.deals.length} Active Deals
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {storeState.deals.map((deal) => (
                      <div
                        key={deal.id}
                        className="p-3.5 rounded-2xl bg-zinc-900 border border-white/10 space-y-2.5"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[10px] text-cyan-400 font-bold uppercase">{deal.brandName}</span>
                            <h5 className="text-xs font-bold text-white">{deal.campaignTitle}</h5>
                            <span className="text-[11px] text-zinc-400">Creator: @{deal.creatorUsername}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-black text-white block">${deal.grossAmount.toLocaleString()}</span>
                            <span className="text-[10px] text-emerald-400 font-bold">
                              80% Creator: ${deal.creatorShareAmount.toLocaleString()}
                            </span>
                            <span className="text-[9px] text-cyan-400 block">
                              20% Platform: ${deal.platformShareAmount.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {deal.deliverableLink && (
                          <div className="p-2 rounded-lg bg-zinc-950 text-[11px] text-zinc-300">
                            Deliverable: <a href={deal.deliverableLink} target="_blank" rel="noreferrer" className="text-cyan-400 underline">{deal.deliverableLink}</a>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-1 border-t border-white/5">
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold capitalize ${
                            deal.status === 'approved_and_paid'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-amber-500/20 text-amber-400'
                          }`}>
                            {deal.status.replace('_', ' ')}
                          </span>

                          {deal.status !== 'approved_and_paid' && (
                            <button
                              onClick={() => handleApproveDealPayout(deal.id)}
                              className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs cursor-pointer"
                            >
                              Approve & Disburse 80/20 Payout
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ================= TAB: AI CONTENT DISCOVERY TUNING ================= */}
              {activeTab === 'algorithm' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-zinc-900 border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        AI Content Discovery Algorithm Weights
                      </h4>
                      <span className="text-[10px] text-cyan-400 font-bold">Real-time Ranking Engine</span>
                    </div>

                    <p className="text-xs text-zinc-300">
                      Fine-tune the neural content ranking formulas that prioritize feeds, discover carousels, and viral reels.
                    </p>

                    <div className="space-y-3 pt-2">
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-zinc-300">Engagement Weight (Likes & Comments)</span>
                          <span className="font-bold text-cyan-400">{Math.round(algoWeights.engagementWeight * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0.1"
                          max="0.6"
                          step="0.05"
                          value={algoWeights.engagementWeight}
                          onChange={(e) => setAlgoWeights({ ...algoWeights, engagementWeight: parseFloat(e.target.value) })}
                          className="w-full accent-cyan-400 cursor-pointer"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-zinc-300">Watch Time & Completion Weight</span>
                          <span className="font-bold text-pink-400">{Math.round(algoWeights.watchTimeWeight * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0.1"
                          max="0.5"
                          step="0.05"
                          value={algoWeights.watchTimeWeight}
                          onChange={(e) => setAlgoWeights({ ...algoWeights, watchTimeWeight: parseFloat(e.target.value) })}
                          className="w-full accent-pink-400 cursor-pointer"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-zinc-300">Verified Blue Badge Boost Factor</span>
                          <span className="font-bold text-amber-400">+{Math.round((algoWeights.verifiedBoostFactor - 1) * 100)}% Boost</span>
                        </div>
                        <input
                          type="range"
                          min="1.0"
                          max="1.75"
                          step="0.05"
                          value={algoWeights.verifiedBoostFactor}
                          onChange={(e) => setAlgoWeights({ ...algoWeights, verifiedBoostFactor: parseFloat(e.target.value) })}
                          className="w-full accent-amber-400 cursor-pointer"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-zinc-300">Anti-Spam & Low Quality Filter Threshold</span>
                          <span className="font-bold text-red-400">{Math.round(algoWeights.antiSpamThreshold * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0.5"
                          max="0.95"
                          step="0.05"
                          value={algoWeights.antiSpamThreshold}
                          onChange={(e) => setAlgoWeights({ ...algoWeights, antiSpamThreshold: parseFloat(e.target.value) })}
                          className="w-full accent-red-400 cursor-pointer"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleSaveAlgorithm}
                      className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-black text-xs cursor-pointer transition-colors"
                    >
                      Save & Deploy AI Algorithm Weights
                    </button>
                  </div>
                </div>
              )}

              {/* ================= TAB: AUDIT LOGS ================= */}
              {activeTab === 'audit_logs' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Immutable Administrative Audit Logs
                    </h4>
                    <span className="text-xs text-zinc-400">
                      {storeState.auditLogs.length} Entries Recorded
                    </span>
                  </div>

                  <div className="space-y-2">
                    {storeState.auditLogs.map((log) => (
                      <div
                        key={log.id}
                        className="p-3 rounded-xl bg-zinc-900 border border-white/5 space-y-1"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5">
                            <span className={`px-1.5 py-0.2 rounded font-bold uppercase text-[9px] ${
                              log.action === 'grant_badge'
                                ? 'bg-cyan-500/20 text-cyan-400'
                                : log.action === 'revoke_badge'
                                ? 'bg-red-500/20 text-red-400'
                                : 'bg-zinc-800 text-zinc-300'
                            }`}>
                              {log.action.replace('_', ' ')}
                            </span>
                            <span className="font-bold text-white">@{log.targetUsername}</span>
                          </div>
                          <span className="text-[10px] text-zinc-500">
                            {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-300">
                          {log.reason}
                        </p>
                        <span className="text-[9px] text-zinc-500 font-mono block">
                          Admin ID: {log.adminId}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Grant / Revoke Reason Modal Overlay */}
            {actionTarget && (
              <div className="absolute inset-0 z-40 bg-black/90 backdrop-blur-md p-5 flex flex-col justify-center space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-white">
                    {actionTarget.grant ? 'Grant' : 'Revoke'} Blue Badge: @{actionTarget.username}
                  </h3>
                  <button
                    onClick={() => setActionTarget(null)}
                    className="p-1 rounded-full text-zinc-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300">
                  CRITICAL AUDIT POLICY: Verification changes are logged immutably with your Super-Admin ID and cannot be modified.
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-300">Mandatory Justification / Reason</label>
                  <textarea
                    rows={3}
                    required
                    value={actionReason}
                    onChange={(e) => setActionReason(e.target.value)}
                    placeholder="State justification (e.g., Identity validated via passport; or violating terms)..."
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white focus:outline-none focus:border-red-400 resize-none"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setActionTarget(null)}
                    className="flex-1 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmVerificationAction}
                    className={`flex-1 py-2.5 rounded-xl font-black text-xs cursor-pointer ${
                      actionTarget.grant ? 'bg-cyan-500 text-zinc-950 hover:bg-cyan-400' : 'bg-red-500 text-white hover:bg-red-400'
                    }`}
                  >
                    Confirm {actionTarget.grant ? 'Grant' : 'Revoke'}
                  </button>
                </div>
              </div>
            )}

            {/* Rejection Reason Modal */}
            {rejectingReq && (
              <div className="absolute inset-0 z-40 bg-black/90 backdrop-blur-md p-5 flex flex-col justify-center space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-white">
                    Reject Verification: @{rejectingReq.creatorUsername}
                  </h3>
                  <button
                    onClick={() => setRejectingReq(null)}
                    className="p-1 rounded-full text-zinc-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-300">Rejection Explanation for Creator</label>
                  <textarea
                    rows={3}
                    required
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="e.g. Identity document expired or insufficient public portfolio presence..."
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white focus:outline-none focus:border-red-400 resize-none"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setRejectingReq(null)}
                    className="flex-1 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmRejection}
                    className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-black text-xs cursor-pointer hover:bg-red-400"
                  >
                    Confirm Rejection
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
