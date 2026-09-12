import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Descriptions,
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
import { VISNDT_COLORS } from '../components/design-system/tokens';
import { StatusTag } from '../components/design-system';
import { BusinessIdentityBadge } from '@visndt/design-system';
import { PageHeader } from '../components/common';

const { Text, Paragraph } = Typography;

const STATUS_OPTIONS: { label: string; value: InquiryStatus }[] = [
  { label: '新建', value: 'NEW' },
  { label: '处理中', value: 'PROCESSING' },
  { label: '已回复', value: 'REPLIED' },
  { label: '已关闭', value: 'CLOSED' },
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
        err instanceof Error ? err.message : '加载询价失败';
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
      message.success('状态已更新');
      fetchInquiry();
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : '更新状态失败';
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
        message="加载询价失败"
        description={pageState.message}
        showIcon
        action={
          <Space>
            <Button onClick={fetchInquiry}>重试</Button>
            <Button
              onClick={() => navigate('/inquiries')}
              icon={<ArrowLeftOutlined />}
            >
              返回列表
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
      <PageHeader
        title="询价详情"
        subtitle="查看询价详情、供应商响应与状态"
        extra={
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/inquiries')}
          >
            返回列表
          </Button>
        }
      />

      {/* Card 1: Inquiry Summary */}
      <Card title="询价摘要" style={{ marginBottom: 16 }}>
        <Descriptions bordered column={{ xs: 1, sm: 2 }}>
          <Descriptions.Item label="询价编号">
            <BusinessIdentityBadge type="RFQ" id={inquiry.id} createdAt={inquiry.createdAt} />
          </Descriptions.Item>
          <Descriptions.Item label="状态">
            <StatusTag status={inquiry.status} />
          </Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {formatDate(inquiry.createdAt)}
          </Descriptions.Item>
          <Descriptions.Item label="更新时间">
            {formatDate(inquiry.updatedAt)}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Card 2: Contact Information */}
      <Card title="联系信息" style={{ marginBottom: 16 }}>
        <Descriptions bordered column={{ xs: 1, sm: 2 }}>
          <Descriptions.Item label="姓名">
            {inquiry.contactName || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="邮箱">
            {inquiry.contactEmail || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="电话">
            {inquiry.contactPhone || '-'}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Card 3: Product & Organization */}
      <Card title="关联信息" style={{ marginBottom: 16 }}>
        <Descriptions bordered column={{ xs: 1, sm: 2 }}>
          {inquiry.product && (
            <Descriptions.Item label="能力">
              {inquiry.product.name}
            </Descriptions.Item>
          )}
          {inquiry.organization && (
            <Descriptions.Item label="组织">
              {inquiry.organization.name}
            </Descriptions.Item>
          )}
          {inquiry.createdBy && (
            <Descriptions.Item label="创建者">
              {inquiry.createdBy.name || inquiry.createdBy.email}
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>

      {/* Card 4: Message */}
      <Card title="消息" style={{ marginBottom: 16 }}>
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
      <Card title="状态管理" style={{ marginBottom: 16 }}>
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
            更新状态
          </Button>
        </Space>
      </Card>

      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/inquiries')}
      >
        返回列表
      </Button>
    </div>
  );
}