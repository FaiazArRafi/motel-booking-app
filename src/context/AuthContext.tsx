import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth, isLiveFirebaseConfigured } from '../config/firebase';
import { UserProfile } from '../types/auth';
import { authService } from '../services/authService';
import { initLocalStoreIfEmpty } from '../services/localStore';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, pass: string) => Promise<UserProfile>;
  signup: (email: string, pass: string, name: string, phone?: string) => Promise<UserProfile>;
  loginWithGoogle: () => Promise<UserProfile>;
  logout: () => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
  switchDemoRole?: (role: 'guest' | 'admin') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize local store on app boot
  useEffect(() => {
    initLocalStoreIfEmpty();
  }, []);

  useEffect(() => {
    if (!isLiveFirebaseConfigured) {
      // Check stored session in localStorage
      try {
        const stored = localStorage.getItem('motel_current_user');
        if (stored) {
          setUser(JSON.parse(stored));
        }
      } catch (e) {
        console.error('Error reading stored user', e);
      }
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          const profile = await authService.getUserProfile(firebaseUser.uid);
          if (profile) {
            setUser(profile);
          } else {
            const synced = await authService.syncUserProfile(firebaseUser, 'guest');
            setUser(synced);
          }
        } catch (error) {
          console.error('Error syncing auth state profile:', error);
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || 'Guest',
            role: 'guest'
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const profile = await authService.loginWithEmail(email, pass);
      setUser(profile);
      return profile;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, pass: string, name: string, phone?: string) => {
    setLoading(true);
    try {
      const profile = await authService.registerWithEmail(email, pass, name, phone);
      setUser(profile);
      return profile;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const profile = await authService.loginWithGoogle();
      setUser(profile);
      return profile;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    await authService.updateProfile(user.uid, updates);
    setUser(prev => prev ? { ...prev, ...updates } : null);
  };

  // Handy demo helper when working in local mock mode
  const switchDemoRole = (role: 'guest' | 'admin') => {
    if (!user) return;
    const updated = { ...user, role };
    setUser(updated);
    localStorage.setItem('motel_current_user', JSON.stringify(updated));
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        login,
        signup,
        loginWithGoogle,
        logout,
        updateUserProfile,
        switchDemoRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
