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

/**
 * The `GET /products/:productId/media` endpoint returns a raw array via
 * ApiResponse.data. It is not paginated (full list for the product).
 */
export type ProductMediaListResponse = ProductMediaItem[];