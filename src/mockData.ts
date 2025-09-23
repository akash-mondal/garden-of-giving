// CharityRewards Mock Data - Realistic and compelling stories

import { CharityEvent, DonorProfile, NFTCertificate, GovernanceProposal, Donation } from './types';

export const mockCharityEvents: CharityEvent[] = [
  {
    eventAddress: "0xEVENT001",
    charityName: "Ocean Revival Foundation",
    eventName: "Coral Reef Restoration Project",
    description: "Help us replant and restore 1,000 square meters of coral reef ecosystem in the Great Barrier Reef. Each donation plants coral fragments and supports marine life recovery in areas damaged by bleaching events.",
    imageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
    goalAmount: 50000,
    totalDonated: 32750,
    endTimestamp: Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 days from now
    milestones: [
      { goalAmount: 10000, bonusReward: 100, isClaimed: true },
      { goalAmount: 25000, bonusReward: 250, isClaimed: true },
      { goalAmount: 40000, bonusReward: 400, isClaimed: false },
      { goalAmount: 50000, bonusReward: 500, isClaimed: false },
    ]
  },
  {
    eventAddress: "0xEVENT002",
    charityName: "Forest Guardians Alliance",
    eventName: "Amazon Rainforest Protection Initiative",
    description: "Protect 500 acres of Amazon rainforest from deforestation. Your donation directly funds indigenous communities who serve as forest guardians and supports reforestation efforts in cleared areas.",
    imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
    goalAmount: 75000,
    totalDonated: 18650,
    endTimestamp: Date.now() + (45 * 24 * 60 * 60 * 1000), // 45 days from now
    milestones: [
      { goalAmount: 15000, bonusReward: 150, isClaimed: true },
      { goalAmount: 30000, bonusReward: 300, isClaimed: false },
      { goalAmount: 50000, bonusReward: 500, isClaimed: false },
      { goalAmount: 75000, bonusReward: 750, isClaimed: false },
    ]
  },
  {
    eventAddress: "0xEVENT003",
    charityName: "Clean Water Tomorrow",
    eventName: "Solar Water Wells for Rural Communities",
    description: "Build 10 solar-powered water wells in drought-affected communities across East Africa. Each well provides clean drinking water for 200+ families and includes water purification systems.",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800",
    goalAmount: 35000,
    totalDonated: 28900,
    endTimestamp: Date.now() + (20 * 24 * 60 * 60 * 1000), // 20 days from now
    milestones: [
      { goalAmount: 7000, bonusReward: 70, isClaimed: true },
      { goalAmount: 14000, bonusReward: 140, isClaimed: true },
      { goalAmount: 25000, bonusReward: 250, isClaimed: true },
      { goalAmount: 35000, bonusReward: 350, isClaimed: false },
    ]
  },
  {
    eventAddress: "0xEVENT004",
    charityName: "Urban Wildlife Rescue",
    eventName: "City Wildlife Rehabilitation Center",
    description: "Build a state-of-the-art wildlife rehabilitation center in downtown Chicago. The facility will rescue, treat, and release injured urban wildlife while educating the community about coexistence.",
    imageUrl: "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=800",
    goalAmount: 120000,
    totalDonated: 45600,
    endTimestamp: Date.now() + (60 * 24 * 60 * 60 * 1000), // 60 days from now
    milestones: [
      { goalAmount: 25000, bonusReward: 250, isClaimed: true },
      { goalAmount: 50000, bonusReward: 500, isClaimed: false },
      { goalAmount: 80000, bonusReward: 800, isClaimed: false },
      { goalAmount: 120000, bonusReward: 1200, isClaimed: false },
    ]
  },
  {
    eventAddress: "0xEVENT005",
    charityName: "Future Farmers Initiative",
    eventName: "Sustainable Farming Education Program",
    description: "Train 500 young farmers in sustainable agriculture techniques including permaculture, water conservation, and organic farming methods. Includes providing starter seeds and tools.",
    imageUrl: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800",
    goalAmount: 42000,
    totalDonated: 12100,
    endTimestamp: Date.now() + (55 * 24 * 60 * 60 * 1000), // 55 days from now
    milestones: [
      { goalAmount: 10000, bonusReward: 100, isClaimed: true },
      { goalAmount: 20000, bonusReward: 200, isClaimed: false },
      { goalAmount: 30000, bonusReward: 300, isClaimed: false },
      { goalAmount: 42000, bonusReward: 420, isClaimed: false },
    ]
  },
  {
    eventAddress: "0xEVENT006",
    charityName: "Solar Schools Project",
    eventName: "Renewable Energy for Rural Schools",
    description: "Install solar panels and battery systems in 15 rural schools across Guatemala, providing reliable electricity for computers, lights, and educational technology for 2,000+ students.",
    imageUrl: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=800",
    goalAmount: 65000,
    totalDonated: 23400,
    endTimestamp: Date.now() + (40 * 24 * 60 * 60 * 1000), // 40 days from now
    milestones: [
      { goalAmount: 15000, bonusReward: 150, isClaimed: true },
      { goalAmount: 30000, bonusReward: 300, isClaimed: false },
      { goalAmount: 50000, bonusReward: 500, isClaimed: false },
      { goalAmount: 65000, bonusReward: 650, isClaimed: false },
    ]
  }
];

export const mockNFTCertificates: NFTCertificate[] = [
  {
    tokenId: "0xNFT001",
    name: "Ocean Protector",
    description: "Awarded for donating over 1,000 APT to marine conservation efforts",
    imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400",
    dateEarned: "2024-03-15T10:30:00Z"
  },
  {
    tokenId: "0xNFT002", 
    name: "Forest Guardian",
    description: "Earned by supporting 3+ forest conservation campaigns",
    imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400",
    dateEarned: "2024-02-28T14:20:00Z"
  },
  {
    tokenId: "0xNFT003",
    name: "Clean Water Champion",
    description: "Recognized for bringing clean water access to 500+ families",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
    dateEarned: "2024-01-10T09:15:00Z"
  }
];

export const mockDonorProfile: DonorProfile = {
  address: "0x1234567890abcdef",
  aptosName: "jane.apt",
  totalDonatedAPT: 2847.50,
  donationCount: 12,
  heartTokens: 5695,
  stakedHeartTokens: 3200,
  nftBadges: mockNFTCertificates
};

export const mockGovernanceProposals: GovernanceProposal[] = [
  {
    proposalId: 1,
    title: "Increase HEART Token Rewards for Environmental Campaigns",
    description: "Proposal to increase HEART token rewards by 25% for all environmental and climate-focused charity campaigns to incentivize more donations toward urgent climate action.",
    proposer: "climate.apt",
    status: "active",
    votesFor: 15420,
    votesAgainst: 3280,
    endTimestamp: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days from now
  },
  {
    proposalId: 2,
    title: "Add Matching Fund Pool for Education Campaigns",
    description: "Create a community-funded matching pool that doubles donations to education-focused campaigns up to 10,000 APT per campaign.",
    proposer: "education.apt",
    status: "active",
    votesFor: 8950,
    votesAgainst: 1240,
    endTimestamp: Date.now() + (5 * 24 * 60 * 60 * 1000) // 5 days from now
  },
  {
    proposalId: 3,
    title: "Implement Milestone Celebration Events",
    description: "Host virtual celebration events when major community milestones are reached, including guest speakers and special NFT drops for participants.",
    proposer: "community.apt",
    status: "passed",
    votesFor: 22100,
    votesAgainst: 890,
    endTimestamp: Date.now() - (2 * 24 * 60 * 60 * 1000) // 2 days ago
  }
];

export const mockRecentDonations: Donation[] = [
  {
    id: "1",
    donorName: "sarah.apt",
    amount: 25.5,
    eventAddress: "0xEVENT001",
    timestamp: Date.now() - (2 * 60 * 1000) // 2 minutes ago
  },
  {
    id: "2", 
    donorName: "mike.apt",
    amount: 100,
    eventAddress: "0xEVENT001",
    timestamp: Date.now() - (5 * 60 * 1000) // 5 minutes ago
  },
  {
    id: "3",
    donorName: "alex.apt", 
    amount: 50,
    eventAddress: "0xEVENT002",
    timestamp: Date.now() - (8 * 60 * 1000) // 8 minutes ago
  },
  {
    id: "4",
    donorName: "emma.apt",
    amount: 75.25,
    eventAddress: "0xEVENT003",
    timestamp: Date.now() - (12 * 60 * 1000) // 12 minutes ago
  }
];

// Helper function to get event by address
export const getEventByAddress = (address: string): CharityEvent | undefined => {
  return mockCharityEvents.find(event => event.eventAddress === address);
};

// Helper function to calculate progress percentage
export const calculateProgress = (totalDonated: number, goalAmount: number): number => {
  return Math.min((totalDonated / goalAmount) * 100, 100);
};

// Helper function to format currency
export const formatAPT = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

// Helper function to calculate time remaining
export const getTimeRemaining = (endTimestamp: number): string => {
  const now = Date.now();
  const diff = endTimestamp - now;
  
  if (diff <= 0) return "Campaign ended";
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (days > 0) {
    return `${days} day${days !== 1 ? 's' : ''} left`;
  } else {
    return `${hours} hour${hours !== 1 ? 's' : ''} left`;
  }
};