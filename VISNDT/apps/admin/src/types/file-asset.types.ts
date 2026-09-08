/** Unified file type taxonomy (aligned with backend FileType enum) */
export type FileType =
  | 'IMAGE'
  | 'DOCUMENT'
  | 'CERTIFICATE'
  | 'SPEC_SHEET'
  | 'ILLUSTRATION'
  | 'OTHER';

/** File lifecycle status (aligned with backend FileAssetStatus enum) */
export type FileAssetStatus = 'DRAFT' | 'ACTIVE' | 'ARCHIVED';

/** FileAsset record returned from the backend */
export interface FileAsset {
  id: string;
  entityType: string;
  entityId: string;
  fileType: FileType;
  fileName: string;
  storageKey: string;
  mimeType: string;
  fileSize: number;
  uploadedBy: string;
  organizationId: string | null;
  status: FileAssetStatus;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Response from POST /files/upload */
export interface UploadResponse {
  status: string;
  message: string;
  data: FileAsset;
}

/** Orphan FileAsset — returned by GET /files/orphans */
export type OrphanFileAsset = FileAsset;

/** Response from GET /files/orphans */
export interface OrphanListResponse {
  status: string;
  message: string;
  data: OrphanFileAsset[];
}

/** Response from POST /files/orphans/cleanup */
export interface CleanupOrphansResponse {
  status: string;
  message: string;
  data: {
    deleted: number;
    failed: string[];
  };
}

/** Unified media-center list item — returned by GET /files (ADMIN only) */
export interface FileAssetListItem {
  id: string;
  entityType: string;
  entityId: string;
  fileType: FileType;
  fileName: string;
  storageKey: string;
  mimeType: string;
  fileSize: number;
  status: FileAssetStatus;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  uploaderName: string | null;
  uploaderEmail: string;
  organizationId: string | null;
  organizationName: string | null;
  organizationType: string | null;
  productMediaCount: number;
  contentMediaCount: number;
}

export interface FileAssetListParams {
  page?: number;
  pageSize?: number;
  fileType?: string;
  entityType?: string;
  organizationId?: string;
  search?: string;
}

export interface FileAssetListResponse {
  items: FileAssetListItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/** Result from POST /files/batch-delete — per-ID safety check outcomes. */
export interface BatchDeleteFailed {
  id: string;
  reason: string;
}

export interface BatchDeleteResult {
  deleted: number;
  failed: BatchDeleteFailed[];
}

/** One failed file in a batch upload — carries a human-readable reason. */
export interface BatchUploadFailed {
  fileName: string;
  reason: string;
}

export interface BatchUploadResult {
  created: FileAsset[];
  failed: BatchUploadFailed[];
}