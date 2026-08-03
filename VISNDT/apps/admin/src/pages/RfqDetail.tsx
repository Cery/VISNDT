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
  Select,
  message,
  Modal,
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { rfqService, rfqResponseService } from '../api';
import type { Rfq, RfqResponse } from '../types';

const { Title } = Typography;

type PageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: Rfq };

type ResponseState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: RfqResponse[] };

const STATUS_COLOR: Record<string, string> = {
  DRAFT: 'orange',
  OPEN: 'blue',
  RESPONDING: 'cyan',
  CLOSED: 'default',
  CANCELLED: 'red',
};

const RESPONSE_STATUS_COLOR: Record<string, string> = {
  SUBMITTED: 'blue',
  VIEWED: 'cyan',
  ACCEPTED: 'green',
  REJECTED: 'red',
};

const RFQ_TRANSITIONS: Record<string, string[]> = {
  DRAFT: ['OPEN'],
  OPEN: ['RESPONDING', 'CLOSED', 'CANCELLED'],
  RESPONDING: ['CLOSED', 'CANCELLED'],
  CLOSED: [],
  CANCELLED: [],
};

export default function RfqDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pageState, setPageState] = useState<PageState>({ status: 'loading' });
  const [responseState, setResponseState] = useState<ResponseState>({ status: 'loading' });
  const [updating, setUpdating] = useState(false);

  const fetchRfq = useCallback(async () => {
    if (!id) return;
    setPageState({ status: 'loading' });
    try {
      const data = await rfqService.getById(id);
      setPageState({ status: 'success', data });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load RFQ';
      setPageState({ status: 'error', message });
    }
  }, [id]);

  const fetchResponses = useCallback(async () => {
    if (!id) return;
    setResponseState({ status: 'loading' });
    try {
      const result = await rfqResponseService.getByRfqId(id, 1, 50);
      setResponseState({ status: 'success', data: result.data });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to load responses';
      setResponseState({ status: 'error', message });
    }
  }, [id]);

  useEffect(() => {
    fetchRfq();
    fetchResponses();
  }, [fetchRfq, fetchResponses]);

  const handleStatusChange = async (newStatus: string) => {
    if (!id) return;
    try {
      setUpdating(true);
      await rfqService.update(id, { status: newStatus as Rfq['status'] });
      message.success(`RFQ status updated to ${newStatus}`);
      fetchRfq();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to update status';
      message.error(msg);
    } finally {
      setUpdating(false);
    }
  };

  const handlePublish = () => {
    if (!id) return;
    Modal.confirm({
      title: 'Publish RFQ',
      content: 'Are you sure you want to publish this RFQ? Once published, it will be visible to suppliers.',
      okText: 'Publish',
      onOk: async () => {
        try {
          await rfqService.publish(id);
          message.success('RFQ published successfully');
          fetchRfq();
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Failed to publish RFQ';
          message.error(msg);
        }
      },
    });
  };

  const handleClose = () => {
    if (!id) return;
    Modal.confirm({
      title: 'Close RFQ',
      content: 'Are you sure you want to close this RFQ? This action cannot be undone.',
      okText: 'Close',
      okType: 'danger',
      onOk: async () => {
        try {
          await rfqService.close(id);
          message.success('RFQ closed successfully');
          fetchRfq();
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Failed to close RFQ';
          message.error(msg);
        }
      },
    });
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
        message="Failed to load RFQ"
        description={pageState.message}
        showIcon
        action={
          <Space>
            <Button onClick={fetchRfq}>Retry</Button>
            <Button onClick={() => navigate('/rfqs')} icon={<ArrowLeftOutlined />}>
              Back to List
            </Button>
          </Space>
        }
      />
    );
  }

  const rfq = pageState.data;
  const allowedTransitions = RFQ_TRANSITIONS[rfq.status] || [];

  const formatDate = (date: string | undefined) =>
    date ? new Date(date).toLocaleString() : '-';

  const responseColumns = [
    {
      title: 'Organization',
      dataIndex: 'organization',
      key: 'organization',
      render: (org: RfqResponse['organization']) => org?.name || '-',
    },
    {
      title: 'Offer',
      dataIndex: 'offer',
      key: 'offer',
      render: (offer: RfqResponse['offer']) => offer?.product?.name || '-',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => (
        <Tag color={RESPONSE_STATUS_COLOR[status] || 'default'}>{status}</Tag>
      ),
    },
    {
      title: 'Message',
      dataIndex: 'message',
      key: 'message',
      ellipsis: true,
      render: (msg: string | undefined) => msg || '-',
    },
    {
      title: 'Submitted At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (_: unknown, record: RfqResponse) => (
        <Button
          type="link"
          onClick={() => navigate(`/rfq-responses/${record.id}`)}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/rfqs')}>
          Back to List
        </Button>
      </Space>

      <Title level={3}>RFQ Detail</Title>

      <Card title="Basic Information" style={{ marginBottom: 16 }}>
        <Descriptions bordered column={{ xs: 1, sm: 2 }}>
          <Descriptions.Item label="ID">{rfq.id}</Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={STATUS_COLOR[rfq.status] || 'default'}>{rfq.status}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Demand">
            {rfq.demand?.title || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="Creator">
            {rfq.createdByUser?.name || rfq.createdByUser?.email || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="Published At">
            {formatDate(rfq.publishedAt)}
          </Descriptions.Item>
          <Descriptions.Item label="Closed At">
            {formatDate(rfq.closedAt)}
          </Descriptions.Item>
        </Descriptions>
      </Card>

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

      {(rfq.status === 'DRAFT' || rfq.status === 'OPEN') && (
        <Card title="Lifecycle Actions" style={{ marginBottom: 16 }}>
          <Space>
            {rfq.status === 'DRAFT' && (
              <Button type="primary" onClick={handlePublish}>
                Publish
              </Button>
            )}
            {rfq.status === 'OPEN' && (
              <Button danger onClick={handleClose}>
                Close
              </Button>
            )}
          </Space>
        </Card>
      )}

      <Card title="Responses" style={{ marginBottom: 16 }}>
        {responseState.status === 'loading' ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <Spin />
          </div>
        ) : responseState.status === 'error' ? (
          <Alert
            type="warning"
            message="Failed to load responses"
            description={responseState.message}
            action={
              <Button size="small" onClick={fetchResponses}>
                Retry
              </Button>
            }
          />
        ) : responseState.data.length > 0 ? (
          <Table
            dataSource={responseState.data}
            columns={responseColumns}
            rowKey="id"
            pagination={false}
            size="small"
          />
        ) : (
          <Empty description="No responses yet" />
        )}
      </Card>

      <Card title="Timeline" style={{ marginBottom: 16 }}>
        <Descriptions bordered column={{ xs: 1, sm: 2 }}>
          <Descriptions.Item label="Created At">
            {formatDate(rfq.createdAt)}
          </Descriptions.Item>
          <Descriptions.Item label="Updated At">
            {formatDate(rfq.updatedAt)}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/rfqs')}>
        Back to List
      </Button>
    </div>
  );
}