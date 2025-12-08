'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '@/lib/api';
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  signin: (email: string, password: string) => Promise<void>;
  signout: () => Promise<void>;
  signup: (data: { email: string; password: string; firstName: string; lastName: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('accessToken');
    if (token) {
      // In a real app, you would validate the token and fetch user data
      setIsAuthenticated(true);
      // For now, we'll just set a mock user
      // In a real implementation, you would call an API to get user data
    }
  }, []);

  const signin = async (email: string, password: string) => {
    try {
      const response = await authApi.signin({ email, password });
      setUser(response.user);
      setIsAuthenticated(true);
    } catch (error) {
      throw error;
    }
  };

  const signout = async () => {
    try {
      await authApi.signout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      // Even if the API call fails, we still want to clear the local state
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('accessToken');
    }
  };

  const signup = async (data: { email: string; password: string; firstName: string; lastName: string }) => {
    try {
      // For signup, we won't automatically sign in the user
      // They'll need to verify their email first
      await authApi.signup(data);
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signin, signout, signup }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}