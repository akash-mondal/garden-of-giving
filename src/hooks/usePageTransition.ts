import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export const usePageTransition = () => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const navigate = useNavigate();

  const navigateWithTransition = useCallback((to: string) => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setPendingNavigation(to);
  }, [isTransitioning]);

  const onTransitionComplete = useCallback(() => {
    if (pendingNavigation) {
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