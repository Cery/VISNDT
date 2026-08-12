import { apiClient } from './client';
import type {
  Content,
  ContentListResponse,
  QueryContentParams,
  CreateContentDto,
  UpdateContentDto,
  ContentMedia,
  CreateContentMediaDto,
  UpdateContentMediaDto,
  ContentRevisionSummary,
  ContentRevisionDetail,
  ContentApprovalTimelineItem,
} from '../types/content.types';

interface ApiResponseWrapper<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
}

export const contentService = {
  async getList(params?: QueryContentParams): Promise<ContentListResponse> {
    const response = (await apiClient.get('/content', {
      params,
    })) as unknown as ApiResponseWrapper<ContentListResponse>;
    return response.data;
  },

  async getById(id: string): Promise<Content> {
    const response = (await apiClient.get(
      `/content/${id}`,
    )) as unknown as ApiResponseWrapper<Content>;
    return response.data;
  },

  async getBySlug(slug: string): Promise<Content> {
    const response = (await apiClient.get(
      `/content/by-slug/${slug}`,
    )) as unknown as ApiResponseWrapper<Content>;
    return response.data;
  },

  async create(data: CreateContentDto): Promise<Content> {
    const response = (await apiClient.post(
      '/content',
      data,
    )) as unknown as ApiResponseWrapper<Content>;
    return response.data;
  },

  async update(id: string, data: UpdateContentDto): Promise<Content> {
    const response = (await apiClient.patch(
      `/content/${id}`,
      data,
    )) as unknown as ApiResponseWrapper<Content>;
    return response.data;
  },

  async submit(id: string): Promise<Content> {
    const response = (await apiClient.post(
      `/content/${id}/submit`,
    )) as unknown as ApiResponseWrapper<Content>;
    return response.data;
  },

  async review(id: string): Promise<Content> {
    const response = (await apiClient.post(
      `/content/${id}/review`,
    )) as unknown as ApiResponseWrapper<Content>;
    return response.data;
  },

  async publish(id: string): Promise<Content> {
    const response = (await apiClient.post(
      `/content/${id}/publish`,
    )) as unknown as ApiResponseWrapper<Content>;
    return response.data;
  },

  async archive(id: string): Promise<Content> {
    const response = (await apiClient.post(
      `/content/${id}/archive`,
    )) as unknown as ApiResponseWrapper<Content>;
    return response.data;
  },

  // ---- Content Media ----

  async listMedia(contentId: string): Promise<ContentMedia[]> {
    const response = (await apiClient.get(
      `/content/${contentId}/media`,
    )) as unknown as ApiResponseWrapper<ContentMedia[]>;
    return response.data;
  },

  async createMedia(
    contentId: string,
    data: CreateContentMediaDto,
  ): Promise<ContentMedia> {
    const response = (await apiClient.post(
      `/content/${contentId}/media`,
      data,
    )) as unknown as ApiResponseWrapper<ContentMedia>;
    return response.data;
  },

  /**
   * Atomic upload-create: upload file + create ContentMedia in one request.
   */
  async createMediaWithUpload(
    contentId: string,
    file: File,
    metadata: CreateContentMediaDto,
  ): Promise<ContentMedia> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', metadata.type);
    if (metadata.caption) formData.append('caption', metadata.caption);
    if (metadata.altText) formData.append('altText', metadata.altText);
    if (metadata.sortOrder !== undefined)
      formData.append('sortOrder', String(metadata.sortOrder));

    const response = (await apiClient.post(
      `/content/${contentId}/media/upload`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    )) as unknown as ApiResponseWrapper<ContentMedia>;
    return response.data;
  },

  async updateMedia(
    contentId: string,
    id: string,
    data: UpdateContentMediaDto,
  ): Promise<ContentMedia> {
    const response = (await apiClient.patch(
      `/content/${contentId}/media/${id}`,
      data,
    )) as unknown as ApiResponseWrapper<ContentMedia>;
    return response.data;
  },

  async removeMedia(contentId: string, id: string): Promise<void> {
    await apiClient.delete(`/content/${contentId}/media/${id}`);
  },

  // ---- Content Revision History ----

  async listRevisions(contentId: string): Promise<ContentRevisionSummary[]> {
    const response = (await apiClient.get(
      `/content/${contentId}/revisions`,
    )) as unknown as ApiResponseWrapper<ContentRevisionSummary[]>;
    return response.data;
  },

  async getRevision(
    contentId: string,
    version: number,
  ): Promise<ContentRevisionDetail> {
    const response = (await apiClient.get(
      `/content/${contentId}/revisions/${version}`,
    )) as unknown as ApiResponseWrapper<ContentRevisionDetail>;
    return response.data;
  },

  // ---- Content Approval Timeline ----

  async getApprovalTimeline(contentId: string): Promise<ContentApprovalTimelineItem[]> {
    const response = (await apiClient.get(
      `/content/${contentId}/approval-timeline`,
    )) as unknown as ApiResponseWrapper<ContentApprovalTimelineItem[]>;
    return response.data;
  },
};