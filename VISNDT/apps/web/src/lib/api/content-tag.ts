import { apiClient } from '@/lib/api-client';
import type { ContentTag } from '@/types/content';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
}

export async function getTags(): Promise<ContentTag[]> {
  const res = await apiClient<ApiResponse<ContentTag[]>>('/content/tags');
  return res.data;
}

export async function getTagBySlug(slug: string): Promise<ContentTag> {
  const res = await apiClient<ApiResponse<ContentTag>>(`/content/tags/${slug}`);
  return res.data;
}