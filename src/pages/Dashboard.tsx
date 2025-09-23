import { useState } from 'react';
import { motion } from 'framer-motion';
import { Navigate } from 'react-router-dom';
import { Heart, Trophy, TrendingUp, Vote, Lock, Unlock, Calendar, Award, ExternalLink } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';
import { mockGovernanceProposals, formatAPT } from '../mockData';
import IsometricGarden from '../components/IsometricGarden';
import GardenParticles from '../components/GardenParticles';

const Dashboard = () => {
  const { isConnected, currentUser } = useWallet();
  const [activeTab, setActiveTab] = useState<'impact' | 'badges' | 'staking' | 'governance'>('impact');
  const [stakingAmount, setStakingAmount] = useState<string>('');

  // Redirect if not connected
  if (!isConnected || !currentUser) {
    return <Navigate to="/" replace />;
  }

  const stakingAPY = 12.5; // 12.5% APY for staking
  const availableToStake = currentUser.heartTokens - currentUser.stakedHeartTokens;

  const handleStake = () => {
    // Mock staking functionality
    console.log(`Staking ${stakingAmount} HEART tokens`);
    setStakingAmount('');
  };

  const handleUnstake = () => {
    // Mock unstaking functionality
    console.log('Unstaking HEART tokens');
  };

  const handleVote = (proposalId: number, vote: 'for' | 'against') => {
    console.log(`Voting ${vote} on proposal ${proposalId}`);
  };

  const tabs = [
    { id: 'impact', label: 'My Impact', icon: TrendingUp },
    { id: 'badges', label: 'My Badges', icon: Award },
    { id: 'staking', label: 'Staking', icon: Lock },
    { id: 'governance', label: 'Governance', icon: Vote },
  ];

  return (
    <div className="relative min-h-screen py-8">
      <GardenParticles />
      
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-shadows text-foreground mb-2">
            Your Garden
          </h1>
          <p className="text-xl font-caveat text-primary">
            Welcome back, {currentUser.aptosName}
          </p>
        </motion.div>

        {/* Interactive Garden Visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="h-64 md:h-80 mb-8 relative flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent rounded-3xl" />
          <IsometricGarden 
            donationCount={currentUser.donationCount} 
            totalDonated={currentUser.totalDonatedAPT}
            className="relative z-10"
          />
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
            <p className="text-sm text-muted-foreground font-caveat">
              Your impact is growing beautifully! 🌸
            </p>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid md:grid-cols-4 gap-6 mb-8"
        >
          {[
            {
              icon: Heart,
              label: 'Total Donated',
              value: `${formatAPT(currentUser.totalDonatedAPT)} APT`,
              color: 'text-primary'
            },
            {
              icon: Trophy,
              label: 'Campaigns Supported',
              value: currentUser.donationCount.toString(),
              color: 'text-primary'
            },
            {
              icon: Heart,
              label: 'HEART Tokens',
              value: currentUser.heartTokens.toString(),
              color: 'text-primary'
            },
            {
              icon: Lock,
              label: 'Staked HEART', 
              value: currentUser.stakedHeartTokens.toString(),
              color: 'text-primary'
            }
          ].map(({ icon: Icon, label, value, color }, index) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="card-garden p-6 text-center"
            >
              <Icon className={`w-8 h-8 ${color} mx-auto mb-3`} fill="currentColor" />
              <div className="text-2xl font-nunito font-bold text-foreground mb-1">
                {value}
              </div>
              <div className="text-sm text-muted-foreground">
                {label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all duration-300 ${
                activeTab === id
                  ? 'bg-primary text-primary-foreground shadow-[0_0_20px_hsl(var(--vibrant-rose)/0.4)]'
                  : 'bg-card text-foreground hover:bg-primary/10'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-nunito font-medium">{label}</span>
            </button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card-garden p-6"
        >
          {/* My Impact Tab */}
          {activeTab === 'impact' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-nunito font-bold text-foreground">
                Your Impact Summary
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-nunito font-semibold text-foreground">
                    Donation History
                  </h3>
                  <div className="space-y-3">
                    {/* Mock donation history */}
                    {[
                      { campaign: 'Coral Reef Restoration', amount: 150, date: '2024-03-15' },
                      { campaign: 'Amazon Forest Protection', amount: 75, date: '2024-03-10' },
                      { campaign: 'Clean Water Wells', amount: 200, date: '2024-03-05' },
                    ].map((donation, index) => (
                      <div key={index} className="flex justify-between items-center p-4 bg-background rounded-xl">
                        <div>
                          <p className="font-nunito font-semibold text-foreground">
                            {donation.campaign}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(donation.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-nunito font-bold text-primary">
                            {formatAPT(donation.amount)} APT
                          </p>
                          <p className="text-xs text-muted-foreground">
                            +{donation.amount * 2} HEART
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-nunito font-semibold text-foreground">
                    Impact Metrics
                  </h3>
                  <div className="space-y-3">
                    <div className="p-4 bg-mint-soft/20 rounded-xl border border-mint-soft/50">
                      <div className="flex items-center space-x-2 mb-2">
                        <Heart className="w-5 h-5 text-primary" fill="currentColor" />
                        <span className="font-nunito font-semibold">Environmental Impact</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Your donations have helped plant 145 trees and protect 2.3 acres of ocean.
                      </p>
                    </div>
                    <div className="p-4 bg-primary/10 rounded-xl border border-primary/20">
                      <div className="flex items-center space-x-2 mb-2">
                        <Trophy className="w-5 h-5 text-primary" />
                        <span className="font-nunito font-semibold">Community Impact</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        You've helped provide clean water access to 47 families.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* My Badges Tab */}
          {activeTab === 'badges' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-nunito font-bold text-foreground">
                Your Achievement Badges
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentUser.nftBadges.map((badge) => (
                  <motion.div
                    key={badge.tokenId}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    className="card-garden p-6 text-center space-y-4"
                  >
                    <div className="w-20 h-20 mx-auto rounded-full overflow-hidden">
                      <img
                        src={badge.imageUrl}
                        alt={badge.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-nunito font-bold text-foreground mb-1">
                        {badge.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {badge.description}
                      </p>
                      <p className="text-xs text-primary font-caveat">
                        Earned {new Date(badge.dateEarned).toLocaleDateString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Staking Tab */}
          {activeTab === 'staking' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-nunito font-bold text-foreground">
                HEART Token Staking
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-6 bg-primary/5 rounded-2xl border border-primary/20">
                    <h3 className="text-lg font-nunito font-semibold text-foreground mb-4">
                      Stake HEART Tokens
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-nunito font-medium text-foreground mb-2">
                          Amount to Stake
                        </label>
                        <input
                          type="number"
                          placeholder="0"
                          value={stakingAmount}
                          onChange={(e) => setStakingAmount(e.target.value)}
                          max={availableToStake}
                          className="w-full p-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Available: {availableToStake} HEART
                        </p>
                      </div>
                      <button
                        onClick={handleStake}
                        disabled={!stakingAmount || parseFloat(stakingAmount) <= 0}
                        className="w-full btn-garden-primary disabled:opacity-50"
                      >
                        <Lock className="w-4 h-4 mr-2" />
                        Stake Tokens
                      </button>
                    </div>
                  </div>

                  <div className="p-4 bg-background rounded-xl border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">APY</span>
                      <span className="text-lg font-nunito font-bold text-primary">
                        {stakingAPY}%
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Staking increases your reward rate by 1.2x!
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-nunito font-semibold text-foreground">
                    Your Staking Position
                  </h3>
                  
                  <div className="p-6 bg-card rounded-2xl border border-border space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Staked Amount</span>
                      <span className="font-nunito font-bold text-primary">
                        {currentUser.stakedHeartTokens} HEART
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Est. Annual Rewards</span>
                      <span className="font-nunito font-bold text-primary">
                        {Math.floor(currentUser.stakedHeartTokens * (stakingAPY / 100))} HEART
                      </span>
                    </div>
                    
                    {currentUser.stakedHeartTokens > 0 && (
                      <button
                        onClick={handleUnstake}
                        className="w-full btn-garden-secondary flex items-center justify-center space-x-2"
                      >
                        <Unlock className="w-4 h-4" />
                        <span>Unstake Tokens</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Governance Tab */}
          {activeTab === 'governance' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-nunito font-bold text-foreground">
                Community Governance
              </h2>
              
              <div className="space-y-4">
                {mockGovernanceProposals.map((proposal) => (
                  <div key={proposal.proposalId} className="p-6 bg-background rounded-2xl border border-border">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-nunito font-bold text-foreground mb-2">
                          {proposal.title}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-3">
                          {proposal.description}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>By {proposal.proposer}</span>
                          <span className={`px-2 py-1 rounded-full ${
                            proposal.status === 'active' 
                              ? 'bg-primary/20 text-primary' 
                              : proposal.status === 'passed'
                              ? 'bg-mint-soft text-green-600'
                              : 'bg-destructive/20 text-destructive'
                          }`}>
                            {proposal.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Vote Results */}
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-green-600">For: {proposal.votesFor.toLocaleString()}</span>
                        <span className="text-red-600">Against: {proposal.votesAgainst.toLocaleString()}</span>
                      </div>
                      
                      <div className="w-full bg-border rounded-full h-2 overflow-hidden">
                        <div 
                          className="h-full bg-green-500"
                          style={{ 
                            width: `${(proposal.votesFor / (proposal.votesFor + proposal.votesAgainst)) * 100}%` 
                          }}
                        />
                      </div>

                      {proposal.status === 'active' && (
                        <div className="flex space-x-3 pt-2">
                          <button
                            onClick={() => handleVote(proposal.proposalId, 'for')}
                            className="flex-1 btn-garden-primary !py-2 !text-sm"
                          >
                            Vote For
                          </button>
                          <button
                            onClick={() => handleVote(proposal.proposalId, 'against')}
                            className="flex-1 btn-garden-secondary !py-2 !text-sm"
                          >
                            Vote Against
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;