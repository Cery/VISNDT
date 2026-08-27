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
  Breadcrumb,
  Statistic,
  Tooltip,
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
  AppstoreOutlined,
  SettingOutlined,
  ShopOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import { productService } from '../api';
import type { ProductDetail, ProductParameterValue } from '../types';
import { VISNDT_COLORS, resolveStatusTone, TONE_TO_HEX } from '../components/design-system/tokens';
import { BusinessIdentityBadge } from '@visndt/design-system';
import { StatusTag } from '../components/design-system';

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

const STATUS_LABEL_MAP: Record<string, string> = {
  ACTIVE: '已上架',
  DRAFT: '草稿',
  INACTIVE: '已下架',
};

const PARAM_COLUMNS = [
  {
    title: '参数名称',
    dataIndex: ['parameterDefinition', 'name'],
    key: 'name',
  },
  {
    title: '编码',
    dataIndex: ['parameterDefinition', 'code'],
    key: 'code',
  },
  {
    title: '数据类型',
    dataIndex: ['parameterDefinition', 'dataType'],
    key: 'dataType',
    width: 120,
  },
  {
    title: '单位',
    dataIndex: ['parameterDefinition', 'unit'],
    key: 'unit',
    width: 100,
    render: (v: string | undefined) => v || '-',
  },
  {
    title: '值',
    key: 'value',
    render: (_: unknown, record: ProductParameterValue) => {
      if (record.value !== undefined && record.value !== null) {
        // ENUM 参数展示用户可读 label（后端详情投影已返回 options）
        if (record.parameterDefinition?.dataType === 'ENUM') {
          const option = (record.parameterDefinition.options ?? []).find(
            (o) => o.value === record.value,
          );
          if (option?.label) return option.label;
        }
        return record.value;
      }
      return record.valueNumber ?? '-';
    },
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
      const message = err instanceof Error ? err.message : '加载能力详情失败';
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
        message="加载能力失败"
        description={pageState.message}
        showIcon
        action={
          <Space>
            <Button onClick={fetchDetail}>重试</Button>
            <Button onClick={() => navigate('/products')} icon={<ArrowLeftOutlined />}>
              返回列表
            </Button>
          </Space>
        }
      />
    );
  }

  const product = pageState.data;

  const mediaCount = product.media?.length || 0;
  const paramCount = product.parameterValues?.length || 0;
  const offerCount = (product as any).offers?.length || 0;

  return (
    <div>
      {/* Breadcrumb Navigation */}
      <Breadcrumb style={{ marginBottom: 12 }}>
        <Breadcrumb.Item>
          <a onClick={() => navigate('/')}><HomeOutlined /> 首页</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <a onClick={() => navigate('/products')}>能力管理</a>
        </Breadcrumb.Item>
        {product.category && (
          <Breadcrumb.Item>{product.category.name}</Breadcrumb.Item>
        )}
        <Breadcrumb.Item>{product.name}</Breadcrumb.Item>
      </Breadcrumb>

      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 4, height: 20, borderRadius: 2, background: VISNDT_COLORS.primary, flexShrink: 0 }} />
          <Title level={4} style={{ margin: 0 }}>能力详情</Title>
          <StatusTag status={product.status} label={STATUS_LABEL_MAP[product.status] || product.status} />
        </div>
        <Text type="secondary" style={{ fontSize: 12, marginLeft: 12, display: 'block', marginTop: 4 }}>
          查看能力详情、参数与媒体
        </Text>
      </div>

      <div style={{ marginBottom: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/products')}>
          返回列表
        </Button>
        <Button
          icon={<EditOutlined />}
          type="primary"
          onClick={() => navigate(`/products/${id}/edit`)}
        >
          编辑能力
        </Button>
        <Button
          icon={<PictureOutlined />}
          onClick={() => navigate(`/products/${id}/media`)}
        >
          管理媒体
        </Button>
      </div>

      {/* Governance Stats */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col xs={12} sm={6}>
          <Card size="small">
            <Statistic title="媒体资源" value={mediaCount} prefix={<PictureOutlined />} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small">
            <Statistic title="能力参数" value={paramCount} prefix={<SettingOutlined />} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small">
            <Statistic title="供应能力" value={offerCount} prefix={<ShopOutlined />} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small">
            <Tooltip title="能力治理状态">
              <Statistic title="治理状态" value={STATUS_LABEL_MAP[product.status] || product.status} prefix={<AppstoreOutlined />} valueStyle={{ color: TONE_TO_HEX[resolveStatusTone(product.status)] }} />
            </Tooltip>
          </Card>
        </Col>
      </Row>

      <Card title="基本信息" style={{ marginBottom: 16 }}>
        <Descriptions bordered column={{ xs: 1, sm: 2 }}>
          <Descriptions.Item label="业务编号">
            <BusinessIdentityBadge type="PRODUCT" id={product.id} createdAt={product.createdAt} />
          </Descriptions.Item>
          <Descriptions.Item label="名称">{product.name}</Descriptions.Item>
          <Descriptions.Item label="型号">{product.model || '-'}</Descriptions.Item>
          <Descriptions.Item label="分类">
            {product.category?.name || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="状态">
            <StatusTag status={product.status} label={STATUS_LABEL_MAP[product.status] || product.status} />
          </Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {new Date(product.createdAt).toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label="更新时间">
            {new Date(product.updatedAt).toLocaleString()}
          </Descriptions.Item>
        </Descriptions>
        {product.description && (
          <Descriptions bordered column={1} style={{ marginTop: 16 }}>
            <Descriptions.Item label="描述">{product.description}</Descriptions.Item>
          </Descriptions>
        )}
      </Card>

      <Card title="能力参数" style={{ marginBottom: 16 }}>
        {product.parameterValues && product.parameterValues.length > 0 ? (
          <Table
            dataSource={product.parameterValues}
            columns={PARAM_COLUMNS}
            rowKey="id"
            pagination={false}
            size="small"
          />
        ) : (
          <Empty description="未定义参数" />
        )}
      </Card>

      <Card title="能力媒体">
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
                message.warning('无可用下载链接');
              }
            };

            return (
              <>
                {/* Image Gallery */}
                {images.length > 0 && (
                  <div style={{ marginBottom: documents.length > 0 ? 24 : 0 }}>
                    <Title level={5} style={{ marginBottom: 12 }}>
                      <FileImageOutlined /> 能力图片 ({images.length})
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
                                    alt={item.title || '能力图片'}
                                    src={item.url}
                                    preview={{ mask: '预览' }}
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
                                  下载
                                </Button>,
                              ]}
                            >
                              <Card.Meta
                                title={item.title || '未命名图片'}
                                description={
                                  item.isPrimary ? (
                                    <Tag color="gold">主要</Tag>
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
                      <FileTextOutlined /> 能力文档 ({documents.length})
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
                              下载
                            </Button>,
                          ]}
                        >
                          <List.Item.Meta
                            avatar={getFileTypeIcon(item.mediaType)}
                            title={item.title || '未命名文档'}
                            description={
                              <Space size="middle">
                                <Tag>{item.mediaType}</Tag>
                                {item.isPrimary && (
                                  <Tag color="gold">主要</Tag>
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
          <Empty description="未附加媒体">
            <Button
              type="primary"
              icon={<PictureOutlined />}
              onClick={() => navigate(`/products/${id}/media`)}
            >
              添加媒体
            </Button>
          </Empty>
        )}
      </Card>
    </div>
  );
}