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
  Statistic,
  Row,
  Col,
  Typography,
  Empty,
} from 'antd';
import {
  ArrowLeftOutlined,
  ShopOutlined,
  FileTextOutlined,
  NodeIndexOutlined,
} from '@ant-design/icons';
import { supplierService } from '../api';
import type { SupplierDetail, SupplierProduct } from '../types';

const { Title } = Typography;

type PageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: SupplierDetail };

type ProductState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: SupplierProduct[] };

export default function SupplierDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pageState, setPageState] = useState<PageState>({ status: 'loading' });
  const [productState, setProductState] = useState<ProductState>({
    status: 'loading',
  });

  const fetchSupplier = useCallback(async () => {
    if (!id) return;
    setPageState({ status: 'loading' });
    try {
      const data = await supplierService.getById(id);
      setPageState({ status: 'success', data });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to load supplier';
      setPageState({ status: 'error', message });
    }
  }, [id]);

  const fetchProducts = useCallback(async () => {
    if (!id) return;
    setProductState({ status: 'loading' });
    try {
      const result = await supplierService.getProducts(id, 1, 50);
      setProductState({ status: 'success', data: result.items });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to load products';
      setProductState({ status: 'error', message });
    }
  }, [id]);

  useEffect(() => {
    fetchSupplier();
    fetchProducts();
  }, [fetchSupplier, fetchProducts]);

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
        message="Failed to load supplier"
        description={pageState.message}
        showIcon
        action={
          <Space>
            <Button onClick={fetchSupplier}>Retry</Button>
            <Button
              onClick={() => navigate('/suppliers')}
              icon={<ArrowLeftOutlined />}
            >
              Back to List
            </Button>
          </Space>
        }
      />
    );
  }

  const supplier = pageState.data;

  const formatDate = (date: string) =>
    date ? new Date(date).toLocaleString() : '-';

  const productColumns = [
    {
      title: 'Product Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Model',
      dataIndex: 'model',
      key: 'model',
      render: (v: string | undefined) => v || '-',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (cat: SupplierProduct['category']) => cat?.name || '-',
    },
    {
      title: 'Offer Status',
      dataIndex: 'offerStatus',
      key: 'offerStatus',
      width: 120,
      render: (status: string) => <Tag>{status}</Tag>,
    },
  ];

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/suppliers')}
        >
          Back to List
        </Button>
      </Space>

      <Title level={3}>Supplier Detail</Title>

      {/* Card 1: Supplier Summary */}
      <Card title="Supplier Summary" style={{ marginBottom: 16 }}>
        <Descriptions bordered column={{ xs: 1, sm: 2 }}>
          <Descriptions.Item label="Name">{supplier.name}</Descriptions.Item>
          <Descriptions.Item label="Type">
            <Tag>{supplier.type}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag
              color={
                supplier.status === 'ACTIVE'
                  ? 'green'
                  : supplier.status === 'INACTIVE'
                  ? 'orange'
                  : 'default'
              }
            >
              {supplier.status}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Created At">
            {formatDate(supplier.createdAt)}
          </Descriptions.Item>
          <Descriptions.Item label="Updated At">
            {formatDate(supplier.updatedAt)}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Card 2: Business Statistics */}
      <Card title="Business Statistics" style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Product Count"
                value={supplier.productCount}
                prefix={<ShopOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Offer Count"
                value={supplier.offerCount}
                prefix={<FileTextOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Match Count"
                value={supplier.matchCount}
                prefix={<NodeIndexOutlined />}
              />
            </Card>
          </Col>
        </Row>
      </Card>

      {/* Card 3: Products Table */}
      <Card title="Products" style={{ marginBottom: 16 }}>
        {productState.status === 'loading' ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <Spin />
          </div>
        ) : productState.status === 'error' ? (
          <Alert
            type="warning"
            message="Failed to load products"
            description={productState.message}
            action={
              <Button size="small" onClick={fetchProducts}>
                Retry
              </Button>
            }
          />
        ) : productState.data.length > 0 ? (
          <Table
            dataSource={productState.data}
            columns={productColumns}
            rowKey="id"
            pagination={false}
            size="small"
          />
        ) : (
          <Empty description="No products" />
        )}
      </Card>

      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/suppliers')}
      >
        Back to List
      </Button>
    </div>
  );
}