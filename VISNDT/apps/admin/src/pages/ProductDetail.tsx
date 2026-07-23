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
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { productService } from '../api';
import type { ProductDetail, ProductParameterValue } from '../types';

const { Title } = Typography;

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
          <Table
            dataSource={product.media}
            columns={[
              { title: 'Title', dataIndex: 'title', key: 'title' },
              { title: 'Type', dataIndex: 'mediaType', key: 'mediaType', width: 120 },
            ]}
            rowKey="id"
            pagination={false}
            size="small"
          />
        ) : (
          <Empty description="No media attached" />
        )}
      </Card>
    </div>
  );
}