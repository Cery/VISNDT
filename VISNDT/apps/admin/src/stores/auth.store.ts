import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser } from '../auth';

interface AuthState {
  accessToken: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  tokenExpiresAt: number | null;
  setAuth: (token: string, user: AuthUser) => void;
  clearAuth: () => void;
  checkTokenExpiry: () => boolean;
}

/**
 * Decode JWT payload to extract the `exp` claim.
 * Returns expiration timestamp in milliseconds, or null if unavailable.
 */
function decodeTokenExpiry(token: string): number | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}

export const authStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      user: null,
      isAuthenticated: false,
      tokenExpiresAt: null,

      setAuth: (token: string, user: AuthUser) => {
        const tokenExpiresAt = decodeTokenExpiry(token);
        set({
          accessToken: token,
          user,
          isAuthenticated: true,
          tokenExpiresAt,
        });
      },

      clearAuth: () =>
        set({
          accessToken: null,
          user: null,
          isAuthenticated: false,
          tokenExpiresAt: null,
        }),

      checkTokenExpiry: (): boolean => {
        const { tokenExpiresAt, isAuthenticated } = get();
        if (!isAuthenticated || !tokenExpiresAt) {
          return false;
        }
        if (Date.now() >= tokenExpiresAt) {
          get().clearAuth();
          return false;
        }
        return true;
      },
    }),
    {
      name: 'visndt-auth',
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        tokenExpiresAt: state.tokenExpiresAt,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          const { tokenExpiresAt } = state;
          if (tokenExpiresAt && Date.now() >= tokenExpiresAt) {
            state.clearAuth();
          }
        }
      },
    },
  ),
);