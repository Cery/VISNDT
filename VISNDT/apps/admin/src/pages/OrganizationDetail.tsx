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
    title: '用户ID',
    dataIndex: 'userId',
    key: 'userId',
    ellipsis: true,
  },
  {
    title: '角色',
    dataIndex: 'role',
    key: 'role',
    width: 120,
    render: (role: string) => (
      <Tag color={role === 'ADMIN' ? 'blue' : 'default'}>{role}</Tag>
    ),
  },
  {
    title: '加入时间',
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
        err instanceof Error ? err.message : '加载组织失败';
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
        message="加载组织失败"
        description={pageState.message}
        showIcon
        action={
          <Space>
            <Button onClick={fetchOrganization}>重试</Button>
            <Button
              onClick={() => navigate('/organizations')}
              icon={<ArrowLeftOutlined />}
            >
              返回列表
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
          返回列表
        </Button>
      </Space>

      <Title level={3}>组织详情</Title>

      <Card title="基本信息" style={{ marginBottom: 16 }}>
        <Descriptions bordered column={{ xs: 1, sm: 2 }}>
          <Descriptions.Item label="ID">{org.id}</Descriptions.Item>
          <Descriptions.Item label="名称">{org.name}</Descriptions.Item>
          <Descriptions.Item label="类型">{org.type || '-'}</Descriptions.Item>
          <Descriptions.Item label="状态">
            <Tag color={STATUS_COLOR[org.status] || 'default'}>
              {org.status}
            </Tag>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="成员" style={{ marginBottom: 16 }}>
        {members && members.length > 0 ? (
          <Table
            dataSource={members}
            columns={MEMBER_COLUMNS}
            rowKey="id"
            pagination={false}
            size="small"
          />
        ) : (
          <Empty description="未找到成员" />
        )}
      </Card>

      <Card title="时间线">
        <Descriptions bordered column={{ xs: 1, sm: 2 }}>
          <Descriptions.Item label="创建时间">
            {formatDate(org.createdAt)}
          </Descriptions.Item>
          <Descriptions.Item label="更新时间">
            {formatDate(org.updatedAt)}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
}