import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Unlock, TrendingUp, Clock, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import GardenParticles from '../components/GardenParticles';
import { useToast } from '../hooks/use-toast';

const Staking = () => {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const [stakingAmount, setStakingAmount] = useState<string>('');

  // Redirect if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Mock staking data
  const stakingData = {
    heartTokens: 850,
    stakedHeartTokens: 250,
    stakingAPY: 12.5,
    pendingRewards: 15.5,
    stakingDuration: 45 // days
  };

  const availableToStake = stakingData.heartTokens - stakingData.stakedHeartTokens;

  const handleStake = () => {
    if (!stakingAmount || parseFloat(stakingAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid staking amount",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Staking Successful!",
      description: `Staked ${stakingAmount} HEART tokens successfully`,
    });
    
    console.log(`Staking ${stakingAmount} HEART tokens`);
    setStakingAmount('');
  };

  const handleUnstake = () => {
    toast({
      title: "Unstaking Initiated",
      description: "Your tokens will be available after the cooldown period",
    });
    
    console.log('Unstaking HEART tokens');
  };

  const handleClaimRewards = () => {
    toast({
      title: "Rewards Claimed!",
      description: `Claimed ${stakingData.pendingRewards} HEART tokens`,
    });
    
    console.log('Claiming staking rewards');
  };

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
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Lock className="w-12 h-12 text-primary" />
            <h1 className="text-5xl font-shadows text-foreground">
              HEART Staking
            </h1>
          </div>
          <p className="text-xl font-caveat text-primary">
            Stake your HEART tokens to earn rewards, {user.name}
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-4 gap-6 mb-8"
        >
          <div className="card-garden p-6 text-center">
            <Lock className="w-8 h-8 text-primary mx-auto mb-3" fill="currentColor" />
            <div className="text-2xl font-nunito font-bold text-foreground mb-1">
              {stakingData.stakedHeartTokens}
            </div>
            <div className="text-sm text-muted-foreground">
              Staked HEART
            </div>
          </div>
          
          <div className="card-garden p-6 text-center">
            <TrendingUp className="w-8 h-8 text-primary mx-auto mb-3" />
            <div className="text-2xl font-nunito font-bold text-foreground mb-1">
              {stakingData.stakingAPY}%
            </div>
            <div className="text-sm text-muted-foreground">
              Current APY
            </div>
          </div>

          <div className="card-garden p-6 text-center">
            <Zap className="w-8 h-8 text-primary mx-auto mb-3" />
            <div className="text-2xl font-nunito font-bold text-foreground mb-1">
              {stakingData.pendingRewards}
            </div>
            <div className="text-sm text-muted-foreground">
              Pending Rewards
            </div>
          </div>

          <div className="card-garden p-6 text-center">
            <Clock className="w-8 h-8 text-primary mx-auto mb-3" />
            <div className="text-2xl font-nunito font-bold text-foreground mb-1">
              {stakingData.stakingDuration}
            </div>
            <div className="text-sm text-muted-foreground">
              Days Staked
            </div>
          </div>
        </motion.div>

        {/* Main Staking Interface */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Stake Tokens */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <div className="card-garden p-6">
              <h3 className="text-2xl font-nunito font-bold text-foreground mb-6">
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
                    className="w-full p-4 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-lg"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Available: {availableToStake} HEART
                  </p>
                </div>
                
                <motion.button
                  onClick={handleStake}
                  disabled={!stakingAmount || parseFloat(stakingAmount) <= 0}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group w-full relative overflow-hidden bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary text-white font-nunito font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                  <div className="relative flex items-center justify-center space-x-2 text-lg">
                    <Lock className="w-5 h-5" />
                    <span>Stake Tokens</span>
                  </div>
                </motion.button>
              </div>
            </div>

            {/* Staking Benefits */}
            <div className="card-garden p-6 bg-primary/5 border-primary/20">
              <h4 className="text-lg font-nunito font-semibold text-foreground mb-4">
                Staking Benefits
              </h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm text-muted-foreground">
                    Earn {stakingData.stakingAPY}% APY on staked tokens
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm text-muted-foreground">
                    1.2x multiplier on future donation rewards
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm text-muted-foreground">
                    Voting power in governance proposals
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm text-muted-foreground">
                    Access to exclusive donor events
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Staking Position & Rewards */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <div className="card-garden p-6">
              <h3 className="text-2xl font-nunito font-bold text-foreground mb-6">
                Your Staking Position
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-background rounded-xl">
                  <span className="text-muted-foreground">Staked Amount</span>
                  <span className="font-nunito font-bold text-primary text-lg">
                    {stakingData.stakedHeartTokens} HEART
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-background rounded-xl">
                  <span className="text-muted-foreground">Est. Annual Rewards</span>
                  <span className="font-nunito font-bold text-primary text-lg">
                    {Math.floor(stakingData.stakedHeartTokens * (stakingData.stakingAPY / 100))} HEART
                  </span>
                </div>

                <div className="flex justify-between items-center p-4 bg-background rounded-xl">
                  <span className="text-muted-foreground">Pending Rewards</span>
                  <span className="font-nunito font-bold text-primary text-lg">
                    {stakingData.pendingRewards} HEART
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <motion.button
                    onClick={handleClaimRewards}
                    disabled={stakingData.pendingRewards <= 0}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative overflow-hidden bg-gradient-to-r from-green-500 to-emerald-600 hover:from-emerald-600 hover:to-green-500 text-white font-nunito font-semibold py-3 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                    <div className="relative flex items-center justify-center space-x-2">
                      <Zap className="w-4 h-4" />
                      <span>Claim Rewards</span>
                    </div>
                  </motion.button>
                  
                  {stakingData.stakedHeartTokens > 0 && (
                    <motion.button
                      onClick={handleUnstake}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="group relative overflow-hidden bg-gradient-to-r from-orange-500 to-red-500 hover:from-red-500 hover:to-orange-500 text-white font-nunito font-semibold py-3 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-orange-500/30"
                    >
                      <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                      <div className="relative flex items-center justify-center space-x-2">
                        <Unlock className="w-4 h-4" />
                        <span>Unstake</span>
                      </div>
                    </motion.button>
                  )}
                </div>
              </div>
            </div>

            {/* Staking Info */}
            <div className="card-garden p-6 bg-background/50">
              <h4 className="text-lg font-nunito font-semibold text-foreground mb-4">
                Important Information
              </h4>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>• Staking has a 7-day cooldown period for unstaking</p>
                <p>• Rewards are calculated and distributed every 24 hours</p>
                <p>• Staked tokens cannot be used for donations until unstaked</p>
                <p>• APY rates may fluctuate based on total staked amount</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Staking;