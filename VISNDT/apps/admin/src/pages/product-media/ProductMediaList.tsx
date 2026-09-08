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
  Row,
  Col,
  Card,
  Statistic,
  Modal,
  Upload,
  Select,
} from 'antd';
import {
  PlusOutlined,
  DownloadOutlined,
  EyeOutlined,
  FileImageOutlined,
  FileTextOutlined,
  FileProtectOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { productMediaService } from '../../api/product-media.service';
import { fileAssetService } from '../../api/file-asset.service';
import { extractErrorMessage } from '../../api/client';
import { VISNDT_COLORS } from '../../components/design-system/tokens';
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

const MEDIA_TYPE_LABEL_MAP: Record<string, string> = {
  IMAGE: '图片',
  DOCUMENT: '文档',
  CERTIFICATE: '证书',
  OTHER: '其他',
};

const MEDIA_TYPE_OPTIONS = [
  { value: 'IMAGE', label: '图片' },
  { value: 'DOCUMENT', label: '文档' },
  { value: 'CERTIFICATE', label: '证书' },
  { value: 'OTHER', label: '其他' },
];

function ProductMediaList() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [pageState, setPageState] = useState<PageState>({ status: 'loading' });
  const [query, setQuery] = useState<QueryParams>({ page: 1, pageSize: 20 });
  /** Cache of resolved signed URLs keyed by fileAssetId */
  const [signedUrlCache, setSignedUrlCache] = useState<Record<string, string | null>>({});
  const [mediaStats, setMediaStats] = useState({ total: 0, images: 0, documents: 0, certificates: 0 });
  /** Batch-upload modal state. */
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [uploadMediaType, setUploadMediaType] = useState<MediaType>('IMAGE');
  const [uploading, setUploading] = useState(false);

  const fetchData = useCallback(async () => {
    if (!productId) return;
    setPageState({ status: 'loading' });
    try {
      const result = await productMediaService.list(productId, {
        page: query.page,
        pageSize: query.pageSize,
      });
      if (result.length === 0) {
        setPageState({ status: 'empty' });
      } else {
        setPageState({
          status: 'success',
          data: result,
          total: result.length,
        });
      }
      // Compute media stats (empty-safe)
      const images = result.filter((i) => i.mediaType === 'IMAGE').length;
      const documents = result.filter((i) => i.mediaType === 'DOCUMENT').length;
      const certificates = result.filter((i) => i.mediaType === 'CERTIFICATE').length;
      setMediaStats({ total: result.length, images, documents, certificates });
      // Resolve signed URLs for image previews using inline fileAsset data
      result.forEach((item) => {
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
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : '加载媒体失败';
      setPageState({ status: 'error', message: errorMessage });
    }
  }, [productId, query, signedUrlCache]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handle删除 = async (id: string) => {
    if (!productId) return;
    try {
      await productMediaService.remove(productId, id);
      message.success('媒体删除成功');
      fetchData();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : '删除媒体失败';
      message.error(errorMessage);
    }
  };

  /** Collect dropped files without triggering default upload. */
  const handleUploadFileSelect = (file: File) => {
    setUploadFiles((prev) => [...prev, file]);
    return false;
  };

  const handleUploadOk = async () => {
    if (!productId) return;
    if (uploadFiles.length === 0) {
      message.warning('请先选择要上传的文件');
      return;
    }
    setUploading(true);
    try {
      const result = await productMediaService.createWithUploadBatch(
        productId,
        uploadFiles,
        { mediaType: uploadMediaType },
      );
      const failCount = result.failed?.length ?? 0;
      if (result.created?.length > 0) {
        message.success(`已上传 ${result.created.length} 个媒体`);
      }
      if (failCount > 0) {
        message.warning(
          `${failCount} 个文件上传失败：` +
            result.failed.map((f) => `${f.fileName} (${f.reason})`).join('；'),
        );
      }
      setUploadFiles([]);
      setUploadOpen(false);
      fetchData();
    } catch (err) {
      message.error(
        extractErrorMessage(err, '批量上传失败'),
      );
    } finally {
      setUploading(false);
    }
  };

  const handle下载 = async (fileAssetId: string, fileName: string) => {
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
      message.error('文件下载失败');
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
        message="加载媒体失败"
        description={pageState.message}
        showIcon
        action={
          <Button size="small" onClick={fetchData}>
            重试
          </Button>
        }
      />
    );
  }

  const columns: ColumnsType<ProductMediaItem> = [
    {
      title: '预览',
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
      title: '文件名',
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
            未附加文件
          </Text>
        );
      },
    },
    {
      title: '媒体类型',
      dataIndex: 'mediaType',
      key: 'mediaType',
      width: 120,
      render: (mediaType: MediaType) => (
        <Tag color={MEDIA_TYPE_COLOR_MAP[mediaType] || 'default'}>
          {MEDIA_TYPE_LABEL_MAP[mediaType] || '未知类型'}
        </Tag>
      ),
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      render: (title: string | undefined) => title || '-',
    },
    {
      title: '主图',
      dataIndex: 'isPrimary',
      key: 'isPrimary',
      width: 80,
      render: (isPrimary: boolean) =>
        isPrimary ? <Tag color="gold">是</Tag> : <Tag>否</Tag>,
    },
    {
      title: '显示顺序',
      dataIndex: 'displayOrder',
      key: 'displayOrder',
      width: 120,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: '操作',
      key: 'actions',
      width: 220,
      fixed: 'right' as const,
      render: (_: unknown, record: ProductMediaItem) => {
        const fa = record.fileAsset ?? null;
        return (
          <Space size="small">
            {fa && (
              <Tooltip title="下载文件">
                <Button
                  type="link"
                  size="small"
                  icon={<DownloadOutlined />}
                  onClick={() => handle下载(fa.id, fa.fileName)}
                >
                  下载
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
              编辑
            </Button>
            <Popconfirm
              title="确定要删除此媒体吗？"
              description="此操作无法撤销。"
              onConfirm={() => handle删除(record.id)}
              okText="删除"
              cancelText="取消"
            >
              <Button type="link" size="small" danger>
                删除
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
          产品媒体
        </Title>
        <Space>
          <Button
            icon={<UploadOutlined />}
            onClick={() => {
              setUploadFiles([]);
              setUploadOpen(true);
            }}
          >
            批量上传
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate(`/products/${productId}/media/create`)}
          >
            添加媒体
          </Button>
        </Space>
      </div>

      {/* Media Statistics */}
      {mediaStats.total > 0 && (
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col xs={12} sm={6}>
            <Card size="small">
              <Statistic title="媒体总数" value={mediaStats.total} />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card size="small">
              <Statistic title="图片" value={mediaStats.images} prefix={<FileImageOutlined />} valueStyle={{ color: '#2563eb' }} />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card size="small">
              <Statistic title="文档" value={mediaStats.documents} prefix={<FileTextOutlined />} valueStyle={{ color: VISNDT_COLORS.success }} />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card size="small">
              <Statistic title="证书" value={mediaStats.certificates} prefix={<FileProtectOutlined />} valueStyle={{ color: '#fa8c16' }} />
            </Card>
          </Col>
        </Row>
      )}

      {pageState.status === 'empty' ? (
        <Alert
          type="info"
          message="暂无媒体"
          description="该产品尚未添加媒体文件，请点击「添加媒体」关联文件。"
          showIcon
        />
      ) : (
        <Table<ProductMediaItem>
          columns={columns}
          dataSource={pageState.data}
          rowKey="id"
          scroll={{ x: 'max-content' }}
          onChange={handleTableChange}
          pagination={{
            current: query.page,
            pageSize: query.pageSize,
            total: pageState.total,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
            showTotal: (total, range) => `${range[0]}-${range[1]} / 共 ${total} 条`,
          }}
        />
      )}

      {/* 批量上传弹窗 */}
      <Modal
        title="批量上传媒体"
        open={uploadOpen}
        onOk={handleUploadOk}
        onCancel={() => setUploadOpen(false)}
        okText="上传"
        cancelText="取消"
        confirmLoading={uploading}
        maskClosable={false}
        width={560}
      >
        <Space direction="vertical" style={{ width: '100%' }} size={16}>
          <Upload.Dragger
            multiple
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv"
            showUploadList={false}
            beforeUpload={handleUploadFileSelect}
            fileList={uploadFiles.map((f, i) => ({
              uid: `-${i}`,
              name: f.name,
              status: 'done',
            }))}
          >
            <p className="ant-upload-drag-icon">
              <UploadOutlined />
            </p>
            <p className="ant-upload-text">点击或拖拽文件到此处批量上传</p>
            <p className="ant-upload-hint">
              可一次选择多个文件（最多 10 个，单个 ≤ 10MB），所选文件将同时关联到该产品
            </p>
          </Upload.Dragger>

          <Space wrap>
            <span>媒体类型：</span>
            <Select
              value={uploadMediaType}
              onChange={(v) => setUploadMediaType(v as MediaType)}
              options={MEDIA_TYPE_OPTIONS}
              style={{ width: 140 }}
            />
          </Space>

          {uploadFiles.length > 0 && (
            <ul style={{ maxHeight: 160, overflow: 'auto', paddingLeft: 18 }}>
              {uploadFiles.map((f, i) => (
                <li key={i}>{f.name}</li>
              ))}
            </ul>
          )}
        </Space>
      </Modal>
    </div>
  );
}

export default ProductMediaList;