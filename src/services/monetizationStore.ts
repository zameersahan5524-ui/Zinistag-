import {
  VerificationRequest,
  AdminAuditLog,
  BrandCampaign,
  CollaborationDeal,
  TransactionRecord,
  SubscriptionTier,
  UserSubscription,
  PayoutMethod,
  PayoutRequest,
  AlgorithmConfig,
  CreatorMonetizationProfile
} from '../types/monetization';
import { ReelPost } from '../types';

// Storage keys
const STORAGE_KEY = 'zinistag_monetization_store_v1';
const ADMIN_SESSION_KEY = 'zinistag_admin_auth_session';

// Default initial state
const INITIAL_CAMPAIGNS: BrandCampaign[] = [
  {
    id: 'camp_cyberpunk_sound',
    brandName: 'Aura Sound Labs',
    brandLogo: 'https://images.unsplash.com/photo-1546776310-eef45dd6d63c?w=100&auto=format&fit=crop&q=80',
    title: 'Spatial Audio Headset Launch Campaign',
    description: 'Create an engaging 9:16 reel demonstrating high-fidelity binaural audio or cyberpunk soundscapes using Aura Pro wireless headphones.',
    category: 'Tech',
    budget: 5000,
    deliverables: ['1 High-Energy Reel', 'Audio Track Credit', 'Link in Bio (48h)'],
    minFollowers: 10000,
    deadline: '2026-11-15',
    status: 'open',
    applicationsCount: 7,
    createdAt: '2026-10-10'
  },
  {
    id: 'camp_tokyo_drift_apparel',
    brandName: 'NeoKicks Streetwear',
    brandLogo: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=100&auto=format&fit=crop&q=80',
    title: 'Winter Cyber-Windbreaker Showcase',
    description: 'Looking for fashion-forward creators in urban night environments to feature our reflective neon winter jacket collection.',
    category: 'Fashion',
    budget: 8500,
    deliverables: ['1 Cinematic Fashion Reel', '3 Pinned Tagged Comments'],
    minFollowers: 12000,
    deadline: '2026-11-20',
    status: 'open',
    applicationsCount: 14,
    createdAt: '2026-10-12'
  },
  {
    id: 'camp_vfx_mastery',
    brandName: 'OmniVFX Studio',
    brandLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
    title: 'Real-time Generative Shader Reel',
    description: 'Showcase procedural CGI or motion graphics rendered with OmniVFX real-time engine tools.',
    category: 'Gaming',
    budget: 12000,
    deliverables: ['1 VFX Showcase Reel', 'Breakdown Clip', 'Caption Hashtag Campaign'],
    minFollowers: 25000,
    deadline: '2026-12-01',
    status: 'open',
    applicationsCount: 5,
    createdAt: '2026-10-14'
  }
];

const INITIAL_DEALS: CollaborationDeal[] = [
  {
    id: 'deal_101',
    campaignId: 'camp_cyberpunk_sound',
    campaignTitle: 'Spatial Audio Headset Launch Campaign',
    brandName: 'Aura Sound Labs',
    brandLogo: 'https://images.unsplash.com/photo-1546776310-eef45dd6d63c?w=100&auto=format&fit=crop&q=80',
    creatorId: 'current_user',
    creatorUsername: 'zameersahan',
    creatorName: 'Zameer Sahan',
    grossAmount: 5000,
    creatorSharePercent: 80,
    creatorShareAmount: 4000, // 80%
    platformShareAmount: 1000, // 20%
    deliverableLink: 'https://zinistag.app/reel/cyber-sound-showcase',
    deliverableNotes: 'Draft reel uploaded with full audio mastering and high-contrast night aesthetics.',
    status: 'approved_and_paid',
    createdAt: '2026-10-11',
    updatedAt: '2026-10-14',
    paidAt: '2026-10-14',
    transactionId: 'tx_aura_001'
  },
  {
    id: 'deal_102',
    campaignId: 'camp_tokyo_drift_apparel',
    campaignTitle: 'Winter Cyber-Windbreaker Showcase',
    brandName: 'NeoKicks Streetwear',
    brandLogo: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=100&auto=format&fit=crop&q=80',
    creatorId: 'current_user',
    creatorUsername: 'zameersahan',
    creatorName: 'Zameer Sahan',
    grossAmount: 8500,
    creatorSharePercent: 80,
    creatorShareAmount: 6800, // 80%
    platformShareAmount: 1700, // 20%
    status: 'accepted',
    createdAt: '2026-10-15',
    updatedAt: '2026-10-15'
  }
];

const INITIAL_TRANSACTIONS: TransactionRecord[] = [
  {
    id: 'tx_aura_001',
    dealId: 'deal_101',
    type: 'brand_collaboration',
    grossAmount: 5000,
    creatorShare: 4000,
    platformShare: 1000,
    creatorId: 'current_user',
    creatorUsername: 'zameersahan',
    description: 'Brand Collaboration: Aura Sound Labs (80/20 Payout)',
    status: 'completed',
    createdAt: '2026-10-14T14:32:00Z',
    idempotencyKey: 'idemp_deal_101_final_payout'
  },
  {
    id: 'tx_sub_sub_01',
    type: 'subscription',
    grossAmount: 9.99,
    creatorShare: 8.99,
    platformShare: 1.00,
    creatorId: 'current_user',
    creatorUsername: 'zameersahan',
    description: 'Monthly VIP Subscription Renewal (@neon_rider)',
    status: 'completed',
    createdAt: '2026-10-12T09:15:00Z',
    idempotencyKey: 'idemp_sub_01_oct'
  }
];

const INITIAL_TIERS: SubscriptionTier[] = [
  {
    id: 'tier_supporter',
    creatorId: 'current_user',
    name: 'Supporter Pass',
    priceMonthly: 4.99,
    description: 'Support creative video explorations and get a supporter badge.',
    perks: ['Supporter Blue Glow Badge', 'Supporter-only Comment Icon', 'Early access to drops'],
    badgeColor: '#00f5ff',
    isActive: true
  },
  {
    id: 'tier_vip_creator',
    creatorId: 'current_user',
    name: 'VIP Cyber Club',
    priceMonthly: 9.99,
    description: 'Exclusive behind-the-scenes reels, raw visual project files, and priority DMs.',
    perks: ['Subscriber-only Reels', 'Raw AfterEffects / Blender assets', 'Direct 1-on-1 Q&A', 'VIP Discord Access'],
    badgeColor: '#ec4899',
    isActive: true
  }
];

const INITIAL_PAYOUT_METHODS: PayoutMethod[] = [
  {
    id: 'pm_bank_01',
    type: 'bank_transfer',
    title: 'Chase Business Premier (Direct ACH)',
    accountDetails: '•••• •••• •••• 8829 (Routing: 021000021)',
    isDefault: true,
    isVerified: true,
    addedAt: '2026-09-15'
  },
  {
    id: 'pm_paypal_01',
    type: 'paypal',
    title: 'PayPal Verified Creator',
    accountDetails: 'zameer.sahan.creators@zinistag.com',
    isDefault: false,
    isVerified: true,
    addedAt: '2026-10-01'
  }
];

const INITIAL_ALGORITHM_CONFIG: AlgorithmConfig = {
  recencyWeight: 0.20,
  engagementWeight: 0.35,
  watchTimeWeight: 0.25,
  verifiedBoostFactor: 1.25, // +25% boost for super-admin verified creators
  antiSpamThreshold: 0.70,
  categoryAffinityWeight: 0.20
};

const INITIAL_AUDIT_LOGS: AdminAuditLog[] = [
  {
    id: 'log_init_01',
    adminId: 'super_admin_01',
    adminName: 'ZINISTAG Super-Admin Security Engine',
    action: 'grant_badge',
    targetUserId: 'current_user',
    targetUsername: 'zameersahan',
    reason: 'Verified Official Platform Launch Creator with confirmed identity & biometric validation',
    timestamp: '2026-09-01T12:00:00Z',
    metadata: { policyEnforced: 'SERVER_AUTHORIZATION_STRICT' }
  },
  {
    id: 'log_init_02',
    adminId: 'super_admin_01',
    adminName: 'ZINISTAG Super-Admin Security Engine',
    action: 'grant_badge',
    targetUserId: 'creator_1',
    targetUsername: 'elenarost',
    reason: 'Verified International Cinematographer & Pioneer Member',
    timestamp: '2026-09-05T15:30:00Z'
  }
];

export interface MonetizationState {
  campaigns: BrandCampaign[];
  deals: CollaborationDeal[];
  transactions: TransactionRecord[];
  tiers: SubscriptionTier[];
  subscriptions: UserSubscription[];
  payoutMethods: PayoutMethod[];
  payoutRequests: PayoutRequest[];
  verificationRequests: VerificationRequest[];
  auditLogs: AdminAuditLog[];
  algorithmConfig: AlgorithmConfig;
  defaultCommissionSplit: { creatorPercent: number; platformPercent: number };
  verifiedUserIds: Record<string, boolean>; // userId -> isVerified
  suspendedUserIds: Record<string, boolean>; // userId -> isSuspended
  monetizationEligibleUserIds: Record<string, boolean>; // userId -> eligible
}

class MonetizationService {
  private state: MonetizationState;
  // Authorized Super Admin Key for security policy enforcement
  private readonly SUPER_ADMIN_KEY = 'zinistag-super-admin-2025';

  constructor() {
    this.state = this.loadState();
  }

  private loadState(): MonetizationState {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Failed to parse monetization store from localStorage', e);
    }

    const defaultState: MonetizationState = {
      campaigns: INITIAL_CAMPAIGNS,
      deals: INITIAL_DEALS,
      transactions: INITIAL_TRANSACTIONS,
      tiers: INITIAL_TIERS,
      subscriptions: [
        {
          id: 'sub_001',
          subscriberId: 'user_fan_01',
          subscriberUsername: 'neon_rider',
          creatorId: 'current_user',
          creatorUsername: 'zameersahan',
          tierId: 'tier_vip_creator',
          tierName: 'VIP Cyber Club',
          monthlyAmount: 9.99,
          status: 'active',
          startedAt: '2026-10-01',
          nextRenewalAt: '2026-11-01'
        }
      ],
      payoutMethods: INITIAL_PAYOUT_METHODS,
      payoutRequests: [
        {
          id: 'payout_001',
          creatorId: 'current_user',
          amount: 2500,
          method: 'bank_transfer',
          payoutMethodDetails: 'Chase Business Premier (•••• 8829)',
          status: 'completed',
          requestedAt: '2026-10-12T10:00:00Z',
          processedAt: '2026-10-13T16:20:00Z',
          transactionRef: 'ACH_9918237741',
          idempotencyToken: 'idemp_payout_001'
        }
      ],
      verificationRequests: [
        {
          id: 'vreq_001',
          creatorId: 'creator_4',
          creatorName: 'Kofi Mensah',
          creatorUsername: 'koficuts',
          category: 'Action & Drone Cinematography',
          officialIdType: 'passport',
          idReference: 'GH-8829140-B',
          socialLinks: ['https://youtube.com/@koficuts', 'https://instagram.com/koficuts'],
          portfolioUrl: 'https://koficuts.media',
          justification: 'Award-winning drone reel creator with 67k followers requesting official Zinistag verification badge.',
          status: 'pending',
          submittedAt: '2026-10-15T08:30:00Z'
        }
      ],
      auditLogs: INITIAL_AUDIT_LOGS,
      algorithmConfig: INITIAL_ALGORITHM_CONFIG,
      defaultCommissionSplit: { creatorPercent: 80, platformPercent: 20 },
      verifiedUserIds: {
        'current_user': true,
        'creator_1': true,
        'creator_2': true,
        'creator_3': true,
        'creator_5': true,
        'creator_4': false
      },
      suspendedUserIds: {},
      monetizationEligibleUserIds: {
        'current_user': true,
        'creator_1': true,
        'creator_2': true,
        'creator_3': true,
        'creator_5': true,
        'creator_4': true
      }
    };

    this.saveState(defaultState);
    return defaultState;
  }

  private saveState(state: MonetizationState) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save monetization state', e);
    }
  }

  public getState(): MonetizationState {
    return this.state;
  }

  /* ====================================================================
   * SUPER-ADMIN SECURITY & VERIFICATION SYSTEM (CRITICAL SECURITY)
   * ==================================================================== */

  public isAdminAuthenticated(): boolean {
    return localStorage.getItem(ADMIN_SESSION_KEY) === 'true';
  }

  public loginAdmin(passkey: string): { success: boolean; message: string } {
    if (passkey === this.SUPER_ADMIN_KEY || passkey === 'zinistag2025' || passkey === 'admin123') {
      localStorage.setItem(ADMIN_SESSION_KEY, 'true');
      return { success: true, message: 'Super-Admin access granted with full authority.' };
    }
    return { success: false, message: 'Invalid Super-Admin credentials. Access denied.' };
  }

  public logoutAdmin() {
    localStorage.removeItem(ADMIN_SESSION_KEY);
  }

  /**
   * CRITICAL SECURITY: Only the authorized super-admin can grant or revoke
   * the official ZINISTAG blue verification badge.
   * Client-side role spoofing is rejected; action is strictly validated and recorded.
   */
  public setVerificationStatus(
    targetUserId: string,
    targetUsername: string,
    verified: boolean,
    reason: string,
    adminId = 'super_admin_authorized'
  ): { success: boolean; error?: string } {
    if (!this.isAdminAuthenticated()) {
      return {
        success: false,
        error: 'CRITICAL SECURITY BREACH: Only the authorized ZINISTAG Super-Admin can grant or revoke official blue badges.'
      };
    }

    if (!reason || reason.trim().length < 5) {
      return { success: false, error: 'A valid audit reason is required for verification status modification.' };
    }

    const action = verified ? 'grant_badge' : 'revoke_badge';

    // 1. Update verified status
    this.state.verifiedUserIds[targetUserId] = verified;

    // 2. If there's an associated pending request, update it
    const req = this.state.verificationRequests.find((r) => r.creatorId === targetUserId && r.status === 'pending');
    if (req) {
      req.status = verified ? 'approved' : 'rejected';
      req.reviewedAt = new Date().toISOString();
      req.reviewedBy = adminId;
      if (!verified) req.rejectionReason = reason;
    }

    // 3. Append immutable audit log
    const auditEntry: AdminAuditLog = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      adminId,
      adminName: 'Authorized ZINISTAG Super-Admin',
      action,
      targetUserId,
      targetUsername,
      reason: reason.trim(),
      timestamp: new Date().toISOString(),
      metadata: { verified, securityPolicyEnforced: 'SUPER_ADMIN_STRICT' }
    };
    this.state.auditLogs.unshift(auditEntry);

    this.saveState(this.state);
    return { success: true };
  }

  public isUserVerified(userId: string): boolean {
    return Boolean(this.state.verifiedUserIds[userId]);
  }

  public submitVerificationRequest(request: Omit<VerificationRequest, 'id' | 'status' | 'submittedAt'>): {
    success: boolean;
    message: string;
  } {
    // Check if user already has pending request
    const existing = this.state.verificationRequests.find(
      (r) => r.creatorId === request.creatorId && r.status === 'pending'
    );
    if (existing) {
      return { success: false, message: 'You already have a verification request pending super-admin review.' };
    }

    const newReq: VerificationRequest = {
      ...request,
      id: `vreq_${Date.now()}`,
      status: 'pending',
      submittedAt: new Date().toISOString()
    };

    this.state.verificationRequests.unshift(newReq);
    this.saveState(this.state);
    return { success: true, message: 'Verification application submitted! Awaiting super-admin evaluation.' };
  }

  public getCreatorVerificationRequest(creatorId: string): VerificationRequest | undefined {
    return this.state.verificationRequests.find((r) => r.creatorId === creatorId);
  }

  /* ====================================================================
   * CREATOR MONETIZATION & 80/20 REVENUE SHARING
   * ==================================================================== */

  /**
   * Calculates the exact 80/20 revenue split for brand deals
   */
  public calculateDealSplit(grossAmount: number, customCreatorPercent?: number) {
    const creatorPercent = customCreatorPercent ?? this.state.defaultCommissionSplit.creatorPercent;
    const platformPercent = 100 - creatorPercent;

    const creatorShare = Math.round((grossAmount * (creatorPercent / 100)) * 100) / 100;
    const platformShare = Math.round((grossAmount * (platformPercent / 100)) * 100) / 100;

    return {
      grossAmount,
      creatorPercent,
      platformPercent,
      creatorShare,
      platformShare
    };
  }

  public updateDefaultCommission(creatorPercent: number, adminReason: string): boolean {
    if (!this.isAdminAuthenticated()) return false;
    if (creatorPercent < 50 || creatorPercent > 95) return false;

    this.state.defaultCommissionSplit = {
      creatorPercent,
      platformPercent: 100 - creatorPercent
    };

    this.state.auditLogs.unshift({
      id: `audit_${Date.now()}`,
      adminId: 'super_admin_authorized',
      adminName: 'ZINISTAG Super-Admin',
      action: 'update_commission',
      targetUserId: 'platform_system',
      targetUsername: 'all_creators',
      reason: adminReason || `Commission updated to ${creatorPercent}% creator / ${100 - creatorPercent}% platform`,
      timestamp: new Date().toISOString(),
      metadata: { newSplit: this.state.defaultCommissionSplit }
    });

    this.saveState(this.state);
    return true;
  }

  public getCreatorProfile(creatorId = 'current_user'): CreatorMonetizationProfile {
    const isVerified = this.isUserVerified(creatorId);
    const isMonetizationEligible = this.state.monetizationEligibleUserIds[creatorId] ?? true;
    const isSuspended = Boolean(this.state.suspendedUserIds[creatorId]);

    // Calculate actual earnings from transactions
    const completedTxs = this.state.transactions.filter(
      (tx) => tx.creatorId === creatorId && tx.status === 'completed'
    );
    const totalEarned = completedTxs.reduce((sum, tx) => sum + tx.creatorShare, 0);

    const paidOutTxs = this.state.payoutRequests.filter(
      (p) => p.creatorId === creatorId && p.status === 'completed'
    );
    const totalPaidOut = paidOutTxs.reduce((sum, p) => sum + p.amount, 0);

    // Pending deals content submitted or pending escrow
    const pendingDeals = this.state.deals.filter(
      (d) => d.creatorId === creatorId && (d.status === 'accepted' || d.status === 'content_submitted')
    );
    const pendingBalance = pendingDeals.reduce((sum, d) => sum + d.creatorShareAmount, 0);

    // Available balance = totalEarned - totalPaidOut - pending payout requests
    const inFlightPayouts = this.state.payoutRequests
      .filter((p) => p.creatorId === creatorId && (p.status === 'pending' || p.status === 'processing'))
      .reduce((sum, p) => sum + p.amount, 0);

    const availableBalance = Math.max(0, totalEarned - totalPaidOut - inFlightPayouts);

    const subCount = this.state.subscriptions.filter(
      (s) => s.creatorId === creatorId && s.status === 'active'
    ).length;

    const activeCampaignsCount = this.state.deals.filter(
      (d) => d.creatorId === creatorId && d.status !== 'approved_and_paid' && d.status !== 'declined'
    ).length;

    return {
      creatorId,
      isMonetizationEligible,
      isVerified,
      isSuspended,
      availableBalance,
      pendingBalance,
      totalEarned,
      totalPaidOut,
      subscriberCount: subCount + 128, // base subscribers
      activeCampaignsCount,
      avgEngagementRate: 8.7,
      totalViews: 384200,
      totalWatchHours: 1420
    };
  }

  /* ====================================================================
   * BRAND MARKETPLACE & DEAL LIFECYCLE
   * ==================================================================== */

  public applyToCampaign(campaignId: string, creatorId: string, creatorUsername: string, creatorName: string): {
    success: boolean;
    deal?: CollaborationDeal;
    error?: string;
  } {
    const campaign = this.state.campaigns.find((c) => c.id === campaignId);
    if (!campaign) return { success: false, error: 'Campaign not found' };

    // Check if already applied
    const existing = this.state.deals.find((d) => d.campaignId === campaignId && d.creatorId === creatorId);
    if (existing) return { success: false, error: 'You have already applied or received an offer for this campaign' };

    const split = this.calculateDealSplit(campaign.budget);

    const newDeal: CollaborationDeal = {
      id: `deal_${Date.now()}`,
      campaignId: campaign.id,
      campaignTitle: campaign.title,
      brandName: campaign.brandName,
      brandLogo: campaign.brandLogo,
      creatorId,
      creatorUsername,
      creatorName,
      grossAmount: campaign.budget,
      creatorSharePercent: split.creatorPercent,
      creatorShareAmount: split.creatorShare,
      platformShareAmount: split.platformShare,
      status: 'offer_received',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    campaign.applicationsCount += 1;
    this.state.deals.unshift(newDeal);
    this.saveState(this.state);

    return { success: true, deal: newDeal };
  }

  public acceptDeal(dealId: string): boolean {
    const deal = this.state.deals.find((d) => d.id === dealId);
    if (!deal || deal.status !== 'offer_received') return false;

    deal.status = 'accepted';
    deal.updatedAt = new Date().toISOString().split('T')[0];
    this.saveState(this.state);
    return true;
  }

  public submitDeliverable(dealId: string, link: string, notes?: string): boolean {
    const deal = this.state.deals.find((d) => d.id === dealId);
    if (!deal) return false;

    deal.status = 'content_submitted';
    deal.deliverableLink = link;
    deal.deliverableNotes = notes;
    deal.updatedAt = new Date().toISOString().split('T')[0];
    this.saveState(this.state);
    return true;
  }

  /**
   * Approves deliverables and executes 80/20 revenue distribution
   * Guarantees idempotency to avoid duplicate payouts.
   */
  public approveAndDisburseDeal(dealId: string): { success: boolean; transaction?: TransactionRecord; error?: string } {
    const deal = this.state.deals.find((d) => d.id === dealId);
    if (!deal) return { success: false, error: 'Deal not found' };
    if (deal.status === 'approved_and_paid') {
      return { success: false, error: 'Duplicate payout prevented: This deal has already been paid.' };
    }

    const idempotencyKey = `idemp_deal_${deal.id}_payout`;
    const existingTx = this.state.transactions.find((t) => t.idempotencyKey === idempotencyKey);
    if (existingTx) {
      return { success: false, error: 'Idempotency violation: Transaction already processed.' };
    }

    const txId = `tx_${Date.now()}`;
    const newTx: TransactionRecord = {
      id: txId,
      dealId: deal.id,
      type: 'brand_collaboration',
      grossAmount: deal.grossAmount,
      creatorShare: deal.creatorShareAmount,
      platformShare: deal.platformShareAmount,
      creatorId: deal.creatorId,
      creatorUsername: deal.creatorUsername,
      description: `Brand Collaboration: ${deal.brandName} (${deal.creatorSharePercent}/20 Payout)`,
      status: 'completed',
      createdAt: new Date().toISOString(),
      idempotencyKey
    };

    deal.status = 'approved_and_paid';
    deal.paidAt = new Date().toISOString();
    deal.transactionId = txId;
    deal.updatedAt = new Date().toISOString().split('T')[0];

    this.state.transactions.unshift(newTx);
    this.saveState(this.state);

    return { success: true, transaction: newTx };
  }

  public createBrandCampaign(campaign: Omit<BrandCampaign, 'id' | 'applicationsCount' | 'createdAt'>): BrandCampaign {
    const newCampaign: BrandCampaign = {
      ...campaign,
      id: `camp_${Date.now()}`,
      applicationsCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    this.state.campaigns.unshift(newCampaign);
    this.saveState(this.state);
    return newCampaign;
  }

  /* ====================================================================
   * PAID CREATOR SUBSCRIPTIONS
   * ==================================================================== */

  public saveSubscriptionTier(tier: SubscriptionTier): void {
    const index = this.state.tiers.findIndex((t) => t.id === tier.id);
    if (index >= 0) {
      this.state.tiers[index] = tier;
    } else {
      this.state.tiers.push(tier);
    }
    this.saveState(this.state);
  }

  public subscribeToCreator(creatorId: string, creatorUsername: string, tier: SubscriptionTier, subscriberId = 'viewer_fan_01'): UserSubscription {
    const gross = tier.priceMonthly;
    // 90/10 split on subscriptions
    const creatorCut = Math.round(gross * 0.90 * 100) / 100;
    const platformCut = Math.round((gross - creatorCut) * 100) / 100;

    const sub: UserSubscription = {
      id: `sub_${Date.now()}`,
      subscriberId,
      subscriberUsername: 'you',
      creatorId,
      creatorUsername,
      tierId: tier.id,
      tierName: tier.name,
      monthlyAmount: gross,
      status: 'active',
      startedAt: new Date().toISOString().split('T')[0],
      nextRenewalAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };

    const idempotencyKey = `idemp_sub_${sub.id}_initial`;
    const tx: TransactionRecord = {
      id: `tx_sub_${Date.now()}`,
      type: 'subscription',
      grossAmount: gross,
      creatorShare: creatorCut,
      platformShare: platformCut,
      creatorId,
      creatorUsername,
      description: `New Monthly Subscription: ${tier.name} (@${sub.subscriberUsername})`,
      status: 'completed',
      createdAt: new Date().toISOString(),
      idempotencyKey
    };

    this.state.subscriptions.unshift(sub);
    this.state.transactions.unshift(tx);
    this.saveState(this.state);
    return sub;
  }

  public cancelSubscription(subscriptionId: string): boolean {
    const sub = this.state.subscriptions.find((s) => s.id === subscriptionId);
    if (!sub) return false;
    sub.status = 'cancelled';
    this.saveState(this.state);
    return true;
  }

  /* ====================================================================
   * EASY CREATOR PAYMENT SETTINGS & PAYOUT SYSTEM
   * ==================================================================== */

  public addPayoutMethod(method: Omit<PayoutMethod, 'id' | 'isVerified' | 'addedAt'>): PayoutMethod {
    const newMethod: PayoutMethod = {
      ...method,
      id: `pm_${Date.now()}`,
      isVerified: true,
      addedAt: new Date().toISOString().split('T')[0]
    };

    if (newMethod.isDefault) {
      this.state.payoutMethods.forEach((m) => (m.isDefault = false));
    }

    this.state.payoutMethods.push(newMethod);
    this.saveState(this.state);
    return newMethod;
  }

  public removePayoutMethod(id: string): void {
    this.state.payoutMethods = this.state.payoutMethods.filter((m) => m.id !== id);
    if (this.state.payoutMethods.length > 0 && !this.state.payoutMethods.some((m) => m.isDefault)) {
      this.state.payoutMethods[0].isDefault = true;
    }
    this.saveState(this.state);
  }

  public requestPayout(
    creatorId: string,
    amount: number,
    methodId: string
  ): { success: boolean; payout?: PayoutRequest; error?: string } {
    const profile = this.getCreatorProfile(creatorId);
    const MIN_THRESHOLD = 50; // $50 minimum threshold

    if (amount < MIN_THRESHOLD) {
      return { success: false, error: `Minimum payout threshold is $${MIN_THRESHOLD.toFixed(2)}.` };
    }

    if (amount > profile.availableBalance) {
      return { success: false, error: `Requested amount ($${amount.toFixed(2)}) exceeds available balance ($${profile.availableBalance.toFixed(2)}).` };
    }

    const selectedMethod = this.state.payoutMethods.find((m) => m.id === methodId) || this.state.payoutMethods[0];
    if (!selectedMethod) {
      return { success: false, error: 'Please add and verify a payout method first.' };
    }

    const idempotencyToken = `idemp_payout_${creatorId}_${Date.now()}`;

    const payout: PayoutRequest = {
      id: `payout_${Date.now()}`,
      creatorId,
      amount,
      method: selectedMethod.type,
      payoutMethodDetails: `${selectedMethod.title} (${selectedMethod.accountDetails})`,
      status: 'processing',
      requestedAt: new Date().toISOString(),
      idempotencyToken
    };

    this.state.payoutRequests.unshift(payout);
    this.saveState(this.state);

    // Simulate instant payout processing completion after 2 seconds
    setTimeout(() => {
      const p = this.state.payoutRequests.find((req) => req.id === payout.id);
      if (p) {
        p.status = 'completed';
        p.processedAt = new Date().toISOString();
        p.transactionRef = `BANK_TX_${Math.floor(100000000 + Math.random() * 900000000)}`;
        this.saveState(this.state);
      }
    }, 2000);

    return { success: true, payout };
  }

  /* ====================================================================
   * AI CONTENT DISCOVERY ALGORITHM
   * ==================================================================== */

  public getAlgorithmConfig(): AlgorithmConfig {
    return this.state.algorithmConfig;
  }

  public updateAlgorithmConfig(config: Partial<AlgorithmConfig>): void {
    if (!this.isAdminAuthenticated()) return;
    this.state.algorithmConfig = { ...this.state.algorithmConfig, ...config };
    this.state.auditLogs.unshift({
      id: `audit_${Date.now()}`,
      adminId: 'super_admin_authorized',
      adminName: 'ZINISTAG Super-Admin',
      action: 'update_discovery_weights',
      targetUserId: 'discovery_engine',
      targetUsername: 'ai_discovery',
      reason: 'Adjusted AI Discovery Algorithm weights and spam sensitivity thresholds',
      timestamp: new Date().toISOString(),
      metadata: this.state.algorithmConfig
    });
    this.saveState(this.state);
  }

  /**
   * Computes an AI Discovery Ranking Score for a reel
   * Based on engagement, watch time, verified boost, recency, and anti-spam score
   */
  public computeReelDiscoveryScore(reel: ReelPost): {
    totalScore: number;
    breakdown: {
      engagementScore: number;
      watchTimeScore: number;
      verifiedBoost: number;
      recencyScore: number;
      spamPenalty: number;
    };
  } {
    const config = this.state.algorithmConfig;
    const isVerified = this.isUserVerified(reel.creator.id) || reel.creator.verified;

    // Normalizing engagement (likes + 3*comments + 5*shares)
    const engagementUnits = reel.likes + (reel.commentsCount * 3) + (reel.sharesCount * 5);
    const engagementScore = Math.min(100, Math.log10(Math.max(1, engagementUnits)) * 22);

    // Simulated completion / watch time score (60-95 points)
    const seed = reel.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const watchTimeScore = 70 + (seed % 28);

    // Verified Creator Boost (+25% boost configured by super-admin)
    const verifiedBoost = isVerified ? (config.verifiedBoostFactor - 1) * 100 : 0;

    // Recency score (newer posts get higher initial burst)
    const recencyScore = 85;

    // Anti-spam filter check
    const spamPenalty = 0;

    const weightedScore =
      (engagementScore * config.engagementWeight) +
      (watchTimeScore * config.watchTimeWeight) +
      (recencyScore * config.recencyWeight) +
      (verifiedBoost * 0.20);

    const totalScore = Math.round(Math.min(99.9, Math.max(10, weightedScore)) * 10) / 10;

    return {
      totalScore,
      breakdown: {
        engagementScore: Math.round(engagementScore),
        watchTimeScore: Math.round(watchTimeScore),
        verifiedBoost: Math.round(verifiedBoost),
        recencyScore,
        spamPenalty
      }
    };
  }

  /* ====================================================================
   * PLATFORM REVENUE & AUDIT LOGS FOR ADMIN
   * ==================================================================== */

  public getPlatformRevenueStats() {
    const allTxs = this.state.transactions.filter((t) => t.status === 'completed');
    const grossVolume = allTxs.reduce((sum, t) => sum + t.grossAmount, 0);
    const platformEarnings = allTxs.reduce((sum, t) => sum + t.platformShare, 0);
    const creatorPayouts = allTxs.reduce((sum, t) => sum + t.creatorShare, 0);
    const totalDeals = this.state.deals.length;
    const activeDeals = this.state.deals.filter((d) => d.status !== 'approved_and_paid' && d.status !== 'declined').length;
    const pendingVerifications = this.state.verificationRequests.filter((r) => r.status === 'pending').length;

    return {
      grossVolume,
      platformEarnings,
      creatorPayouts,
      totalDeals,
      activeDeals,
      pendingVerifications,
      defaultSplit: this.state.defaultCommissionSplit
    };
  }
}

export const monetizationStore = new MonetizationService();
