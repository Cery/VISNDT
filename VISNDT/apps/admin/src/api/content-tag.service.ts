import { apiClient } from './client';
import type { ContentTag, ContentTagType } from '../types';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
}

export const contentTagService = {
  async getList(): Promise<ContentTag[]> {
    const res = (await apiClient.get('/content/tags')) as unknown as ApiResponse<ContentTag[]>;
    return res.data;
  },

  async getBySlug(slug: string): Promise<ContentTag> {
    const res = (await apiClient.get(`/content/tags/${slug}`)) as unknown as ApiResponse<ContentTag>;
    return res.data;
  },

  async create(data: { name: string; slug: string; type: ContentTagType; description?: string }): Promise<ContentTag> {
    const res = (await apiClient.post('/content/tags', data)) as unknown as ApiResponse<ContentTag>;
    return res.data;
  },

  async update(id: string, data: { name?: string; slug?: string; type?: ContentTagType; description?: string }): Promise<ContentTag> {
    const res = (await apiClient.patch(`/content/tags/${id}`, data)) as unknown as ApiResponse<ContentTag>;
    return res.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/content/tags/${id}`);
  },

  async getContentTags(contentId: string): Promise<ContentTag[]> {
    const res = (await apiClient.get(`/content/${contentId}/tags`)) as unknown as ApiResponse<ContentTag[]>;
    return res.data;
  },

  async assignTag(contentId: string, tagId: string): Promise<void> {
    await apiClient.post(`/content/${contentId}/tags`, { tagId });
  },

  async removeTag(contentId: string, tagId: string): Promise<void> {
    await apiClient.delete(`/content/${contentId}/tags/${tagId}`);
  },
};