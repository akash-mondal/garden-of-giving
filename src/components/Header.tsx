import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Wallet, User, LogOut, Home, Grid3X3, BarChart3 } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';
import { formatAPT } from '../mockData';

const Header = () => {
  const { isConnected, isConnecting, currentUser, connect, disconnect } = useWallet();
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Marketplace', href: '/marketplace', icon: Grid3X3 },
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3, requiresAuth: true },
  ];

  const isActivePath = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleWalletClick = async () => {
    if (!isConnected && !isConnecting) {
      await connect();
    }
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 backdrop-garden border-b border-border/20"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <span className="text-4xl">❤️</span>
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl scale-150 group-hover:scale-200 transition-transform duration-500" />
            </div>
            <div>
              <h1 className="text-2xl font-shadows text-primary">CharityRewards</h1>
              <p className="text-xs text-muted-foreground -mt-1">Digital Garden of Giving</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map(({ name, href, icon: Icon, requiresAuth }) => {
              if (requiresAuth && !isConnected) return null;
              
              return (
                <Link
                  key={name}
                  to={href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                    isActivePath(href)
                      ? 'bg-primary text-primary-foreground shadow-[0_0_20px_hsl(var(--vibrant-rose)/0.4)]'
                      : 'text-foreground hover:text-primary hover:bg-primary/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-nunito font-medium">{name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Wallet Connection */}
          <div className="flex items-center space-x-4">
            {!isConnected ? (
              <motion.button
                onClick={handleWalletClick}
                disabled={isConnecting}
                className="btn-garden-primary flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Wallet className="w-5 h-5" />
                <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
              </motion.button>
            ) : (
              <div className="relative">
                <motion.button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-3 px-4 py-2 bg-card rounded-full border border-border hover:shadow-[var(--shadow-glow)] transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-nunito font-semibold text-foreground">
                        {currentUser?.aptosName || 'Connected Wallet'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {currentUser?.heartTokens} ❤️ HEART
                      </p>
                    </div>
                  </div>
                </motion.button>

                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-64 bg-card rounded-2xl border border-border shadow-[var(--shadow-garden)] p-4"
                    >
                      <div className="space-y-4">
                        <div className="text-center">
                          <h3 className="font-nunito font-semibold text-foreground">
                            {currentUser?.aptosName}
                          </h3>
                          <p className="text-sm text-muted-foreground font-mono">
                            {currentUser?.address.slice(0, 6)}...{currentUser?.address.slice(-4)}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Total Donated</span>
                            <span className="font-nunito font-semibold">
                              {formatAPT(currentUser?.totalDonatedAPT || 0)} APT
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">HEART Tokens</span>
                      <span className="font-nunito font-semibold text-primary">
                        {currentUser?.heartTokens} ❤️ HEART
                      </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Campaigns Supported</span>
                            <span className="font-nunito font-semibold">
                              {currentUser?.donationCount}
                            </span>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-border">
                          <Link
                            to="/dashboard"
                            className="block w-full text-left px-3 py-2 text-sm text-foreground hover:bg-primary/10 rounded-lg transition-colors"
                            onClick={() => setShowDropdown(false)}
                          >
                            <User className="w-4 h-4 inline mr-2" />
                            View Dashboard
                          </Link>
                          <button
                            onClick={() => {
                              disconnect();
                              setShowDropdown(false);
                            }}
                            className="block w-full text-left px-3 py-2 text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors"
                          >
                            <LogOut className="w-4 h-4 inline mr-2" />
                            Disconnect
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;