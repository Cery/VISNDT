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
        err instanceof Error ? err.message : '加载仪表盘数据失败';
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
          message="加载仪表盘失败"
          description={pageState.message}
          showIcon
          action={
            <Button size="small" onClick={fetchData}>
              重试
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

    if (diffMins < 1) return '刚刚';
    if (diffMins < 60) return `${diffMins}分钟前`;
    if (diffHours < 24) return `${diffHours}小时前`;
    if (diffDays < 7) return `${diffDays}天前`;
    return d.toLocaleDateString();
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={4} style={{ marginBottom: 24 }}>
        仪表盘概览
      </Title>

      {/* Platform Stats */}
      <Title level={5} style={{ marginBottom: 12, color: '#666' }}>
        平台统计
      </Title>
      <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="用户"
              value={stats.users.total}
              prefix={<TeamOutlined />}
              suffix={
                <span style={{ fontSize: 14, color: '#52c41a' }}>
                  {stats.users.active} 活跃
                </span>
              }
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="组织"
              value={stats.organizations.total}
              prefix={<BankOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="产品"
              value={stats.products.total}
              prefix={<ShoppingOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="需求"
              value={stats.demands.total}
              prefix={<FileTextOutlined />}
              suffix={
                <span style={{ fontSize: 14, color: '#1890ff' }}>
                  {stats.demands.published} 已发布
                </span>
              }
            />
          </Card>
        </Col>
      </Row>

      {/* Operations */}
      <Title level={5} style={{ marginBottom: 12, color: '#666' }}>
        运营数据
      </Title>
      <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="匹配"
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
              title="通知"
              value={unreadCount}
              prefix={
                <Badge count={unreadCount} size="small" offset={[4, -2]}>
                  <BellOutlined />
                </Badge>
              }
              suffix={
                <span style={{ fontSize: 14, color: unreadCount > 0 ? '#ff4d4f' : '#999' }}>
                  未读
                </span>
              }
            />
          </Card>
        </Col>
      </Row>

      {/* Pending Items */}
      <Title level={5} style={{ marginBottom: 12, color: '#666' }}>
        待处理事项
      </Title>
      <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="待处理用户"
              value={pending.usersPending}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: pending.usersPending > 0 ? '#faad14' : undefined }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="待处理需求"
              value={pending.demandsPending}
              prefix={<FileSearchOutlined />}
              valueStyle={{ color: pending.demandsPending > 0 ? '#faad14' : undefined }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="待处理询价"
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
              title="未读通知"
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
          <Card title="最近活动" style={{ height: '100%' }}>
            {activities.users.length === 0 &&
            activities.demands.length === 0 &&
            activities.matches.length === 0 &&
            activities.notifications.length === 0 ? (
              <Empty description="暂无最近活动" />
            ) : (
              <Timeline
                items={[
                  ...activities.users.map((u) => ({
                    color: 'blue',
                    dot: <UserOutlined style={{ fontSize: 16 }} />,
                    children: (
                      <div>
                        <Text strong>新用户注册</Text>
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
                        <Text strong>新需求创建</Text>
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
                        <Text strong>新匹配生成</Text>
                        <br />
                        <Text type="secondary">匹配度： {(m.matchScore * 100).toFixed(0)}%</Text>
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
                        <Text strong>通知</Text>
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
          <Card title="系统状态" style={{ height: '100%' }}>
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="数据库">
                <Tag color="green">{systemStatus.database}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="API">
                <Tag color="green">{systemStatus.api}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="最后更新">
                {new Date(systemStatus.lastUpdated).toLocaleString()}
              </Descriptions.Item>
            </Descriptions>
            <Title level={5} style={{ marginTop: 16, marginBottom: 8 }}>
              实体数量
            </Title>
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="用户">
                {systemStatus.entityCounts.users}
              </Descriptions.Item>
              <Descriptions.Item label="组织">
                {systemStatus.entityCounts.organizations}
              </Descriptions.Item>
              <Descriptions.Item label="产品">
                {systemStatus.entityCounts.products}
              </Descriptions.Item>
              <Descriptions.Item label="需求">
                {systemStatus.entityCounts.demands}
              </Descriptions.Item>
              <Descriptions.Item label="匹配">
                {systemStatus.entityCounts.matches}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Title level={5} style={{ marginBottom: 12, color: '#666' }}>
        快捷操作
      </Title>
      <Card style={{ marginBottom: 16 }}>
        <Space wrap>
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={() => navigate('/users/create')}
          >
            创建用户
          </Button>
          <Button icon={<TeamOutlined />} onClick={() => navigate('/users')}>
            查看用户
          </Button>
          <Button icon={<PlusOutlined />} onClick={() => navigate('/organizations/create')}>
            创建组织
          </Button>
          <Button icon={<BankOutlined />} onClick={() => navigate('/organizations')}>
            查看组织
          </Button>
          <Button icon={<ShoppingOutlined />} onClick={() => navigate('/products')}>
            查看产品
          </Button>
          <Button icon={<BellOutlined />} onClick={() => navigate('/notifications')}>
            通知中心
          </Button>
        </Space>
      </Card>
    </div>
  );
}

export default Home;