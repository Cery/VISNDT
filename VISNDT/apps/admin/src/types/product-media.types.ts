export type MediaType = 'IMAGE' | 'DOCUMENT' | 'CERTIFICATE' | 'OTHER';

export interface ProductMediaItem {
  id: string;
  productId: string;
  fileAssetId?: string;
  fileAsset?: import('./file-asset.types').FileAsset | null;
  mediaType: MediaType;
  title?: string;
  description?: string;
  isPrimary: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductMediaDto {
  fileAssetId?: string;
  mediaType: MediaType;
  title?: string;
  description?: string;
  isPrimary?: boolean;
  displayOrder?: number;
}

export interface UpdateProductMediaDto {
  fileAssetId?: string;
  mediaType?: MediaType;
  title?: string;
  description?: string;
  isPrimary?: boolean;
  displayOrder?: number;
}

export interface ProductMediaListResponse {
  data: ProductMediaItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}