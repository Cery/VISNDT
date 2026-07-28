import { apiClient } from './client';
import type { UploadResponse, FileAsset } from '../types/file-asset.types';

const FILES_BASE = '/files';

export const fileAssetService = {
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
};