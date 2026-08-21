import { apiClient } from './client';
import type { UploadResponse, FileAsset, OrphanListResponse, CleanupOrphansResponse, FileAssetListParams, FileAssetListResponse } from '../types/file-asset.types';

interface ApiResponseWrapper<T> {
  data: T;
  message?: string;
  statusCode?: number;
}

const FILES_BASE = '/files';

export const fileAssetService = {
  /**
   * List all FileAssets (read-only, ADMIN only) for the unified media center.
   * Supports filter/pagination via query params.
   */
  async getFiles(params: FileAssetListParams = {}): Promise<FileAssetListResponse> {
    const response = (await apiClient.get(`${FILES_BASE}`, {
      params,
    })) as unknown as ApiResponseWrapper<FileAssetListResponse>;
    return response.data;
  },

  /**
   * Upload a file to S3/MinIO and create a FileAsset record.
   * @param file - File object from file input or drag-and-drop
   * @returns Created FileAsset record
   */
  async upload(file: File): Promise<FileAsset> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<UploadResponse>(
      `${FILES_BASE}/upload`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    );

    return (response as unknown as UploadResponse).data;
  },

  /**
   * Get a signed URL for file download / preview.
   * Calls GET /files/:id/download and returns the signed URL.
   * @param fileAssetId - ID of the FileAsset
   * @returns Signed URL string for the file
   */
  async getSignedUrl(fileAssetId: string): Promise<string> {
    const response = await apiClient.get<{ url: string } | string>(
      `${FILES_BASE}/${fileAssetId}/download`,
    );

    if (typeof response === 'string') return response;
    if (response && typeof response === 'object' && 'url' in response) {
      return (response as { url: string }).url;
    }
    return String(response);
  },

  /**
   * List orphan FileAssets (no ProductMedia, placeholder entityId).
   * Calls GET /files/orphans (ADMIN only).
   * @returns List of orphan FileAssets
   */
  async getOrphans(): Promise<FileAsset[]> {
    const response = (await apiClient.get(
      `${FILES_BASE}/orphans`,
    )) as unknown as OrphanListResponse;
    return response.data;
  },

  /**
   * Clean up specified orphan FileAssets.
   * Calls POST /files/orphans/cleanup (ADMIN only, max 100 IDs).
   * @param ids - Array of FileAsset IDs to delete
   * @returns Result with deleted count and failed IDs
   */
  async cleanupOrphans(ids: string[]): Promise<{ deleted: number; failed: string[] }> {
    const response = (await apiClient.post(
      `${FILES_BASE}/orphans/cleanup`,
      { ids },
    )) as unknown as CleanupOrphansResponse;
    return response.data;
  },

  async batchDelete(ids: string[]): Promise<{ count: number }> {
    const response = (await apiClient.post(`${FILES_BASE}/batch-delete`, { ids })) as unknown as ApiResponseWrapper<{ count: number }>;
    return response.data;
  },
};