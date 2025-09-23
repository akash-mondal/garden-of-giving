import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  loginMethod: 'wallet' | 'google';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithWallet: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock user data
const mockWalletUser: User = {
  id: 'wallet-user-1',
  name: 'Alex Thompson',
  email: 'alex.thompson@example.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
  loginMethod: 'wallet'
};

const mockGoogleUser: User = {
  id: 'google-user-1', 
  name: 'Sarah Chen',
  email: 'sarah.chen@gmail.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
  loginMethod: 'google'
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('auth_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('auth_user');
      }
    }
  }, []);

  const loginWithWallet = async () => {
    setIsLoading(true);
    
    // Simulate wallet connection delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setUser(mockWalletUser);
    localStorage.setItem('auth_user', JSON.stringify(mockWalletUser));
    setIsLoading(false);
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    
    // Simulate Google OAuth delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setUser(mockGoogleUser);
    localStorage.setItem('auth_user', JSON.stringify(mockGoogleUser));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    loginWithWallet,
    loginWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};