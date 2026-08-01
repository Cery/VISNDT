/** FileAsset record returned from the backend */
export interface FileAsset {
  id: string;
  entityType: string;
  entityId: string;
  fileType: 'IMAGE' | 'DOCUMENT' | 'CERTIFICATE' | 'OTHER';
  fileName: string;
  storageKey: string;
  mimeType: string;
  fileSize: number;
  uploadedBy: string;
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