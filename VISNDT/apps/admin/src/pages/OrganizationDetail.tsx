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
import { VISNDT_COLORS } from '../components/design-system/tokens';
import { StatusTag } from '../components/design-system';
import { BusinessIdentityBadge } from '@visndt/design-system';

const { Title, Text } = Typography;

type PageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: Organization };

const ROLE_LABEL_MAP: Record<string, string> = {
  ADMIN: '管理员',
  MEMBER: '成员',
};

const STATUS_LABEL_MAP: Record<string, string> = {
  ACTIVE: '活跃',
  INACTIVE: '未激活',
  SUSPENDED: '已停用',
};

const MEMBER_COLUMNS: ColumnsType<OrganizationMember> = [
  {
    title: '姓名',
    dataIndex: 'user',
    key: 'user',
    render: (user: OrganizationMember['user']) => user?.name || user?.email || '-',
  },
  {
    title: '邮箱',
    dataIndex: 'user',
    key: 'email',
    render: (user: OrganizationMember['user']) => user?.email || '-',
  },
  {
    title: '角色',
    dataIndex: 'role',
    key: 'role',
    width: 120,
    render: (role: string) => (
      <Tag color={role === 'ADMIN' ? 'blue' : 'default'}>{ROLE_LABEL_MAP[role] || '未知角色'}</Tag>
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

      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 4, height: 20, borderRadius: 2, background: VISNDT_COLORS.primary, flexShrink: 0 }} />
          <Title level={4} style={{ margin: 0 }}>Organization Profile</Title>
        </div>
        <Text type="secondary" style={{ fontSize: 12, marginLeft: 12, display: 'block', marginTop: 4 }}>
          View organization details, members and activity
        </Text>
      </div>

      <Card title="基本信息" style={{ marginBottom: 16 }}>
        <Descriptions bordered column={{ xs: 1, sm: 2 }}>
          <Descriptions.Item label="业务编号">
            <BusinessIdentityBadge type="ORGANIZATION" id={org.id} createdAt={org.createdAt} />
          </Descriptions.Item>
          <Descriptions.Item label="名称">{org.name}</Descriptions.Item>
          <Descriptions.Item label="类型">{org.type || '-'}</Descriptions.Item>
          <Descriptions.Item label="状态">
            <StatusTag status={org.status} label={STATUS_LABEL_MAP[org.status] || '未知状态'} />
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