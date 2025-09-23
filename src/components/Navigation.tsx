import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Home, Store, BarChart3 } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';

const Navigation = () => {
  const { connect, isConnected } = useWallet();
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Marketplace', href: '/marketplace', icon: Store },
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3, requiresAuth: true },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-garden border-b border-border/50"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Heart className="w-8 h-8 text-primary" fill="currentColor" />
            <span className="text-xl font-shadows text-foreground">
              CharityRewards
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map(({ name, href, icon: Icon, requiresAuth }) => {
              if (requiresAuth && !isConnected) return null;
              
              return (
                <Link
                  key={name}
                  to={href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${
                    isActive(href)
                      ? 'bg-primary text-primary-foreground shadow-[0_0_20px_hsl(var(--vibrant-rose)/0.4)]'
                      : 'text-foreground hover:text-primary hover:bg-primary/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-nunito font-medium">{name}</span>
                </Link>
              );
            })}
          </div>

          {/* Wallet Connection */}
          <div className="flex items-center">
            {!isConnected ? (
              <button
                onClick={connect}
                className="btn-garden-primary text-sm"
              >
                Connect Wallet
              </button>
            ) : (
              <div className="flex items-center space-x-2 px-4 py-2 bg-card rounded-full border border-border">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm font-nunito text-foreground">Connected</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navigation;