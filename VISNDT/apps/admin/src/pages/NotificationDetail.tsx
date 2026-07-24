import { useEffect, useState, useCallback, useRef } from 'react';
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
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { notificationService } from '../api';
import type { Notification } from '../types';

const { Title } = Typography;

type PageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: Notification };

const TYPE_COLOR: Record<string, string> = {
  SYSTEM: 'blue',
  DEMAND_UPDATE: 'cyan',
  RFQ_UPDATE: 'geekblue',
  RESPONSE_UPDATE: 'purple',
};

const STATUS_COLOR: Record<string, string> = {
  UNREAD: 'blue',
  READ: 'default',
};

const formatDate = (date: string | undefined) =>
  date ? new Date(date).toLocaleString() : '-';

export default function NotificationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pageState, setPageState] = useState<PageState>({ status: 'loading' });
  const markedRead = useRef(false);

  const fetchNotification = useCallback(async () => {
    if (!id) return;
    setPageState({ status: 'loading' });
    try {
      const data = await notificationService.getById(id);
      setPageState({ status: 'success', data });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to load notification';
      setPageState({ status: 'error', message });
    }
  }, [id]);

  useEffect(() => {
    fetchNotification();
  }, [fetchNotification]);

  // Auto mark as read when UNREAD (only once)
  useEffect(() => {
    if (pageState.status !== 'success') return;
    if (markedRead.current) return;
    if (pageState.data.status !== 'UNREAD') return;

    markedRead.current = true;
    notificationService.markRead(id!).then((updated) => {
      setPageState({ status: 'success', data: updated });
    });
  }, [pageState, id]);

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
        message="Failed to load notification"
        description={pageState.message}
        showIcon
        action={
          <Space>
            <Button onClick={fetchNotification}>Retry</Button>
            <Button
              onClick={() => navigate('/notifications')}
              icon={<ArrowLeftOutlined />}
            >
              Back to List
            </Button>
          </Space>
        }
      />
    );
  }

  const notification = pageState.data;

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/notifications')}
        >
          Back to List
        </Button>
      </Space>

      <Title level={3}>Notification Detail</Title>

      <Card title="Basic Information" style={{ marginBottom: 16 }}>
        <Descriptions bordered column={{ xs: 1, sm: 2 }}>
          <Descriptions.Item label="ID">{notification.id}</Descriptions.Item>
          <Descriptions.Item label="Type">
            <Tag color={TYPE_COLOR[notification.type] || 'default'}>
              {notification.type}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={STATUS_COLOR[notification.status] || 'default'}>
              {notification.status}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Created At">
            {formatDate(notification.createdAt)}
          </Descriptions.Item>
          <Descriptions.Item label="Updated At">
            {formatDate(notification.updatedAt)}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Content" style={{ marginBottom: 16 }}>
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Title">
            <span style={{ fontWeight: 500 }}>{notification.title}</span>
          </Descriptions.Item>
          <Descriptions.Item label="Message">
            <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>
              {notification.message}
            </p>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Reference">
        <Descriptions bordered column={{ xs: 1, sm: 2 }}>
          <Descriptions.Item label="Reference Type">
            {notification.referenceType || 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Reference ID">
            {notification.referenceId || 'N/A'}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
}