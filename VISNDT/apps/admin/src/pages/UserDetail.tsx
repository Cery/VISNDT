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
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { userService } from '../api';
import type { User } from '../types';

const { Title } = Typography;

type PageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: User };

const STATUS_COLOR: Record<string, string> = {
  ACTIVE: 'green',
  INACTIVE: 'orange',
  SUSPENDED: 'red',
};

const formatDate = (date: string | undefined) =>
  date ? new Date(date).toLocaleString() : '-';

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pageState, setPageState] = useState<PageState>({ status: 'loading' });

  const fetchUser = useCallback(async () => {
    if (!id) return;
    setPageState({ status: 'loading' });
    try {
      const data = await userService.getById(id);
      setPageState({ status: 'success', data });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load user';
      setPageState({ status: 'error', message });
    }
  }, [id]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

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
        message="Failed to load user"
        description={pageState.message}
        showIcon
        action={
          <Space>
            <Button onClick={fetchUser}>Retry</Button>
            <Button onClick={() => navigate('/users')} icon={<ArrowLeftOutlined />}>
              Back to List
            </Button>
          </Space>
        }
      />
    );
  }

  const user = pageState.data;

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/users')}>
          Back to List
        </Button>
      </Space>

      <Title level={3}>User Detail</Title>

      <Card title="Basic Information" style={{ marginBottom: 16 }}>
        <Descriptions bordered column={{ xs: 1, sm: 2 }}>
          <Descriptions.Item label="ID">{user.id}</Descriptions.Item>
          <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
          <Descriptions.Item label="Name">{user.name || '-'}</Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={STATUS_COLOR[user.status] || 'default'}>
              {user.status}
            </Tag>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Organization Information" style={{ marginBottom: 16 }}>
        <Descriptions bordered column={{ xs: 1, sm: 2 }}>
          <Descriptions.Item label="Organization ID">
            {user.organizationId || '-'}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Timeline">
        <Descriptions bordered column={{ xs: 1, sm: 2 }}>
          <Descriptions.Item label="Created At">
            {formatDate(user.createdAt)}
          </Descriptions.Item>
          <Descriptions.Item label="Updated At">
            {formatDate(user.updatedAt)}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
}