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
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { inquiryService } from '../api';
import type { Inquiry, InquiryStatus } from '../types';

const { Title, Paragraph } = Typography;

const STATUS_COLOR: Record<string, string> = {
  NEW: 'blue',
  PROCESSING: 'orange',
  REPLIED: 'green',
  CLOSED: 'default',
};

const STATUS_OPTIONS: { label: string; value: InquiryStatus }[] = [
  { label: 'NEW', value: 'NEW' },
  { label: 'PROCESSING', value: 'PROCESSING' },
  { label: 'REPLIED', value: 'REPLIED' },
  { label: 'CLOSED', value: 'CLOSED' },
];

type PageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: Inquiry };

export default function InquiryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pageState, setPageState] = useState<PageState>({ status: 'loading' });
  const [updating, setUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<InquiryStatus | null>(null);

  const fetchInquiry = useCallback(async () => {
    if (!id) return;
    setPageState({ status: 'loading' });
    try {
      const data = await inquiryService.getById(id);
      setPageState({ status: 'success', data });
      setSelectedStatus(data.status);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to load inquiry';
      setPageState({ status: 'error', message });
    }
  }, [id]);

  useEffect(() => {
    fetchInquiry();
  }, [fetchInquiry]);

  const handleStatusUpdate = async () => {
    if (!id || !selectedStatus) return;
    setUpdating(true);
    try {
      await inquiryService.updateStatus(id, selectedStatus);
      message.success('Status updated');
      fetchInquiry();
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Failed to update status';
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
        message="Failed to load inquiry"
        description={pageState.message}
        showIcon
        action={
          <Space>
            <Button onClick={fetchInquiry}>Retry</Button>
            <Button
              onClick={() => navigate('/inquiries')}
              icon={<ArrowLeftOutlined />}
            >
              Back to List
            </Button>
          </Space>
        }
      />
    );
  }

  const inquiry = pageState.data;

  const formatDate = (date: string) =>
    date ? new Date(date).toLocaleString() : '-';

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/inquiries')}
        >
          Back to List
        </Button>
      </Space>

      <Title level={3}>Inquiry Detail</Title>

      {/* Card 1: Inquiry Summary */}
      <Card title="Inquiry Summary" style={{ marginBottom: 16 }}>
        <Descriptions bordered column={{ xs: 1, sm: 2 }}>
          <Descriptions.Item label="Inquiry ID">{inquiry.id}</Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={STATUS_COLOR[inquiry.status] || 'default'}>
              {inquiry.status}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Created At">
            {formatDate(inquiry.createdAt)}
          </Descriptions.Item>
          <Descriptions.Item label="Updated At">
            {formatDate(inquiry.updatedAt)}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Card 2: Contact Information */}
      <Card title="Contact Information" style={{ marginBottom: 16 }}>
        <Descriptions bordered column={{ xs: 1, sm: 2 }}>
          <Descriptions.Item label="Name">
            {inquiry.contactName || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            {inquiry.contactEmail || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="Phone">
            {inquiry.contactPhone || '-'}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Card 3: Product & Organization */}
      <Card title="Related Information" style={{ marginBottom: 16 }}>
        <Descriptions bordered column={{ xs: 1, sm: 2 }}>
          {inquiry.product && (
            <Descriptions.Item label="Product">
              {inquiry.product.name}
            </Descriptions.Item>
          )}
          {inquiry.organization && (
            <Descriptions.Item label="Organization">
              {inquiry.organization.name}
            </Descriptions.Item>
          )}
          {inquiry.createdBy && (
            <Descriptions.Item label="Created By">
              {inquiry.createdBy.name || inquiry.createdBy.email}
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>

      {/* Card 4: Message */}
      <Card title="Message" style={{ marginBottom: 16 }}>
        <Paragraph
          style={{
            whiteSpace: 'pre-wrap',
            margin: 0,
            background: '#fafafa',
            padding: 16,
            borderRadius: 4,
          }}
        >
          {inquiry.message}
        </Paragraph>
      </Card>

      {/* Card 5: Status Management */}
      <Card title="Status Management" style={{ marginBottom: 16 }}>
        <Space>
          <Select
            value={selectedStatus}
            onChange={(value) => setSelectedStatus(value)}
            options={STATUS_OPTIONS}
            style={{ width: 160 }}
          />
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleStatusUpdate}
            loading={updating}
            disabled={selectedStatus === inquiry.status}
          >
            Update Status
          </Button>
        </Space>
      </Card>

      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/inquiries')}
      >
        Back to List
      </Button>
    </div>
  );
}