import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Tables = Database['public']['Tables'];
type Profile = Tables['profiles']['Row'];
type Campaign = Tables['campaigns']['Row'];
type Donation = Tables['donations']['Row'];

export class SupabaseService {
  // Profile operations
  static async getProfileByWalletAddress(walletAddress: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('wallet_address', walletAddress)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching profile:', error);
      throw error;
    }

    return data;
  }

  static async createProfile(profile: Tables['profiles']['Insert']): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .insert(profile)
      .select()
      .single();

    if (error) {
      console.error('Error creating profile:', error);
      throw error;
    }

    return data;
  }

  static async updateProfile(id: string, updates: Tables['profiles']['Update']): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      throw error;
    }

    return data;
  }

  // Campaign operations
  static async getCampaigns(): Promise<Campaign[]> {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching campaigns:', error);
      throw error;
    }

    return data || [];
  }

  static async getCampaignById(id: string): Promise<Campaign | null> {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching campaign:', error);
      throw error;
    }

    return data;
  }

  static async getCampaignByObjectAddress(objectAddress: string): Promise<Campaign | null> {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('object_address', objectAddress)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching campaign:', error);
      throw error;
    }

    return data;
  }

  static async createCampaign(campaign: Tables['campaigns']['Insert']): Promise<Campaign> {
    const { data, error } = await supabase
      .from('campaigns')
      .insert(campaign)
      .select()
      .single();

    if (error) {
      console.error('Error creating campaign:', error);
      throw error;
    }

    return data;
  }

  // Donation operations
  static async getDonationsByCampaign(campaignId: string): Promise<Donation[]> {
    const { data, error } = await supabase
      .from('donations')
      .select(`
        *,
        donor:profiles(*)
      `)
      .eq('campaign_id', campaignId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching donations:', error);
      throw error;
    }

    return data || [];
  }

  static async getDonationsByDonor(donorId: string): Promise<Donation[]> {
    const { data, error } = await supabase
      .from('donations')
      .select(`
        *,
        campaign:campaigns(*)
      `)
      .eq('donor_id', donorId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching donations:', error);
      throw error;
    }

    return data || [];
  }

  static async createDonation(donation: Tables['donations']['Insert']): Promise<Donation> {
    const { data, error } = await supabase
      .from('donations')
      .insert(donation)
      .select()
      .single();

    if (error) {
      console.error('Error creating donation:', error);
      throw error;
    }

    return data;
  }

  static async getTotalDonatedByCampaign(campaignId: string): Promise<number> {
    const { data, error } = await supabase
      .from('donations')
      .select('amount')
      .eq('campaign_id', campaignId);

    if (error) {
      console.error('Error fetching total donations:', error);
      throw error;
    }

    return data?.reduce((total, donation) => total + Number(donation.amount), 0) || 0;
  }

  // Authentication with Aptos wallet
  static async requestSignInMessage(): Promise<{ message: string; nonce: string; timestamp: number }> {
    const response = await supabase.functions.invoke('aptos-auth', {
      method: 'GET'
    });

    if (response.error) {
      console.error('Error requesting sign-in message:', response.error);
      throw response.error;
    }

    return response.data;
  }

  static async verifySignature(params: {
    publicKey: string;
    signature: string;
    message: string;
    walletAddress: string;
  }): Promise<{ success: boolean; user?: any }> {
    const response = await supabase.functions.invoke('aptos-auth', {
      method: 'POST',
      body: params
    });

    if (response.error) {
      console.error('Error verifying signature:', response.error);
      throw response.error;
    }

    return response.data;
  }
}