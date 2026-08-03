'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { login as apiLogin, register as apiRegister, logout as apiLogout, getMe } from '@/services/auth.service';
import { clearCsrfToken } from '@/lib/csrf';
import type { AuthUser } from '@/services/auth.service';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name?: string, inviteToken?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check auth status on mount via /auth/me (cookie-based)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const currentUser = await getMe();
      if (!cancelled) {
        setUser(currentUser);
        setIsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await apiLogin({ email, password });
    setUser(res.user);
  }, []);

  const logout = useCallback(async () => {
    await apiLogout();
    clearCsrfToken();
    setUser(null);
  }, []);

  const register = useCallback(
    async (email: string, password: string, name?: string, inviteToken?: string) => {
      const res = await apiRegister({ email, password, name, inviteToken });
      setUser(res.user);
    },
    [],
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}