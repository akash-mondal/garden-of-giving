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

export const AuthProvider = ({ children }: AuthProviderProps) => {
  // Initialize state with default values to avoid null issues
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Check for existing session on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('auth_user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        if (parsedUser && parsedUser.id) {
          setUser(parsedUser);
        }
      }
    } catch (error) {
      console.error('Error parsing saved user:', error);
      localStorage.removeItem('auth_user');
    }
  }, []);

  const loginWithWallet = async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Simulate wallet connection delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setUser(mockWalletUser);
      localStorage.setItem('auth_user', JSON.stringify(mockWalletUser));
    } catch (error) {
      console.error('Wallet login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Simulate Google OAuth delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUser(mockGoogleUser);
      localStorage.setItem('auth_user', JSON.stringify(mockGoogleUser));
    } catch (error) {
      console.error('Google login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    try {
      setUser(null);
      localStorage.removeItem('auth_user');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: Boolean(user),
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