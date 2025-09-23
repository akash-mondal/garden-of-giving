import React, { createContext, useContext, ReactNode } from 'react';
import { usePageTransition } from '../hooks/usePageTransition';

interface TransitionContextType {
  navigateWithTransition: (to: string) => void;
  isTransitioning: boolean;
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined);

export const useTransition = () => {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error('useTransition must be used within a TransitionProvider');
  }
  return context;
};

interface TransitionProviderProps {
  children: ReactNode;
}

export const TransitionProvider: React.FC<TransitionProviderProps> = ({ children }) => {
  const { navigateWithTransition, isTransitioning } = usePageTransition();

  return (
    <TransitionContext.Provider value={{ navigateWithTransition, isTransitioning }}>
      {children}
    </TransitionContext.Provider>
  );
};