import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Plus, Calendar, Target, Users, DollarSign, Edit, Trash, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { SupabaseService } from '@/services/supabaseService';
import { useAuth } from '@/contexts/AuthContext';
import { CreateCampaignModal } from '@/components/CreateCampaignModal';
import { DonationStats } from '@/components/DonationStats';

const CampaignManager = () => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Fetch campaigns
  const { data: campaigns = [], isLoading } = useQuery({
    queryKey: ['campaigns'],
    queryFn: SupabaseService.getCampaigns,
    enabled: isAuthenticated
  });

  // Fetch user's donations if authenticated
  const { data: userDonations = [] } = useQuery({
    queryKey: ['user-donations', user?.id],
    queryFn: () => user ? SupabaseService.getDonationsByDonor(user.id) : [],
    enabled: Boolean(user?.id)
  });

  // Delete campaign mutation
  const deleteCampaignMutation = useMutation({
    mutationFn: async (campaignId: string) => {
      // This would be implemented in SupabaseService
      throw new Error('Delete functionality not implemented yet');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast({
        title: "Campaign deleted",
        description: "Campaign has been successfully deleted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete campaign.",
        variant: "destructive",
      });
    }
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateProgress = (goalAmount: number, totalDonated: number) => {
    return Math.min((totalDonated / goalAmount) * 100, 100);
  };

  const getTimeRemaining = (endTimestamp: string) => {
    const now = new Date().getTime();
    const end = new Date(endTimestamp).getTime();
    const difference = end - now;

    if (difference <= 0) return 'Ended';

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days} days left`;
    return `${hours} hours left`;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-primary/5">
        <Card className="w-full max-w-md p-6 text-center">
          <CardHeader>
            <CardTitle className="text-2xl">Campaign Manager</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Please connect your wallet to manage campaigns
            </p>
            <Button onClick={() => window.location.href = '/login'}>
              Connect Wallet
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Campaign Manager
              </h1>
              <p className="text-muted-foreground mt-2">
                Create and manage your fundraising campaigns
              </p>
            </div>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Campaign
            </Button>
          </div>

          {/* Stats */}
          <DonationStats 
            campaigns={campaigns} 
            userDonations={userDonations} 
          />
        </motion.div>

        {/* Campaigns Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-32 bg-muted rounded mb-4"></div>
                    <div className="h-3 bg-muted rounded mb-2"></div>
                    <div className="h-3 bg-muted rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : campaigns.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <div className="mb-4">
                  <Target className="mx-auto h-16 w-16 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No campaigns yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first campaign to start fundraising
                </p>
                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Campaign
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.map((campaign, index) => {
                // Calculate total donations for this campaign
                const totalDonated = 0; // This would be calculated from donations data
                const progress = calculateProgress(Number(campaign.goal_amount), totalDonated);
                
                return (
                  <motion.div
                    key={campaign.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                              {campaign.name}
                            </CardTitle>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className="text-xs">
                                <Calendar className="w-3 h-3 mr-1" />
                                {getTimeRemaining(campaign.end_timestamp)}
                              </Badge>
                              <Badge 
                                variant={progress >= 100 ? "default" : "secondary"} 
                                className="text-xs"
                              >
                                {progress.toFixed(0)}% funded
                              </Badge>
                            </div>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-8 w-8 p-0 hover:text-destructive"
                              onClick={() => deleteCampaignMutation.mutate(campaign.id)}
                            >
                              <Trash className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        {/* Campaign Image */}
                        {campaign.image_url && (
                          <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                            <img
                              src={campaign.image_url}
                              alt={campaign.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}

                        {/* Description */}
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {campaign.description}
                        </p>

                        {/* Progress Bar */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-semibold">{progress.toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-secondary rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-300"
                              style={{ width: `${Math.min(progress, 100)}%` }}
                            />
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4 pt-2">
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                              <DollarSign className="w-3 h-3" />
                              <span className="text-xs">Raised</span>
                            </div>
                            <p className="font-semibold text-sm">
                              ${totalDonated.toLocaleString()}
                            </p>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                              <Target className="w-3 h-3" />
                              <span className="text-xs">Goal</span>
                            </div>
                            <p className="font-semibold text-sm">
                              ${Number(campaign.goal_amount).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        {/* Created Date */}
                        <div className="pt-2 border-t">
                          <p className="text-xs text-muted-foreground text-center">
                            Created on {formatDate(campaign.created_at)}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>

      {/* Create Campaign Modal */}
      <CreateCampaignModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['campaigns'] });
          setIsCreateModalOpen(false);
        }}
      />
    </div>
  );
};

export default CampaignManager;