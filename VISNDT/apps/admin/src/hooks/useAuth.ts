import { useCallback } from 'react';
import { useStore } from 'zustand';
import { authStore } from '../stores/auth.store';
import { login as loginService, logout as logoutService } from '../auth/auth.service';

export function useAuth() {
  const accessToken = useStore(authStore, (s) => s.accessToken);
  const user = useStore(authStore, (s) => s.user);
  const isAuthenticated = useStore(authStore, (s) => s.isAuthenticated);
  const checkTokenExpiry = useStore(authStore, (s) => s.checkTokenExpiry);

  const login = useCallback(async (email: string, password: string) => {
    await loginService(email, password);
  }, []);

  const logout = useCallback(() => {
    logoutService();
  }, []);

  return {
    user,
    accessToken,
    isAuthenticated,
    login,
    logout,
    checkTokenExpiry,
  };
}