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
import type { ColumnsType } from 'antd/es/table';
import { organizationService } from '../api';
import type { Organization, OrganizationMember } from '../types';

const { Title } = Typography;

type PageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: Organization };

const STATUS_COLOR: Record<string, string> = {
  ACTIVE: 'green',
  INACTIVE: 'orange',
  SUSPENDED: 'red',
};

const MEMBER_COLUMNS: ColumnsType<OrganizationMember> = [
  {
    title: 'User ID',
    dataIndex: 'userId',
    key: 'userId',
    ellipsis: true,
  },
  {
    title: 'Role',
    dataIndex: 'role',
    key: 'role',
    width: 120,
    render: (role: string) => (
      <Tag color={role === 'ADMIN' ? 'blue' : 'default'}>{role}</Tag>
    ),
  },
  {
    title: 'Joined',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: 180,
    render: (date: string) => new Date(date).toLocaleString(),
  },
];

const formatDate = (date: string | undefined) =>
  date ? new Date(date).toLocaleString() : '-';

export default function OrganizationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pageState, setPageState] = useState<PageState>({ status: 'loading' });

  const fetchOrganization = useCallback(async () => {
    if (!id) return;
    setPageState({ status: 'loading' });
    try {
      const data = await organizationService.getById(id);
      setPageState({ status: 'success', data });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to load organization';
      setPageState({ status: 'error', message });
    }
  }, [id]);

  useEffect(() => {
    fetchOrganization();
  }, [fetchOrganization]);

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
        message="Failed to load organization"
        description={pageState.message}
        showIcon
        action={
          <Space>
            <Button onClick={fetchOrganization}>Retry</Button>
            <Button
              onClick={() => navigate('/organizations')}
              icon={<ArrowLeftOutlined />}
            >
              Back to List
            </Button>
          </Space>
        }
      />
    );
  }

  const org = pageState.data;
  const members = org.members;

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/organizations')}
        >
          Back to List
        </Button>
      </Space>

      <Title level={3}>Organization Detail</Title>

      <Card title="Basic Information" style={{ marginBottom: 16 }}>
        <Descriptions bordered column={{ xs: 1, sm: 2 }}>
          <Descriptions.Item label="ID">{org.id}</Descriptions.Item>
          <Descriptions.Item label="Name">{org.name}</Descriptions.Item>
          <Descriptions.Item label="Type">{org.type || '-'}</Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={STATUS_COLOR[org.status] || 'default'}>
              {org.status}
            </Tag>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Members" style={{ marginBottom: 16 }}>
        {members && members.length > 0 ? (
          <Table
            dataSource={members}
            columns={MEMBER_COLUMNS}
            rowKey="id"
            pagination={false}
            size="small"
          />
        ) : (
          <Empty description="No members found" />
        )}
      </Card>

      <Card title="Timeline">
        <Descriptions bordered column={{ xs: 1, sm: 2 }}>
          <Descriptions.Item label="Created At">
            {formatDate(org.createdAt)}
          </Descriptions.Item>
          <Descriptions.Item label="Updated At">
            {formatDate(org.updatedAt)}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
}