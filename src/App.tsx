import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { WalletProvider } from "./contexts/WalletContext";
import Header from "./components/Header";
import NewLanding from './pages/NewLanding';
import Marketplace from "./pages/Marketplace";
import EventDetail from "./pages/EventDetail";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ConditionalHeader = () => {
  const location = useLocation();
  // Don't show header on landing page since it has its own navigation
  if (location.pathname === '/') {
    return null;
  }
  return <Header />;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen">
              <ConditionalHeader />
              <Routes>
                <Route path="/" element={<NewLanding />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/event/:eventAddress" element={<EventDetail />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </WalletProvider>
    </QueryClientProvider>
  );
};

export default App;
