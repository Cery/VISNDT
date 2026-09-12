import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Descriptions,
  Spin,
  Alert,
  Button,
  Space,
  Typography,
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { notificationService } from '../api';
import type { Notification } from '../types';
import { VISNDT_COLORS } from '../components/design-system/tokens';
import { StatusTag } from '../components/design-system';
import { PageHeader } from '../components/common';

const { Text } = Typography;

type PageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: Notification };

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
        err instanceof Error ? err.message : '加载通知失败';
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
        message="加载通知失败"
        description={pageState.message}
        showIcon
        action={
          <Space>
            <Button onClick={fetchNotification}>重试</Button>
            <Button
              onClick={() => navigate('/notifications')}
              icon={<ArrowLeftOutlined />}
            >
              返回列表
            </Button>
          </Space>
        }
      />
    );
  }

  const notification = pageState.data;

  return (
    <div>
      <PageHeader
        title="Notification Details"
        subtitle="View notification content, recipients and delivery status"
        extra={
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/notifications')}
          >
            返回列表
          </Button>
        }
      />

      <Card title="基本信息" style={{ marginBottom: 16 }}>
        <Descriptions bordered column={{ xs: 1, sm: 2 }}>
          <Descriptions.Item label="ID">{notification.id}</Descriptions.Item>
          <Descriptions.Item label="类型">
            <StatusTag status={notification.type} />
          </Descriptions.Item>
          <Descriptions.Item label="状态">
            <StatusTag status={notification.status} />
          </Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {formatDate(notification.createdAt)}
          </Descriptions.Item>
          <Descriptions.Item label="更新时间">
            {formatDate(notification.updatedAt)}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="内容" style={{ marginBottom: 16 }}>
        <Descriptions bordered column={1}>
          <Descriptions.Item label="标题">
            <span style={{ fontWeight: 500 }}>{notification.title}</span>
          </Descriptions.Item>
          <Descriptions.Item label="消息">
            <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>
              {notification.message}
            </p>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="引用" style={{ marginBottom: 16 }}>
        <Descriptions bordered column={{ xs: 1, sm: 2 }}>
          <Descriptions.Item label="引用类型">
            {notification.referenceType || '无'}
          </Descriptions.Item>
          <Descriptions.Item label="引用ID">
            {notification.referenceId || '无'}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
}