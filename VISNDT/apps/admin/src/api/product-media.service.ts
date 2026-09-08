import { apiClient } from './client';
import type {
  ProductMediaItem,
  ProductMediaListResponse,
  CreateProductMediaDto,
  UpdateProductMediaDto,
} from '../types/product-media.types';

interface ApiResponseWrapper<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
}

export const productMediaService = {
  async list(
    productId: string,
    params?: { page?: number; pageSize?: number },
  ): Promise<ProductMediaListResponse> {
    const response = (await apiClient.get(`/products/${productId}/media`, {
      params,
    })) as unknown as ApiResponseWrapper<ProductMediaListResponse>;
    return response.data;
  },

  async getById(productId: string, id: string): Promise<ProductMediaItem> {
    const response = (await apiClient.get(
      `/products/${productId}/media/${id}`,
    )) as unknown as ApiResponseWrapper<ProductMediaItem>;
    return response.data;
  },

  async create(
    productId: string,
    data: CreateProductMediaDto,
  ): Promise<ProductMediaItem> {
    const response = (await apiClient.post(
      `/products/${productId}/media`,
      data,
    )) as unknown as ApiResponseWrapper<ProductMediaItem>;
    return response.data;
  },

  /**
   * Atomic upload-create: upload file + create ProductMedia in one request.
   * Eliminates the orphan window between upload and create.
   *
   * @param productId - Product UUID
   * @param file - File object from file input
   * @param metadata - Media metadata (mediaType, title, etc.)
   * @returns Created ProductMedia with populated fileAsset
   */
  async createWithUpload(
    productId: string,
    file: File,
    metadata: CreateProductMediaDto,
  ): Promise<ProductMediaItem> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('mediaType', metadata.mediaType);
    if (metadata.title) formData.append('title', metadata.title);
    if (metadata.description) formData.append('description', metadata.description);
    if (metadata.isPrimary !== undefined) formData.append('isPrimary', String(metadata.isPrimary));
    if (metadata.displayOrder !== undefined) formData.append('displayOrder', String(metadata.displayOrder));

    const response = (await apiClient.post(
      `/products/${productId}/media/upload`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    )) as unknown as ApiResponseWrapper<ProductMediaItem>;
    return response.data;
  },

  /**
   * Batch upload-create product media in one request.
   * Each file travels as a repeated `files` multipart field; all files share
   * the provided metadata (mediaType required). displayOrder is auto-incremented
   * by the backend.
   * Calls POST /products/:productId/media/batch-upload (ADMIN only, max 10 files).
   * @param productId - Product UUID
   * @param files - Files to upload
   * @param metadata - Shared media metadata (mediaType required)
   * @returns Aggregated created items and per-file failures
   */
  async createWithUploadBatch(
    productId: string,
    files: File[],
    metadata: Pick<CreateProductMediaDto, 'mediaType'> & Partial<CreateProductMediaDto>,
  ): Promise<{ created: ProductMediaItem[]; failed: { fileName: string; reason: string }[] }> {
    const formData = new FormData();
    for (const f of files) formData.append('files', f);
    formData.append('mediaType', metadata.mediaType);
    if (metadata.title) formData.append('title', metadata.title);
    if (metadata.description) formData.append('description', metadata.description);

    const response = (await apiClient.post(
      `/products/${productId}/media/batch-upload`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    )) as unknown as ApiResponseWrapper<{
      created: ProductMediaItem[];
      failed: { fileName: string; reason: string }[];
    }>;
    return response.data;
  },

  async update(
    productId: string,
    id: string,
    data: UpdateProductMediaDto,
  ): Promise<ProductMediaItem> {
    const response = (await apiClient.patch(
      `/products/${productId}/media/${id}`,
      data,
    )) as unknown as ApiResponseWrapper<ProductMediaItem>;
    return response.data;
  },

  async remove(productId: string, id: string): Promise<void> {
    await apiClient.delete(`/products/${productId}/media/${id}`);
  },
};