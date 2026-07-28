import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Descriptions,
  Tag,
  Spin,
  Alert,
  Button,
  Space,
  Table,
  Empty,
  Typography,
  Image,
  List,
  Row,
  Col,
  message,
} from 'antd';
import {
  ArrowLeftOutlined,
  EditOutlined,
  PictureOutlined,
  DownloadOutlined,
  FileImageOutlined,
  FileTextOutlined,
  FileProtectOutlined,
  FileUnknownOutlined,
} from '@ant-design/icons';
import { productService } from '../api';
import type { ProductDetail, ProductParameterValue } from '../types';

const { Title, Text } = Typography;

/** Get file type icon based on mediaType */
function getFileTypeIcon(mediaType: string): React.ReactNode {
  const iconStyle = { fontSize: 24 };
  switch (mediaType) {
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

/** Extended media type that may include fileAssetId from backend */
interface MediaItem {
  id: string;
  productId: string;
  mediaType: string;
  title?: string;
  url?: string;
  fileAssetId?: string;
  description?: string;
  isPrimary?: boolean;
  fileAsset?: {
    id: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
    fileType: string;
  };
}

type PageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: ProductDetail };

const STATUS_COLOR: Record<string, string> = {
  ACTIVE: 'green',
  DRAFT: 'orange',
  INACTIVE: 'red',
};

const PARAM_COLUMNS = [
  {
    title: 'Parameter Name',
    dataIndex: ['parameterDefinition', 'name'],
    key: 'name',
  },
  {
    title: 'Code',
    dataIndex: ['parameterDefinition', 'code'],
    key: 'code',
  },
  {
    title: 'Data Type',
    dataIndex: ['parameterDefinition', 'dataType'],
    key: 'dataType',
    width: 120,
  },
  {
    title: 'Unit',
    dataIndex: ['parameterDefinition', 'unit'],
    key: 'unit',
    width: 100,
    render: (v: string | undefined) => v || '-',
  },
  {
    title: 'Value',
    key: 'value',
    render: (_: unknown, record: ProductParameterValue) =>
      record.value ?? record.valueNumber ?? '-',
  },
];

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pageState, setPageState] = useState<PageState>({ status: 'loading' });

  const fetchDetail = useCallback(async () => {
    if (!id) return;
    setPageState({ status: 'loading' });
    try {
      const data = await productService.getById(id);
      setPageState({ status: 'success', data });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load product detail';
      setPageState({ status: 'error', message });
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  if (pageState.status === 'loading') {
    return (
      <div style={{ textAlign: 'center', padding: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (pageState.status === 'error') {
    return (
      <Alert
        type="error"
        message="Failed to Load Product"
        description={pageState.message}
        showIcon
        action={
          <Space>
            <Button onClick={fetchDetail}>Retry</Button>
            <Button onClick={() => navigate('/products')} icon={<ArrowLeftOutlined />}>
              Back to List
            </Button>
          </Space>
        }
      />
    );
  }

  const product = pageState.data;

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/products')}>
          Back to List
        </Button>
        <Button
          icon={<EditOutlined />}
          onClick={() => navigate(`/products/${id}/edit`)}
        >
          Edit Product
        </Button>
        <Button
          icon={<PictureOutlined />}
          onClick={() => navigate(`/products/${id}/media`)}
        >
          Manage Media
        </Button>
      </Space>

      <Title level={3}>{product.name}</Title>

      <Card title="Basic Information" style={{ marginBottom: 16 }}>
        <Descriptions bordered column={{ xs: 1, sm: 2 }}>
          <Descriptions.Item label="Name">{product.name}</Descriptions.Item>
          <Descriptions.Item label="Model">{product.model || '-'}</Descriptions.Item>
          <Descriptions.Item label="Category">
            {product.category?.name || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={STATUS_COLOR[product.status] || 'default'}>{product.status}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Created At">
            {new Date(product.createdAt).toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label="Updated At">
            {new Date(product.updatedAt).toLocaleString()}
          </Descriptions.Item>
        </Descriptions>
        {product.description && (
          <Descriptions bordered column={1} style={{ marginTop: 16 }}>
            <Descriptions.Item label="Description">{product.description}</Descriptions.Item>
          </Descriptions>
        )}
      </Card>

      <Card title="Product Parameters" style={{ marginBottom: 16 }}>
        {product.parameterValues && product.parameterValues.length > 0 ? (
          <Table
            dataSource={product.parameterValues}
            columns={PARAM_COLUMNS}
            rowKey="id"
            pagination={false}
            size="small"
          />
        ) : (
          <Empty description="No parameters defined" />
        )}
      </Card>

      <Card title="Product Media">
        {product.media && product.media.length > 0 ? (
          (() => {
            const mediaItems = product.media as MediaItem[];
            const images = mediaItems.filter((m) => m.mediaType === 'IMAGE');
            const documents = mediaItems.filter((m) => m.mediaType !== 'IMAGE');

            const handleDownload = (item: MediaItem) => {
              const url = item.url || (item.fileAssetId ? `/api/v1/files/${item.fileAssetId}/download` : null);
              if (url) {
                const link = document.createElement('a');
                link.href = url;
                link.download = item.title || 'download';
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              } else {
                message.warning('No download URL available');
              }
            };

            return (
              <>
                {/* Image Gallery */}
                {images.length > 0 && (
                  <div style={{ marginBottom: documents.length > 0 ? 24 : 0 }}>
                    <Title level={5} style={{ marginBottom: 12 }}>
                      <FileImageOutlined /> Product Images ({images.length})
                    </Title>
                    <Image.PreviewGroup>
                      <Row gutter={[16, 16]}>
                        {images.map((item) => (
                          <Col xs={12} sm={8} md={6} key={item.id}>
                            <Card
                              size="small"
                              hoverable
                              cover={
                                item.url ? (
                                  <Image
                                    alt={item.title || 'Product image'}
                                    src={item.url}
                                    preview={{ mask: 'Preview' }}
                                    height={160}
                                    style={{ objectFit: 'cover' }}
                                    fallback="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE2MCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjEwMCIgeT0iODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjOTk5IiBmb250LXNpemU9IjE0Ij5JbWFnZTwvdGV4dD48L3N2Zz4="
                                  />
                                ) : (
                                  <div
                                    style={{
                                      height: 160,
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      background: '#fafafa',
                                    }}
                                  >
                                    {getFileTypeIcon('IMAGE')}
                                  </div>
                                )
                              }
                              actions={[
                                <Button
                                  type="link"
                                  size="small"
                                  icon={<DownloadOutlined />}
                                  onClick={() => handleDownload(item)}
                                  key="download"
                                >
                                  Download
                                </Button>,
                              ]}
                            >
                              <Card.Meta
                                title={item.title || 'Untitled image'}
                                description={
                                  item.isPrimary ? (
                                    <Tag color="gold">Primary</Tag>
                                  ) : undefined
                                }
                              />
                            </Card>
                          </Col>
                        ))}
                      </Row>
                    </Image.PreviewGroup>
                  </div>
                )}

                {/* Document List */}
                {documents.length > 0 && (
                  <div>
                    <Title level={5} style={{ marginBottom: 12 }}>
                      <FileTextOutlined /> Product Documents ({documents.length})
                    </Title>
                    <List
                      dataSource={documents}
                      itemLayout="horizontal"
                      renderItem={(item: MediaItem) => (
                        <List.Item
                          actions={[
                            <Button
                              type="link"
                              icon={<DownloadOutlined />}
                              onClick={() => handleDownload(item)}
                              key="download"
                            >
                              Download
                            </Button>,
                          ]}
                        >
                          <List.Item.Meta
                            avatar={getFileTypeIcon(item.mediaType)}
                            title={item.title || 'Untitled document'}
                            description={
                              <Space size="middle">
                                <Tag>{item.mediaType}</Tag>
                                {item.isPrimary && (
                                  <Tag color="gold">Primary</Tag>
                                )}
                                {item.fileAsset?.fileName && (
                                  <Text type="secondary">
                                    {item.fileAsset.fileName}
                                  </Text>
                                )}
                              </Space>
                            }
                          />
                        </List.Item>
                      )}
                    />
                  </div>
                )}
              </>
            );
          })()
        ) : (
          <Empty description="No media attached">
            <Button
              type="primary"
              icon={<PictureOutlined />}
              onClick={() => navigate(`/products/${id}/media`)}
            >
              Add Media
            </Button>
          </Empty>
        )}
      </Card>
    </div>
  );
}