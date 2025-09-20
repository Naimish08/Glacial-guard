import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, signIn, signOut, getUser, resendConfirmation } from './supabaseClient';

type UserRole = 'admin' | 'citizen' | null;

type AuthContextType = {
  user: any;
  role: UserRole;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resendEmailConfirmation: (email: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);

  const deriveRole = (u: any): UserRole => {
    if (!u) return null;
    
    // Check for role in multiple places
    const possibleRole = u?.app_metadata?.role || 
                        u?.user_metadata?.role || 
                        u?.user_metadata?.user_role ||
                        u?.role;
    
    // For testing purposes, you can set admin role based on email
    // Remove this in production and use proper role management
    if (u?.email && u.email.includes('admin')) {
      console.log('🔑 Admin role assigned based on email:', u.email);
      return 'admin';
    }
    
    if (possibleRole === 'admin') {
      console.log('🔑 Admin role found in metadata:', possibleRole);
      return 'admin';
    }
    
    console.log('👤 Citizen role assigned for:', u.email);
    return 'citizen';
  };

  useEffect(() => {
    // Check for user on mount
    getUser()
      .then((u) => {
        setUser(u);
        setRole(deriveRole(u));
      })
      .finally(() => setLoading(false));
    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextUser = session?.user ?? null;
      setUser(nextUser);
      setRole(deriveRole(nextUser));
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await signIn(email, password);
      if (error) {
        // Handle specific email confirmation error
        if (error.message.includes('email not confirmed') || error.message.includes('Email not confirmed')) {
          throw new Error('Please check your email and click the confirmation link before logging in.');
        }
        throw error;
      }
      setUser(data.user);
      setRole(deriveRole(data.user));
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    await signOut();
    setUser(null);
    setRole(null);
    setLoading(false);
  };

  const resendEmailConfirmation = async (email: string) => {
    const { error } = await resendConfirmation(email);
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, login, logout, resendEmailConfirmation }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};