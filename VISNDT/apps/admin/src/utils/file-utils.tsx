import {
  FileImageOutlined,
  FileTextOutlined,
  FileProtectOutlined,
  FileUnknownOutlined,
} from '@ant-design/icons';

export type FileType = 'IMAGE' | 'DOCUMENT' | 'CERTIFICATE' | 'OTHER';

/**
 * Get appropriate icon element for a file type.
 */
export function getFileTypeIcon(fileType: FileType): React.ReactNode {
  const iconStyle = { fontSize: 24 };

  switch (fileType) {
    case 'IMAGE':
      return <FileImageOutlined style={iconStyle} />;
    case 'DOCUMENT':
      return <FileTextOutlined style={iconStyle} />;
    case 'CERTIFICATE':
      return <FileProtectOutlined style={iconStyle} />;
    default:
      return <FileUnknownOutlined style={iconStyle} />;
  }
}

/**
 * Format file size in bytes to a human-readable string.
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}