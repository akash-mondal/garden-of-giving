import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SupabaseService } from '@/services/supabaseService';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

interface User {
  id: string;
  name: string;
  walletAddress: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithWallet: (signMessage: (message: string) => Promise<{ signature: string; publicKey: string; walletAddress: string }>) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize auth state and set up listener
  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        
        if (session?.user) {
          try {
            const walletAddress = session.user.user_metadata?.wallet_address;
            if (walletAddress) {
              const profile = await SupabaseService.getProfileByWalletAddress(walletAddress);
              if (profile) {
                setUser({
                  id: profile.id,
                  name: profile.name || `User ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`,
                  walletAddress: profile.wallet_address,
                  avatar: profile.avatar_url || undefined
                });
              }
            }
          } catch (error) {
            console.error('Error fetching user profile:', error);
          }
        } else {
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loginWithWallet = async (
    signMessage: (message: string) => Promise<{ signature: string; publicKey: string; walletAddress: string }>
  ): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Request sign-in message from Edge Function
      const { message } = await SupabaseService.requestSignInMessage();
      
      // Get signature from wallet
      const { signature, publicKey, walletAddress } = await signMessage(message);
      
      // Verify signature with Edge Function
      const { success } = await SupabaseService.verifySignature({
        publicKey,
        signature,
        message,
        walletAddress
      });

      if (success) {
        // The auth state will be updated by the onAuthStateChange listener
        console.log('Wallet login successful');
      } else {
        throw new Error('Signature verification failed');
      }
    } catch (error) {
      console.error('Wallet login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: Boolean(user && session),
    isLoading,
    loginWithWallet,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};