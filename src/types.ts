// CharityRewards TypeScript Interfaces

export interface CharityEvent {
  eventAddress: string; // A unique mock address, e.g., "0xEVENT1"
  charityName: string;
  eventName: string;
  description: string;
  imageUrl: string; // URL to a high-quality image
  goalAmount: number;
  totalDonated: number;
  endTimestamp: number; // Unix timestamp
  milestones: Milestone[];
}

export interface Milestone {
  goalAmount: number;
  bonusReward: number;
  isClaimed: boolean;
}

export interface DonorProfile {
  address: string;
  aptosName: string | null;
  totalDonatedAPT: number;
  donationCount: number;
  heartTokens: number;
  stakedHeartTokens: number;
  nftBadges: NFTCertificate[];
}

export interface NFTCertificate {
  tokenId: string;
  name: string;
  description: string;
  imageUrl: string;
  dateEarned: string; // ISO date string
}

export interface GovernanceProposal {
  proposalId: number;
  title: string;
  description: string;
  proposer: string;
  status: 'active' | 'passed' | 'failed';
  votesFor: number;
  votesAgainst: number;
  endTimestamp: number;
}

export interface Donation {
  id: string;
  donorName: string;
  amount: number;
  eventAddress: string;
  timestamp: number;
}

// UI State Types
export interface WalletState {
  isConnected: boolean;
  isConnecting: boolean;
  currentUser: DonorProfile | null;
}

export interface DonationModalState {
  isOpen: boolean;
  eventAddress: string | null;
  step: 'amount' | 'confirmation' | 'processing' | 'success';
  amount: number;
  estimatedReward: number;
}