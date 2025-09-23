import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Home, Store, BarChart3, LogOut, User, Award, Lock, Vote, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useIsMobile } from '../hooks/use-mobile';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';
import { useState } from 'react';

const Navigation = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Marketplace', href: '/marketplace', icon: Store },
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3, requiresAuth: true },
    { name: 'My Badges', href: '/badges', icon: Award, requiresAuth: true },
    { name: 'Staking', href: '/staking', icon: Lock, requiresAuth: true },
    { name: 'Governance', href: '/governance', icon: Vote, requiresAuth: true },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-garden border-b border-border/50"
    >
      <div className="container mx-auto px-4">
        <div className={`flex items-center justify-between ${isMobile ? 'h-14' : 'h-16'}`}>
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Heart className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} text-primary`} fill="currentColor" />
            <span className={`${isMobile ? 'text-lg' : 'text-xl'} font-shadows text-foreground`}>
              CharityRewards
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map(({ name, href, icon: Icon, requiresAuth }) => {
              if (requiresAuth && !isAuthenticated) return null;
              
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

          {/* Mobile Menu + Authentication */}
          <div className="flex items-center space-x-2">
            {/* Mobile Menu */}
            {isMobile && (
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="md:hidden">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 bg-background/95 backdrop-blur-md">
                  <SheetHeader>
                    <SheetTitle className="flex items-center space-x-2">
                      <Heart className="w-6 h-6 text-primary" fill="currentColor" />
                      <span className="font-shadows">CharityRewards</span>
                    </SheetTitle>
                  </SheetHeader>
                  
                  <div className="flex flex-col space-y-4 mt-8">
                    {navigation.map(({ name, href, icon: Icon, requiresAuth }) => {
                      if (requiresAuth && !isAuthenticated) return null;
                      
                      return (
                        <Link
                          key={name}
                          to={href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                            isActive(href)
                              ? 'bg-primary text-primary-foreground'
                              : 'text-foreground hover:text-primary hover:bg-primary/10'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="font-nunito font-medium text-base">{name}</span>
                        </Link>
                      );
                    })}
                    
                    {/* Mobile User Profile */}
                    {isAuthenticated && user && (
                      <>
                        <div className="border-t border-border mt-6 pt-6">
                          <div className="flex items-center space-x-3 px-4 py-3">
                            {user.avatar ? (
                              <img 
                                src={user.avatar} 
                                alt={user.name}
                                className="w-8 h-8 rounded-full"
                              />
                            ) : (
                              <User className="w-8 h-8 text-muted-foreground" />
                            )}
                            <div>
                              <p className="font-nunito font-medium text-foreground">{user.name}</p>
                              <p className="text-xs text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            onClick={() => {
                              logout();
                              setMobileMenuOpen(false);
                            }}
                            className="w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-50 mt-2"
                          >
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            )}

            {/* Desktop Authentication */}
            <div className="hidden md:flex items-center">
              {!isAuthenticated ? (
                <Link to="/login">
                  <Button variant="premium" size="sm">
                    Login
                  </Button>
                </Link>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2 px-4 py-2">
                      {user?.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={user.name}
                          className="w-6 h-6 rounded-full"
                        />
                      ) : (
                        <User className="w-4 h-4" />
                      )}
                      <span className="text-sm font-nunito">{user?.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-background/95 backdrop-blur-md">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{user?.name}</p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                        <p className="text-xs text-muted-foreground capitalize">
                          via {user?.loginMethod}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-600">
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {/* Mobile Login Button */}
            {isMobile && !isAuthenticated && (
              <Link to="/login">
                <Button variant="premium" size="sm" className="text-xs px-3 py-1">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navigation;