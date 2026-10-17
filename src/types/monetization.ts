export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected' | 'revoked';

export interface VerificationRequest {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorUsername: string;
  category: string;
  officialIdType: 'passport' | 'drivers_license' | 'national_id' | 'business_doc';
  idReference: string;
  socialLinks: string[];
  portfolioUrl?: string;
  justification: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
}

export interface AdminAuditLog {
  id: string;
  adminId: string;
  adminName: string;
  action: 'grant_badge' | 'revoke_badge' | 'approve_verification' | 'reject_verification' | 'toggle_monetization' | 'suspend_account' | 'restore_account' | 'update_commission' | 'update_discovery_weights' | 'disburse_payout';
  targetUserId: string;
  targetUsername: string;
  reason: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface BrandCampaign {
  id: string;
  brandName: string;
  brandLogo: string;
  title: string;
  description: string;
  category: 'Tech' | 'Fashion' | 'Gaming' | 'Fitness' | 'Music' | 'Lifestyle';
  budget: number; // in USD or currency units
  deliverables: string[];
  minFollowers: number;
  deadline: string;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  applicationsCount: number;
  createdAt: string;
}

export type DealStatus = 'offer_received' | 'accepted' | 'content_submitted' | 'approved_and_paid' | 'declined' | 'disputed';

export interface CollaborationDeal {
  id: string;
  campaignId: string;
  campaignTitle: string;
  brandName: string;
  brandLogo: string;
  creatorId: string;
  creatorUsername: string;
  creatorName: string;
  grossAmount: number;
  creatorSharePercent: number; // default 80%
  creatorShareAmount: number;  // 80%
  platformShareAmount: number; // 20%
  deliverableLink?: string;
  deliverableNotes?: string;
  status: DealStatus;
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
  transactionId?: string;
}

export interface TransactionRecord {
  id: string;
  dealId?: string;
  type: 'brand_collaboration' | 'subscription' | 'payout';
  grossAmount: number;
  creatorShare: number;
  platformShare: number;
  creatorId: string;
  creatorUsername: string;
  description: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  createdAt: string;
  idempotencyKey: string;
}

export interface SubscriptionTier {
  id: string;
  creatorId: string;
  name: string;
  priceMonthly: number;
  description: string;
  perks: string[];
  badgeColor: string;
  isActive: boolean;
}

export interface UserSubscription {
  id: string;
  subscriberId: string;
  subscriberUsername: string;
  creatorId: string;
  creatorUsername: string;
  tierId: string;
  tierName: string;
  monthlyAmount: number;
  status: 'active' | 'cancelled' | 'expired';
  startedAt: string;
  nextRenewalAt: string;
}

export type PayoutMethodType = 'bank_transfer' | 'paypal' | 'stripe' | 'upi' | 'crypto_usdc';

export interface PayoutMethod {
  id: string;
  type: PayoutMethodType;
  title: string;
  accountDetails: string; // Masked for display
  isDefault: boolean;
  isVerified: boolean;
  addedAt: string;
}

export interface PayoutRequest {
  id: string;
  creatorId: string;
  amount: number;
  method: PayoutMethodType;
  payoutMethodDetails: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  requestedAt: string;
  processedAt?: string;
  transactionRef?: string;
  idempotencyToken: string;
}

export interface AlgorithmConfig {
  recencyWeight: number;       // default 0.20
  engagementWeight: number;    // default 0.35 (likes + comments)
  watchTimeWeight: number;     // default 0.25
  verifiedBoostFactor: number; // default 1.25 (+25% boost for verified creators)
  antiSpamThreshold: number;   // default 0.70 (flags/filters spam)
  categoryAffinityWeight: number; // default 0.20
}

export interface CreatorMonetizationProfile {
  creatorId: string;
  isMonetizationEligible: boolean;
  isVerified: boolean;
  isSuspended: boolean;
  availableBalance: number;
  pendingBalance: number;
  totalEarned: number;
  totalPaidOut: number;
  subscriberCount: number;
  activeCampaignsCount: number;
  avgEngagementRate: number; // e.g., 8.4%
  totalViews: number;
  totalWatchHours: number;
}
