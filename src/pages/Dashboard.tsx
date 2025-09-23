import { motion } from 'framer-motion';
import { Heart, Trophy, TrendingUp, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import GardenParticles from '../components/GardenParticles';
import { formatAPT } from '../mockData';

const Dashboard = () => {
  const { isAuthenticated, user } = useAuth();

  // Redirect if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Mock user data for dashboard
  const mockUserData = {
    aptosName: user.name,
    totalDonatedAPT: 425,
    donationCount: 12,
    heartTokens: 850,
    stakedHeartTokens: 250,
    recentDonations: [
      { campaign: 'Coral Reef Restoration', amount: 150, date: '2024-03-15' },
      { campaign: 'Amazon Forest Protection', amount: 75, date: '2024-03-10' },
      { campaign: 'Clean Water Wells', amount: 200, date: '2024-03-05' },
    ]
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
          <h1 className="text-5xl font-shadows text-foreground mb-2">
            Your Garden
          </h1>
          <p className="text-xl font-caveat text-primary">
            Welcome back, {mockUserData.aptosName}
          </p>
        </motion.div>

        {/* Interactive Garden Visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="h-64 md:h-80 mb-8 relative flex items-center justify-center"
        >
          <div className="text-center space-y-4">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="text-8xl mb-4"
            >
              🌻
            </motion.div>
            <p className="text-lg font-caveat text-primary">
              Your personal garden grows with every donation
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <span>🌱</span>
                <span>{mockUserData.donationCount} seeds planted</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>❤️</span>
                <span>{mockUserData.heartTokens} HEART earned</span>
              </div>
            </div>
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
              value: `${formatAPT(mockUserData.totalDonatedAPT)} APT`,
              color: 'text-primary'
            },
            {
              icon: Trophy,
              label: 'Campaigns Supported',
              value: mockUserData.donationCount.toString(),
              color: 'text-primary'
            },
            {
              icon: Heart,
              label: 'HEART Tokens',
              value: mockUserData.heartTokens.toString(),
              color: 'text-primary'
            },
            {
              icon: TrendingUp,
              label: 'Staked HEART', 
              value: mockUserData.stakedHeartTokens.toString(),
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

        {/* Impact Summary - Integrated from removed tab */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid lg:grid-cols-2 gap-8"
        >
          {/* Recent Donations */}
          <div className="card-garden p-6">
            <h2 className="text-2xl font-nunito font-bold text-foreground mb-6">
              Recent Donation History
            </h2>
            
            <div className="space-y-4">
              {mockUserData.recentDonations.map((donation, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className="flex justify-between items-center p-4 bg-background rounded-xl border border-border hover:border-primary/20 transition-colors"
                >
                  <div>
                    <p className="font-nunito font-semibold text-foreground">
                      {donation.campaign}
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(donation.date).toLocaleDateString()}</span>
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
                </motion.div>
              ))}
            </div>
          </div>

          {/* Impact Metrics */}
          <div className="card-garden p-6">
            <h2 className="text-2xl font-nunito font-bold text-foreground mb-6">
              Your Impact Metrics
            </h2>
            
            <div className="space-y-4">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.0 }}
                className="p-4 bg-mint-soft/20 rounded-xl border border-mint-soft/50"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <Heart className="w-5 h-5 text-primary" fill="currentColor" />
                  <span className="font-nunito font-semibold">Environmental Impact</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Your donations have helped plant 145 trees and protect 2.3 acres of ocean.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.1 }}
                className="p-4 bg-primary/10 rounded-xl border border-primary/20"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  <span className="font-nunito font-semibold">Community Impact</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  You've helped provide clean water access to 47 families.
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 }}
                className="p-4 bg-background/50 rounded-xl border border-border"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <span className="font-nunito font-semibold">Growing Impact</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Your impact score has increased by 15% this month. Keep donating!
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          className="mt-12 text-center"
        >
          <div className="card-garden p-8 bg-primary/5 border-primary/20">
            <div className="text-6xl mb-4">🚀</div>
            <h3 className="text-2xl font-nunito font-bold text-foreground mb-4">
              Ready to Make More Impact?
            </h3>
            <p className="text-muted-foreground mb-6">
              Explore new campaigns, manage your staking, or participate in governance.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="/marketplace" className="btn-garden-primary">
                Browse Campaigns
              </a>
              <a href="/staking" className="btn-garden-secondary">
                Manage Staking
              </a>
              <a href="/governance" className="btn-garden-secondary">
                Vote on Proposals
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;