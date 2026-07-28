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