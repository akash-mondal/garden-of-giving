import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { WalletProvider } from "./contexts/WalletContext";
import Navigation from "./components/Navigation";
import PageTransition from "./components/PageTransition";
import { usePageTransition } from "./hooks/usePageTransition";
import AnimatedSectionsLanding from './components/AnimatedSectionsLanding';
import Marketplace from "./pages/Marketplace";
import EventDetail from "./pages/EventDetail";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  const { isTransitioning, navigateWithTransition, onTransitionComplete } = usePageTransition();

  return (
    <div className="min-h-screen">
      <PageTransition 
        isTransitioning={isTransitioning}
        onTransitionComplete={onTransitionComplete}
      />
      {!isLandingPage && <Navigation />}
      <div className={!isLandingPage ? 'pt-16' : ''}>
        <Routes>
          <Route path="/" element={<AnimatedSectionsLanding navigateWithTransition={navigateWithTransition} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/event/:eventAddress" element={<EventDetail />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <WalletProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </WalletProvider>
  </QueryClientProvider>
);

export default App;
