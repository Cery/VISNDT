import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Statistic, Row, Col, Spin, Alert, Typography, Button, Space, Badge, Timeline, Descriptions, Tag, Empty } from 'antd';
import {
  TeamOutlined,
  BankOutlined,
  ShoppingOutlined,
  FileTextOutlined,
  LinkOutlined,
  BellOutlined,
  UserAddOutlined,
  PlusOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
  FileSearchOutlined,
  ThunderboltOutlined,
  NotificationOutlined,
} from '@ant-design/icons';
import { dashboardService, notificationService } from '../api';
import type { DashboardStats, DashboardActivities, DashboardPending, DashboardStatus } from '../types';

const { Title, Text } = Typography;

const DEMAND_STATUS_COLOR: Record<string, string> = {
  DRAFT: 'orange',
  PUBLISHED: 'green',
  SUBMITTED: 'cyan',
  PROCESSING: 'blue',
  CLOSED: 'default',
  CANCELLED: 'red',
};

const MATCH_STATUS_COLOR: Record<string, string> = {
  PENDING: 'orange',
  ACCEPTED: 'green',
  REJECTED: 'red',
  REVIEWED: 'blue',
};

const NOTIFICATION_TYPE_COLOR: Record<string, string> = {
  SYSTEM: 'blue',
  DEMAND_UPDATE: 'green',
  RFQ_UPDATE: 'orange',
  RESPONSE_UPDATE: 'cyan',
};

type PageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; stats: DashboardStats; unreadCount: number; activities: DashboardActivities; pending: DashboardPending; systemStatus: DashboardStatus };

function Home() {
  const navigate = useNavigate();
  const [pageState, setPageState] = useState<PageState>({ status: 'loading' });

  const fetchData = useCallback(async () => {
    setPageState({ status: 'loading' });
    try {
      const [stats, unread, activities, pending, systemStatus] = await Promise.all([
        dashboardService.getStats(),
        notificationService.getUnreadCount(),
        dashboardService.getActivities(),
        dashboardService.getPending(),
        dashboardService.getStatus(),
      ]);
      setPageState({
        status: 'success',
        stats,
        unreadCount: unread.count,
        activities,
        pending,
        systemStatus,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to load dashboard data';
      setPageState({ status: 'error', message });
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (pageState.status === 'loading') {
    return (
      <div style={{ textAlign: 'center', padding: '120px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (pageState.status === 'error') {
    return (
      <div style={{ padding: 24 }}>
        <Alert
          type="error"
          message="Failed to load dashboard"
          description={pageState.message}
          showIcon
          action={
            <Button size="small" onClick={fetchData}>
              Retry
            </Button>
          }
        />
      </div>
    );
  }

  const { stats, unreadCount, activities, pending, systemStatus } = pageState;

  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString();
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={4} style={{ marginBottom: 24 }}>
        Dashboard Overview
      </Title>

      {/* Platform Stats */}
      <Title level={5} style={{ marginBottom: 12, color: '#666' }}>
        Platform Stats
      </Title>
      <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Users"
              value={stats.users.total}
              prefix={<TeamOutlined />}
              suffix={
                <span style={{ fontSize: 14, color: '#52c41a' }}>
                  {stats.users.active} active
                </span>
              }
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Organizations"
              value={stats.organizations.total}
              prefix={<BankOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Products"
              value={stats.products.total}
              prefix={<ShoppingOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Demands"
              value={stats.demands.total}
              prefix={<FileTextOutlined />}
              suffix={
                <span style={{ fontSize: 14, color: '#1890ff' }}>
                  {stats.demands.published} published
                </span>
              }
            />
          </Card>
        </Col>
      </Row>

      {/* Operations */}
      <Title level={5} style={{ marginBottom: 12, color: '#666' }}>
        Operations
      </Title>
      <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Matches"
              value={stats.matching.totalMatches}
              prefix={<LinkOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            onClick={() => navigate('/notifications')}
            style={{ cursor: 'pointer' }}
          >
            <Statistic
              title="Notifications"
              value={unreadCount}
              prefix={
                <Badge count={unreadCount} size="small" offset={[4, -2]}>
                  <BellOutlined />
                </Badge>
              }
              suffix={
                <span style={{ fontSize: 14, color: unreadCount > 0 ? '#ff4d4f' : '#999' }}>
                  unread
                </span>
              }
            />
          </Card>
        </Col>
      </Row>

      {/* Pending Items */}
      <Title level={5} style={{ marginBottom: 12, color: '#666' }}>
        Pending Items
      </Title>
      <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Users Pending"
              value={pending.usersPending}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: pending.usersPending > 0 ? '#faad14' : undefined }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Demands Pending"
              value={pending.demandsPending}
              prefix={<FileSearchOutlined />}
              valueStyle={{ color: pending.demandsPending > 0 ? '#faad14' : undefined }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="RFQ Pending"
              value={pending.rfqPending}
              prefix={<ThunderboltOutlined />}
              valueStyle={{ color: pending.rfqPending > 0 ? '#faad14' : undefined }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            onClick={() => navigate('/notifications')}
            style={{ cursor: 'pointer' }}
          >
            <Statistic
              title="Unread Notifications"
              value={pending.unreadNotifications}
              prefix={<NotificationOutlined />}
              valueStyle={{ color: pending.unreadNotifications > 0 ? '#ff4d4f' : undefined }}
            />
          </Card>
        </Col>
      </Row>

      {/* Recent Activities */}
      <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
        <Col xs={24} lg={12}>
          <Card title="Recent Activities" style={{ height: '100%' }}>
            {activities.users.length === 0 &&
            activities.demands.length === 0 &&
            activities.matches.length === 0 &&
            activities.notifications.length === 0 ? (
              <Empty description="No recent activities" />
            ) : (
              <Timeline
                items={[
                  ...activities.users.map((u) => ({
                    color: 'blue',
                    dot: <UserOutlined style={{ fontSize: 16 }} />,
                    children: (
                      <div>
                        <Text strong>New User Registered</Text>
                        <br />
                        <Text type="secondary">{u.email}</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          <ClockCircleOutlined /> {formatDate(u.createdAt)}
                        </Text>
                      </div>
                    ),
                  })),
                  ...activities.demands.map((d) => ({
                    color: 'green',
                    dot: <FileTextOutlined style={{ fontSize: 16 }} />,
                    children: (
                      <div>
                        <Text strong>New Demand Created</Text>
                        <br />
                        <Text type="secondary">{d.title}</Text>
                        <Tag color={DEMAND_STATUS_COLOR[d.status] || 'default'} style={{ marginLeft: 4 }}>
                          {d.status}
                        </Tag>
                        <br />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          <ClockCircleOutlined /> {formatDate(d.createdAt)}
                        </Text>
                      </div>
                    ),
                  })),
                  ...activities.matches.map((m) => ({
                    color: 'orange',
                    dot: <LinkOutlined style={{ fontSize: 16 }} />,
                    children: (
                      <div>
                        <Text strong>New Match Generated</Text>
                        <br />
                        <Text type="secondary">Score: {(m.matchScore * 100).toFixed(0)}%</Text>
                        <Tag color={MATCH_STATUS_COLOR[m.matchStatus] || 'default'} style={{ marginLeft: 4 }}>
                          {m.matchStatus}
                        </Tag>
                        <br />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          <ClockCircleOutlined /> {formatDate(m.createdAt)}
                        </Text>
                      </div>
                    ),
                  })),
                  ...activities.notifications.map((n) => ({
                    color: 'cyan',
                    dot: <BellOutlined style={{ fontSize: 16 }} />,
                    children: (
                      <div>
                        <Text strong>Notification</Text>
                        <br />
                        <Text type="secondary">{n.title}</Text>
                        <Tag color={NOTIFICATION_TYPE_COLOR[n.type] || 'default'} style={{ marginLeft: 4 }}>
                          {n.type}
                        </Tag>
                        <br />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          <ClockCircleOutlined /> {formatDate(n.createdAt)}
                        </Text>
                      </div>
                    ),
                  })),
                ]}
              />
            )}
          </Card>
        </Col>

        {/* System Status */}
        <Col xs={24} lg={12}>
          <Card title="System Status" style={{ height: '100%' }}>
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Database">
                <Tag color="green">{systemStatus.database}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="API">
                <Tag color="green">{systemStatus.api}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Last Updated">
                {new Date(systemStatus.lastUpdated).toLocaleString()}
              </Descriptions.Item>
            </Descriptions>
            <Title level={5} style={{ marginTop: 16, marginBottom: 8 }}>
              Entity Counts
            </Title>
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Users">
                {systemStatus.entityCounts.users}
              </Descriptions.Item>
              <Descriptions.Item label="Organizations">
                {systemStatus.entityCounts.organizations}
              </Descriptions.Item>
              <Descriptions.Item label="Products">
                {systemStatus.entityCounts.products}
              </Descriptions.Item>
              <Descriptions.Item label="Demands">
                {systemStatus.entityCounts.demands}
              </Descriptions.Item>
              <Descriptions.Item label="Matches">
                {systemStatus.entityCounts.matches}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Title level={5} style={{ marginBottom: 12, color: '#666' }}>
        Quick Actions
      </Title>
      <Card style={{ marginBottom: 16 }}>
        <Space wrap>
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={() => navigate('/users/create')}
          >
            Create User
          </Button>
          <Button icon={<TeamOutlined />} onClick={() => navigate('/users')}>
            View Users
          </Button>
          <Button icon={<PlusOutlined />} onClick={() => navigate('/organizations/create')}>
            Create Organization
          </Button>
          <Button icon={<BankOutlined />} onClick={() => navigate('/organizations')}>
            View Organizations
          </Button>
          <Button icon={<ShoppingOutlined />} onClick={() => navigate('/products')}>
            View Products
          </Button>
          <Button icon={<BellOutlined />} onClick={() => navigate('/notifications')}>
            Notification Center
          </Button>
        </Space>
      </Card>
    </div>
  );
}

export default Home;