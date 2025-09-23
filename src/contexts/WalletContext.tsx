import React, { createContext, useContext, useState, ReactNode } from 'react';
import { WalletState } from '../types';
import { mockDonorProfile } from '../mockData';

interface WalletContextType extends WalletState {
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    isConnecting: false,
    currentUser: null,
  });

  const connect = async () => {
    setWalletState(prev => ({ ...prev, isConnecting: true }));
    
    // Simulate wallet connection delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setWalletState({
      isConnected: true,
      isConnecting: false,
      currentUser: mockDonorProfile,
    });
  };

  const disconnect = () => {
    setWalletState({
      isConnected: false,
      isConnecting: false,
      currentUser: null,
    });
  };

  const value: WalletContextType = {
    ...walletState,
    connect,
    disconnect,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};