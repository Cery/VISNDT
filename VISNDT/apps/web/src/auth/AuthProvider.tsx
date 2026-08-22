'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { login as apiLogin, register as apiRegister, logout as apiLogout, getMe } from '@/services/auth.service';
import { clearCsrfToken } from '@/lib/csrf';
import type { AuthUser } from '@/services/auth.service';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  /** D1 fix：认证服务不可用（网络异常 / 服务中断 / 5xx）时为 true，区别于“未登录”。 */
  authError: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name?: string, inviteToken?: string) => Promise<void>;
  /** D1 fix：重新请求 /auth/me，用于错误态重试。 */
  retryAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(false);

  const resolveMe = useCallback(async () => {
    try {
      const currentUser = await getMe();
      setUser(currentUser);
      setAuthError(false);
    } catch {
      // 未登录返回 null 属正常；仅异常时进入错误态
      setAuthError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check auth status on mount via /auth/me (cookie-based)
  useEffect(() => {
    void resolveMe();
  }, [resolveMe]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await apiLogin({ email, password });
    setUser(res.user);
    setAuthError(false);
  }, []);

  const logout = useCallback(async () => {
    await apiLogout();
    clearCsrfToken();
    setUser(null);
    setAuthError(false);
  }, []);

  const register = useCallback(
    async (email: string, password: string, name?: string, inviteToken?: string) => {
      const res = await apiRegister({ email, password, name, inviteToken });
      setUser(res.user);
      setAuthError(false);
    },
    [],
  );

  const retryAuth = useCallback(async () => {
    setIsLoading(true);
    await resolveMe();
  }, [resolveMe]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        authError,
        login,
        logout,
        register,
        retryAuth,
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
