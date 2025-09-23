import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navigation from "./components/Navigation";
import AnimatedSectionsLanding from './components/AnimatedSectionsLanding';
import Marketplace from "./pages/Marketplace";
import EventDetail from "./pages/EventDetail";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Badges from "./pages/Badges";
import Staking from "./pages/Staking";  
import Governance from "./pages/Governance";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  return (
    <div className="min-h-screen">
      {!isLandingPage && <Navigation />}
      <div className={!isLandingPage ? 'pt-16' : ''}>
        <Routes>
          <Route path="/" element={<AnimatedSectionsLanding />} />
          <Route 
            path="/login" 
            element={
              <ProtectedRoute>
                <Login />
              </ProtectedRoute>
            } 
          />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/event/:eventAddress" element={<EventDetail />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute requireAuth redirectTo="/login">
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/badges" 
            element={
              <ProtectedRoute requireAuth redirectTo="/login">
                <Badges />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/staking" 
            element={
              <ProtectedRoute requireAuth redirectTo="/login">
                <Staking />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/governance" 
            element={
              <ProtectedRoute requireAuth redirectTo="/login">
                <Governance />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
