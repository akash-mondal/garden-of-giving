import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Heart, Target, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface Campaign {
  id: string;
  goal_amount: string | number;
  created_at: string;
  end_timestamp: string;
}

interface Donation {
  id: string;
  amount: string | number;
  created_at: string;
}

interface DonationStatsProps {
  campaigns: Campaign[];
  userDonations: Donation[];
}

export const DonationStats: React.FC<DonationStatsProps> = ({
  campaigns,
  userDonations
}) => {
  // Calculate stats
  const totalCampaigns = campaigns.length;
  const totalGoalAmount = campaigns.reduce((sum, campaign) => 
    sum + Number(campaign.goal_amount), 0
  );
  const totalDonations = userDonations.reduce((sum, donation) => 
    sum + Number(donation.amount), 0
  );
  
  // Calculate active campaigns (not ended yet)
  const activeCampaigns = campaigns.filter(campaign => 
    new Date(campaign.end_timestamp) > new Date()
  ).length;

  const stats = [
    {
      title: 'Total Campaigns',
      value: totalCampaigns.toString(),
      icon: Target,
      color: 'from-blue-500 to-cyan-500',
      description: `${activeCampaigns} active`
    },
    {
      title: 'Total Goal Amount',
      value: `$${totalGoalAmount.toLocaleString()}`,
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500',
      description: 'Across all campaigns'
    },
    {
      title: 'Your Donations',
      value: `$${totalDonations.toLocaleString()}`,
      icon: Heart,
      color: 'from-pink-500 to-rose-500',
      description: `${userDonations.length} donations made`
    },
    {
      title: 'This Month',
      value: campaigns.filter(campaign => {
        const campaignDate = new Date(campaign.created_at);
        const now = new Date();
        return campaignDate.getMonth() === now.getMonth() && 
               campaignDate.getFullYear() === now.getFullYear();
      }).length.toString(),
      icon: Calendar,
      color: 'from-purple-500 to-violet-500',
      description: 'New campaigns'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="relative overflow-hidden border-2 hover:border-primary/20 transition-all duration-300 group">
              <CardContent className="p-6">
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
                
                {/* Content */}
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color} text-white`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {stat.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};