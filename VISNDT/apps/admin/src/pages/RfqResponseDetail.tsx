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
  Typography,
  Select,
  message,
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { rfqResponseService } from '../api';
import type { RfqResponse } from '../types';

const { Title } = Typography;

type PageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: RfqResponse };

const STATUS_COLOR: Record<string, string> = {
  SUBMITTED: 'blue',
  VIEWED: 'cyan',
  ACCEPTED: 'green',
  REJECTED: 'red',
};

const RESPONSE_TRANSITIONS: Record<string, string[]> = {
  SUBMITTED: ['VIEWED'],
  VIEWED: ['ACCEPTED', 'REJECTED'],
  ACCEPTED: [],
  REJECTED: [],
};

export default function RfqResponseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pageState, setPageState] = useState<PageState>({ status: 'loading' });
  const [updating, setUpdating] = useState(false);

  const fetchResponse = useCallback(async () => {
    if (!id) return;
    setPageState({ status: 'loading' });
    try {
      const data = await rfqResponseService.getById(id);
      setPageState({ status: 'success', data });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to load response';
      setPageState({ status: 'error', message });
    }
  }, [id]);

  useEffect(() => {
    fetchResponse();
  }, [fetchResponse]);

  const handleStatusChange = async (newStatus: string) => {
    if (!id) return;
    try {
      setUpdating(true);
      await rfqResponseService.update(id, { status: newStatus });
      message.success(`Response status updated to ${newStatus}`);
      fetchResponse();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to update status';
      message.error(msg);
    } finally {
      setUpdating(false);
    }
  };

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
        message="Failed to load response"
        description={pageState.message}
        showIcon
        action={
          <Space>
            <Button onClick={fetchResponse}>Retry</Button>
            <Button onClick={() => navigate(-1)} icon={<ArrowLeftOutlined />}>
              Go Back
            </Button>
          </Space>
        }
      />
    );
  }

  const response = pageState.data;
  const allowedTransitions = RESPONSE_TRANSITIONS[response.status] || [];

  const formatDate = (date: string) =>
    date ? new Date(date).toLocaleString() : '-';

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </Space>

      <Title level={3}>RFQ Response Detail</Title>

      <Card title="Basic Information" style={{ marginBottom: 16 }}>
        <Descriptions bordered column={{ xs: 1, sm: 2 }}>
          <Descriptions.Item label="ID">{response.id}</Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={STATUS_COLOR[response.status] || 'default'}>
              {response.status}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Organization">
            {response.organization?.name || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="Offer">
            {response.offer?.product?.name || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="RFQ ID">
            {response.rfqId}
          </Descriptions.Item>
          <Descriptions.Item label="Submitted At">
            {formatDate(response.createdAt)}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {response.message && (
        <Card title="Message" style={{ marginBottom: 16 }}>
          <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>
            {response.message}
          </p>
        </Card>
      )}

      {allowedTransitions.length > 0 && (
        <Card title="Status Management" style={{ marginBottom: 16 }}>
          <Space>
            <span>Transition to:</span>
            <Select
              placeholder="Select new status"
              loading={updating}
              disabled={updating}
              onChange={handleStatusChange}
              options={allowedTransitions.map((s) => ({
                value: s,
                label: s,
              }))}
              style={{ minWidth: 160 }}
            />
          </Space>
        </Card>
      )}

      <Card title="Timeline" style={{ marginBottom: 16 }}>
        <Descriptions bordered column={{ xs: 1, sm: 2 }}>
          <Descriptions.Item label="Created At">
            {formatDate(response.createdAt)}
          </Descriptions.Item>
          <Descriptions.Item label="Updated At">
            {formatDate(response.updatedAt)}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
        Go Back
      </Button>
    </div>
  );
}