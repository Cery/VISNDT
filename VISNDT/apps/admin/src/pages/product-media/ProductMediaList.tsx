import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Table,
  Button,
  Spin,
  Alert,
  Tag,
  Typography,
  Popconfirm,
  message,
  Image,
  Space,
  Tooltip,
} from 'antd';
import {
  PlusOutlined,
  DownloadOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { productMediaService } from '../../api/product-media.service';
import { fileAssetService } from '../../api/file-asset.service';
import type { ProductMediaItem, MediaType } from '../../types/product-media.types';
import { getFileTypeIcon, formatFileSize } from '../../utils/file-utils';

const { Title, Text } = Typography;

type PageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'empty' }
  | { status: 'success'; data: ProductMediaItem[]; total: number };

interface QueryParams {
  page: number;
  pageSize: number;
}

const MEDIA_TYPE_COLOR_MAP: Record<MediaType, string> = {
  IMAGE: 'blue',
  DOCUMENT: 'green',
  CERTIFICATE: 'orange',
  OTHER: 'default',
};

function ProductMediaList() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [pageState, setPageState] = useState<PageState>({ status: 'loading' });
  const [query, setQuery] = useState<QueryParams>({ page: 1, pageSize: 20 });
  /** Cache of resolved signed URLs keyed by fileAssetId */
  const [signedUrlCache, setSignedUrlCache] = useState<Record<string, string | null>>({});

  const fetchData = useCallback(async () => {
    if (!productId) return;
    setPageState({ status: 'loading' });
    try {
      const result = await productMediaService.list(productId, {
        page: query.page,
        pageSize: query.pageSize,
      });
      if (result.data.length === 0) {
        setPageState({ status: 'empty' });
      } else {
        setPageState({
          status: 'success',
          data: result.data,
          total: result.total,
        });
        // Resolve signed URLs for image previews using inline fileAsset data
        result.data.forEach((item) => {
          const fa = item.fileAsset;
          if (fa && fa.fileType === 'IMAGE' && !(fa.id in signedUrlCache)) {
            fileAssetService
              .getSignedUrl(fa.id)
              .then((url) => {
                setSignedUrlCache((prev) => ({ ...prev, [fa.id]: url }));
              })
              .catch(() => {
                setSignedUrlCache((prev) => ({ ...prev, [fa.id]: null }));
              });
          }
        });
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load media';
      setPageState({ status: 'error', message: errorMessage });
    }
  }, [productId, query, signedUrlCache]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id: string) => {
    if (!productId) return;
    try {
      await productMediaService.remove(productId, id);
      message.success('Media deleted successfully');
      fetchData();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to delete media';
      message.error(errorMessage);
    }
  };

  const handleDownload = async (fileAssetId: string, fileName: string) => {
    try {
      const url = await fileAssetService.getSignedUrl(fileAssetId);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      message.error('Failed to download file');
    }
  };

  const handleTableChange = useCallback(
    (pagination: TablePaginationConfig) => {
      setQuery((prev) => ({
        ...prev,
        page: pagination.current || 1,
        pageSize: pagination.pageSize || 20,
      }));
    },
    [],
  );

  if (pageState.status === 'loading') {
    return (
      <div style={{ textAlign: 'center', padding: '120px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (pageState.status === 'error') {
    return (
      <Alert
        type="error"
        message="Failed to load media"
        description={pageState.message}
        showIcon
        action={
          <Button size="small" onClick={fetchData}>
            Retry
          </Button>
        }
      />
    );
  }

  const columns: ColumnsType<ProductMediaItem> = [
    {
      title: 'Preview',
      key: 'preview',
      width: 80,
      render: (_: unknown, record: ProductMediaItem) => {
        const fa = record.fileAsset ?? null;
        if (!fa) {
          return getFileTypeIcon(record.mediaType);
        }

        if (record.mediaType === 'IMAGE') {
          const signedUrl = signedUrlCache[fa.id];
          return (
            <Image
              alt={fa.fileName}
              src={signedUrl || ''}
              width={48}
              height={48}
              style={{ objectFit: 'cover', borderRadius: 4 }}
              preview={signedUrl ? { mask: <EyeOutlined /> } : false}
              fallback="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjZjVmNWY1Ii8+PHRleHQgeD0iMjQiIHk9IjI0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzk5OSIgZm9udC1zaXplPSI4Ij5JbWc8L3RleHQ+PC9zdmc+"
            />
          );
        }

        return getFileTypeIcon(record.mediaType);
      },
    },
    {
      title: 'File Name',
      key: 'fileName',
      ellipsis: true,
      render: (_: unknown, record: ProductMediaItem) => {
        const fa = record.fileAsset ?? null;
        if (fa) {
          return (
            <div>
              <Text>{fa.fileName}</Text>
              <br />
              <Text type="secondary" style={{ fontSize: 12 }}>
                {formatFileSize(fa.fileSize)} · {fa.mimeType}
              </Text>
            </div>
          );
        }
        return (
          <Text type="secondary" italic>
            No file attached
          </Text>
        );
      },
    },
    {
      title: 'Media Type',
      dataIndex: 'mediaType',
      key: 'mediaType',
      width: 120,
      render: (mediaType: MediaType) => (
        <Tag color={MEDIA_TYPE_COLOR_MAP[mediaType] || 'default'}>
          {mediaType}
        </Tag>
      ),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (title: string | undefined) => title || '-',
    },
    {
      title: 'Primary',
      dataIndex: 'isPrimary',
      key: 'isPrimary',
      width: 80,
      render: (isPrimary: boolean) =>
        isPrimary ? <Tag color="gold">Yes</Tag> : <Tag>No</Tag>,
    },
    {
      title: 'Display Order',
      dataIndex: 'displayOrder',
      key: 'displayOrder',
      width: 120,
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 220,
      render: (_: unknown, record: ProductMediaItem) => {
        const fa = record.fileAsset ?? null;
        return (
          <Space size="small">
            {fa && (
              <Tooltip title="Download file">
                <Button
                  type="link"
                  size="small"
                  icon={<DownloadOutlined />}
                  onClick={() => handleDownload(fa.id, fa.fileName)}
                >
                  Download
                </Button>
              </Tooltip>
            )}
            <Button
              type="link"
              size="small"
              onClick={() =>
                navigate(`/products/${productId}/media/${record.id}/edit`)
              }
            >
              Edit
            </Button>
            <Popconfirm
              title="Delete this media?"
              description="This action cannot be undone."
              onConfirm={() => handleDelete(record.id)}
              okText="Delete"
              cancelText="Cancel"
            >
              <Button type="link" size="small" danger>
                Delete
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <Title level={4} style={{ margin: 0 }}>
          Product Media
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate(`/products/${productId}/media/create`)}
        >
          Add Media
        </Button>
      </div>

      {pageState.status === 'empty' ? (
        <Alert
          type="info"
          message="No Media"
          description="No media has been added to this product yet. Click 'Add Media' to associate an existing FileAsset."
          showIcon
        />
      ) : (
        <Table<ProductMediaItem>
          columns={columns}
          dataSource={pageState.data}
          rowKey="id"
          onChange={handleTableChange}
          pagination={{
            current: query.page,
            pageSize: query.pageSize,
            total: pageState.total,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
          }}
        />
      )}
    </div>
  );
}

export default ProductMediaList;