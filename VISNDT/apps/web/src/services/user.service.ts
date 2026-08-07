/**
 * User Service Layer
 *
 * Encapsulates User API calls for profile management.
 */
import { apiClient } from '@/lib/api-client';

export interface UpdateProfilePayload {
  name?: string;
  passwordHash?: string;
}

/**
 * Update current user's profile.
 * PATCH /users/:id
 */
export async function updateUserProfile(userId: string, payload: UpdateProfilePayload): Promise<void> {
  await apiClient(`/users/${userId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}