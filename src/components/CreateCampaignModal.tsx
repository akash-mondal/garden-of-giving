import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Calendar, Target, FileText, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { SupabaseService } from '@/services/supabaseService';
import { useAuth } from '@/contexts/AuthContext';

interface CreateCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface CampaignFormData {
  name: string;
  description: string;
  goalAmount: string;
  endDate: string;
  imageUrl: string;
  objectAddress: string;
}

export const CreateCampaignModal: React.FC<CreateCampaignModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<CampaignFormData>({
    name: '',
    description: '',
    goalAmount: '',
    endDate: '',
    imageUrl: '',
    objectAddress: ''
  });

  const [isUploading, setIsUploading] = useState(false);

  const createCampaignMutation = useMutation({
    mutationFn: async (data: CampaignFormData) => {
      if (!user) throw new Error('User not authenticated');

      const campaignData = {
        object_address: data.objectAddress || `campaign_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        creator_address: user.walletAddress,
        name: data.name,
        description: data.description,
        image_url: data.imageUrl,
        goal_amount: parseFloat(data.goalAmount),
        end_timestamp: new Date(data.endDate).toISOString()
      };

      return SupabaseService.createCampaign(campaignData);
    },
    onSuccess: () => {
      toast({
        title: "Campaign created successfully!",
        description: "Your campaign is now live and ready for donations.",
      });
      onSuccess();
      resetForm();
    },
    onError: (error) => {
      console.error('Campaign creation error:', error);
      toast({
        title: "Error creating campaign",
        description: "Please try again. Make sure all fields are filled correctly.",
        variant: "destructive",
      });
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      goalAmount: '',
      endDate: '',
      imageUrl: '',
      objectAddress: ''
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.description || !formData.goalAmount || !formData.endDate) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (parseFloat(formData.goalAmount) <= 0) {
      toast({
        title: "Goal amount must be greater than 0",
        variant: "destructive",
      });
      return;
    }

    if (new Date(formData.endDate) <= new Date()) {
      toast({
        title: "End date must be in the future",
        variant: "destructive",
      });
      return;
    }

    createCampaignMutation.mutate(formData);
  };

  const handleInputChange = (field: keyof CampaignFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Mock file upload - in real app, this would upload to Supabase Storage
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, use a placeholder image URL
      const imageUrl = `https://picsum.photos/800/400?random=${Date.now()}`;
      handleInputChange('imageUrl', imageUrl);
      
      toast({
        title: "Image uploaded successfully",
      });
    } catch (error) {
      toast({
        title: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-2xl font-bold">Create New Campaign</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Campaign Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Campaign Name *
                  </Label>
                  <Input
                    id="name"
                    placeholder="Enter campaign name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your campaign and what you're raising funds for..."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="min-h-[100px] resize-none"
                  />
                </div>

                {/* Goal Amount and End Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="goalAmount" className="flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Goal Amount (USD) *
                    </Label>
                    <Input
                      id="goalAmount"
                      type="number"
                      placeholder="0.00"
                      value={formData.goalAmount}
                      onChange={(e) => handleInputChange('goalAmount', e.target.value)}
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDate" className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      End Date *
                    </Label>
                    <Input
                      id="endDate"
                      type="datetime-local"
                      value={formData.endDate}
                      onChange={(e) => handleInputChange('endDate', e.target.value)}
                      min={new Date().toISOString().slice(0, 16)}
                    />
                  </div>
                </div>

                {/* Image Upload */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Image className="w-4 h-4" />
                    Campaign Image
                  </Label>
                  <div className="flex items-center gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isUploading}
                      onClick={() => document.getElementById('image-upload')?.click()}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {isUploading ? 'Uploading...' : 'Upload Image'}
                    </Button>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    {formData.imageUrl && (
                      <span className="text-sm text-muted-foreground">
                        Image uploaded ✓
                      </span>
                    )}
                  </div>
                  {formData.imageUrl && (
                    <div className="mt-2">
                      <img
                        src={formData.imageUrl}
                        alt="Campaign preview"
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                </div>

                {/* Object Address (Optional) */}
                <div className="space-y-2">
                  <Label htmlFor="objectAddress">
                    Blockchain Object Address (Optional)
                  </Label>
                  <Input
                    id="objectAddress"
                    placeholder="0x... (leave empty to auto-generate)"
                    value={formData.objectAddress}
                    onChange={(e) => handleInputChange('objectAddress', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    If empty, a unique address will be generated automatically
                  </p>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createCampaignMutation.isPending}
                    className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                  >
                    {createCampaignMutation.isPending ? 'Creating...' : 'Create Campaign'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};