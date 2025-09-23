import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export const usePageTransition = () => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const navigate = useNavigate();

  const navigateWithTransition = useCallback((to: string) => {
    console.log('navigateWithTransition called with:', to);
    if (isTransitioning) {
      console.log('Transition already in progress, ignoring');
      return;
    }
    
    console.log('Starting transition to:', to);
    setIsTransitioning(true);
    setPendingNavigation(to);
  }, [isTransitioning]);

  const onTransitionComplete = useCallback(() => {
    console.log('onTransitionComplete called, pending:', pendingNavigation);
    if (pendingNavigation) {
      console.log('Navigating to:', pendingNavigation);
      navigate(pendingNavigation);
      setPendingNavigation(null);
    }
    setIsTransitioning(false);
  }, [navigate, pendingNavigation]);

  return {
    isTransitioning,
    navigateWithTransition,
    onTransitionComplete
  };
};