import { apiClient } from '../api';
import { authStore } from '../stores/auth.store';
import type { AuthUser } from './auth.types';

interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    user: {
      id: string;
      email: string;
      name: string | null;
      organizationId: string | null;
    };
  };
}

export async function login(email: string, password: string): Promise<void> {
  const body = (await apiClient.post('/auth/login', {
    email,
    password,
  })) as unknown as LoginResponse;

  const { accessToken, user } = body.data;

  const authUser: AuthUser = {
    id: user.id,
    email: user.email,
    name: user.name ?? undefined,
    role: 'ADMIN',
    organizationId: user.organizationId ?? undefined,
  };

  authStore.getState().setAuth(accessToken, authUser);
}

export function logout(): void {
  authStore.getState().clearAuth();
}