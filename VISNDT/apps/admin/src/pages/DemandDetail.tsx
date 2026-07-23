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
import { demandService } from '../api';
import type { Demand, DemandParameter } from '../types';

const { Title } = Typography;

type PageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: Demand };

const STATUS_COLOR: Record<string, string> = {
  DRAFT: 'orange',
  PUBLISHED: 'green',
  SUBMITTED: 'cyan',
  PROCESSING: 'blue',
  CLOSED: 'default',
  CANCELLED: 'red',
};

const PARAM_COLUMNS = [
  {
    title: 'Name',
    dataIndex: ['parameterDefinition', 'name'],
    key: 'name',
  },
  {
    title: 'Code',
    dataIndex: ['parameterDefinition', 'code'],
    key: 'code',
  },
  {
    title: 'Value',
    key: 'value',
    render: (_: unknown, record: DemandParameter) => {
      if (record.value) return record.value;
      if (record.valueMin !== undefined && record.valueMax !== undefined) {
        return `${record.valueMin} - ${record.valueMax}`;
      }
      if (record.valueMin !== undefined) return `≥ ${record.valueMin}`;
      if (record.valueMax !== undefined) return `≤ ${record.valueMax}`;
      return '-';
    },
  },
  {
    title: 'Unit',
    dataIndex: ['parameterDefinition', 'unit'],
    key: 'unit',
    width: 100,
    render: (v: string | undefined) => v || '-',
  },
];

export default function DemandDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pageState, setPageState] = useState<PageState>({ status: 'loading' });

  const fetchDemand = useCallback(async () => {
    if (!id) return;
    setPageState({ status: 'loading' });
    try {
      const data = await demandService.getById(id);
      setPageState({ status: 'success', data });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load demand';
      setPageState({ status: 'error', message });
    }
  }, [id]);

  useEffect(() => {
    fetchDemand();
  }, [fetchDemand]);

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
        message="Failed to load demand"
        description={pageState.message}
        showIcon
        action={
          <Space>
            <Button onClick={fetchDemand}>Retry</Button>
            <Button onClick={() => navigate('/demands')} icon={<ArrowLeftOutlined />}>
              Back to List
            </Button>
          </Space>
        }
      />
    );
  }

  const demand = pageState.data;
  const parameters = demand.parameters;

  const formatQuantity = () => {
    if (demand.quantity === undefined || demand.quantity === null) return '-';
    if (demand.quantityUnit) return `${demand.quantity} ${demand.quantityUnit}`;
    return String(demand.quantity);
  };

  const formatDate = (date: string | undefined) =>
    date ? new Date(date).toLocaleString() : '-';

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/demands')}>
          Back to List
        </Button>
      </Space>

      <Title level={3}>Demand Detail</Title>

      <Card title="Basic Information" style={{ marginBottom: 16 }}>
        <Descriptions bordered column={{ xs: 1, sm: 2 }}>
          <Descriptions.Item label="Title">{demand.title}</Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={STATUS_COLOR[demand.status] || 'default'}>{demand.status}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Category">
            {demand.category?.name || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="Organization">
            {demand.organization?.name || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="Budget Range">
            {demand.budgetRange || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="Quantity">{formatQuantity()}</Descriptions.Item>
          <Descriptions.Item label="Expected Delivery">
            {formatDate(demand.expectedDeliveryDate)}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {demand.description && (
        <Card title="Description" style={{ marginBottom: 16 }}>
          <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{demand.description}</p>
        </Card>
      )}

      <Card title="Parameters" style={{ marginBottom: 16 }}>
        {parameters && parameters.length > 0 ? (
          <Table
            dataSource={parameters}
            columns={PARAM_COLUMNS}
            rowKey="id"
            pagination={false}
            size="small"
          />
        ) : (
          <Empty description="No parameters" />
        )}
      </Card>

      <Card title="Timeline" style={{ marginBottom: 16 }}>
        <Descriptions bordered column={{ xs: 1, sm: 2 }}>
          <Descriptions.Item label="Created At">
            {formatDate(demand.createdAt)}
          </Descriptions.Item>
          <Descriptions.Item label="Updated At">
            {formatDate(demand.updatedAt)}
          </Descriptions.Item>
          <Descriptions.Item label="Published At">
            {formatDate(demand.publishedAt)}
          </Descriptions.Item>
          <Descriptions.Item label="Closed At">
            {formatDate(demand.closedAt)}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/demands')}>
        Back to List
      </Button>
    </div>
  );
}