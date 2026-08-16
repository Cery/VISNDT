import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card, Statistic, Row, Col, Spin, Alert, Typography, Button, Space, Badge,
  Timeline, Descriptions, Tag, Empty, Tabs, Progress,
} from 'antd';
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
  MailOutlined,
  SnippetsOutlined,
  TagsOutlined,
  ReloadOutlined,
  RiseOutlined,
  BarChartOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  ExperimentOutlined,
} from '@ant-design/icons';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
  FunnelChart, Funnel, LabelList, Legend,
} from 'recharts';
import { dashboardService, notificationService, categoriesService } from '../api';
import type {
  DashboardStats, DashboardTrendItem, DashboardActivities,
  DashboardPending, DashboardStatus, MatchingStats,
} from '../types';

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

const PIE_COLORS = ['#1677ff', '#52c41a', '#faad14', '#ff4d4f', '#722ed1', '#13c2c2', '#eb2f96', '#a0d911'];

type PageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | {
      status: 'success';
      stats: DashboardStats;
      trend: DashboardTrendItem[];
      matchingStats: MatchingStats;
      unreadCount: number;
      activities: DashboardActivities;
      pending: DashboardPending;
      systemStatus: DashboardStatus;
      categoryCount: number;
    };

function Home() {
  const navigate = useNavigate();
  const [pageState, setPageState] = useState<PageState>({ status: 'loading' });
  const [activeTab, setActiveTab] = useState('overview');

  const fetchData = useCallback(async () => {
    setPageState({ status: 'loading' });
    try {
      const [stats, trend, matchingStats, unread, activities, pending, systemStatus, cats] =
        await Promise.all([
          dashboardService.getStats(),
          dashboardService.getTrend().catch(() => [] as DashboardTrendItem[]),
          dashboardService.getMatchingStats().catch(() => ({ totalMatches: 0, averageScore: 0, hardFailCount: 0, rematchCount: 0 }) as MatchingStats),
          notificationService.getUnreadCount(),
          dashboardService.getActivities(),
          dashboardService.getPending(),
          dashboardService.getStatus(),
          categoriesService.getList().catch(() => []),
        ]);
      setPageState({
        status: 'success',
        stats,
        trend: Array.isArray(trend) ? trend : [],
        matchingStats,
        unreadCount: unread.count,
        activities,
        pending,
        systemStatus,
        categoryCount: cats.length,
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

  const { stats, trend, matchingStats, unreadCount, activities, pending, systemStatus, categoryCount } = pageState;

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

  const formatTrendDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  };

  // ============================================
  // Chart Data
  // ============================================

  // Entity distribution pie data
  const entityPieData = [
    { name: '产品', value: stats.products.total, color: PIE_COLORS[0] },
    { name: '内容', value: stats.content.total, color: PIE_COLORS[1] },
    { name: '用户', value: stats.users.total, color: PIE_COLORS[2] },
    { name: '组织', value: stats.organizations.total, color: PIE_COLORS[3] },
    { name: '需求', value: stats.demands.total, color: PIE_COLORS[4] },
    { name: '匹配', value: stats.matching.totalMatches, color: PIE_COLORS[5] },
  ].filter((d) => d.value > 0);

  // Business funnel data - real data from stats
  const funnelData = [
    { name: '产品库', value: stats.products.total, fill: '#1677ff' },
    { name: '内容', value: stats.content.total, fill: '#52c41a' },
    { name: '询价', value: stats.inquiries.total, fill: '#faad14' },
    { name: '需求', value: stats.demands.total, fill: '#722ed1' },
    { name: 'RFQ', value: stats.rfqs.total, fill: '#13c2c2' },
    { name: '报价', value: stats.offers.total, fill: '#eb2f96' },
    { name: '匹配', value: stats.matching.totalMatches, fill: '#a0d911' },
  ];

  // Trend data - from real analytics or fallback to entity counts
  const hasTrendData = trend.length > 0 && trend.some((t) => t.pageViews > 0);
  const trendChartData = hasTrendData
    ? trend.map((t) => ({
        date: formatTrendDate(t.date),
        pageViews: t.pageViews,
        productViews: t.productViews,
        contentViews: t.contentViews,
        searches: t.searches,
        inquiries: t.inquiries,
      }))
    : [];

  // Bar chart data for entity comparison
  const entityBarData = [
    { name: '产品', count: stats.products.total },
    { name: '内容', count: stats.content.total },
    { name: '用户', count: stats.users.total },
    { name: '组织', count: stats.organizations.total },
    { name: '询价', count: stats.inquiries.total },
    { name: '需求', count: stats.demands.total },
    { name: 'RFQ', count: stats.rfqs.total },
    { name: '报价', count: stats.offers.total },
    { name: '匹配', count: stats.matching.totalMatches },
    { name: '分类', count: categoryCount },
  ];

  // Matching intelligence stats
  const matchScorePercent = matchingStats.totalMatches > 0
    ? Math.round((matchingStats.averageScore || 0) * 100)
    : 0;

  const tabItems = [
    {
      key: 'overview',
      label: '运营概览',
      children: (
        <div>
          {/* ===== Platform KPIs ===== */}
          <Title level={5} style={{ marginBottom: 12, color: '#666' }}>
            平台统计
          </Title>
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={12} sm={8} lg={4}>
              <Card hoverable onClick={() => navigate('/products')} style={{ cursor: 'pointer' }}>
                <Statistic
                  title="产品"
                  value={stats.products.total}
                  prefix={<ShoppingOutlined />}
                />
              </Card>
            </Col>
            <Col xs={12} sm={8} lg={4}>
              <Card hoverable onClick={() => navigate('/content')} style={{ cursor: 'pointer' }}>
                <Statistic
                  title="内容"
                  value={stats.content.total}
                  prefix={<FileTextOutlined />}
                />
              </Card>
            </Col>
            <Col xs={12} sm={8} lg={4}>
              <Card hoverable onClick={() => navigate('/users')} style={{ cursor: 'pointer' }}>
                <Statistic
                  title="用户"
                  value={stats.users.total}
                  prefix={<TeamOutlined />}
                  suffix={
                    <span style={{ fontSize: 12, color: '#52c41a' }}>
                      {stats.users.active} 活跃
                    </span>
                  }
                />
              </Card>
            </Col>
            <Col xs={12} sm={8} lg={4}>
              <Card hoverable onClick={() => navigate('/organizations')} style={{ cursor: 'pointer' }}>
                <Statistic
                  title="组织"
                  value={stats.organizations.total}
                  prefix={<BankOutlined />}
                />
              </Card>
            </Col>
            <Col xs={12} sm={8} lg={4}>
              <Card hoverable onClick={() => navigate('/product-categories')} style={{ cursor: 'pointer' }}>
                <Statistic
                  title="分类"
                  value={categoryCount}
                  prefix={<TagsOutlined />}
                />
              </Card>
            </Col>
            <Col xs={12} sm={8} lg={4}>
              <Card hoverable onClick={() => navigate('/notifications')} style={{ cursor: 'pointer' }}>
                <Statistic
                  title="通知"
                  value={unreadCount}
                  prefix={
                    <Badge count={unreadCount} size="small" offset={[4, -2]}>
                      <BellOutlined />
                    </Badge>
                  }
                  suffix={
                    <span style={{ fontSize: 12, color: unreadCount > 0 ? '#ff4d4f' : '#999' }}>
                      未读
                    </span>
                  }
                />
              </Card>
            </Col>
          </Row>

          {/* ===== Business KPIs ===== */}
          <Title level={5} style={{ marginBottom: 12, color: '#666' }}>
            <BarChartOutlined style={{ marginRight: 6 }} />
            商业运营
          </Title>
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={12} sm={8} lg={4}>
              <Card hoverable onClick={() => navigate('/inquiries')} style={{ cursor: 'pointer' }}>
                <Statistic
                  title="询价"
                  value={stats.inquiries.total}
                  prefix={<MailOutlined />}
                  valueStyle={{ color: stats.inquiries.total > 0 ? '#faad14' : undefined }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={8} lg={4}>
              <Card hoverable onClick={() => navigate('/demands')} style={{ cursor: 'pointer' }}>
                <Statistic
                  title="需求"
                  value={stats.demands.total}
                  prefix={<FileSearchOutlined />}
                  suffix={
                    <span style={{ fontSize: 12, color: '#1890ff' }}>
                      {stats.demands.published} 已发布
                    </span>
                  }
                />
              </Card>
            </Col>
            <Col xs={12} sm={8} lg={4}>
              <Card hoverable onClick={() => navigate('/rfqs')} style={{ cursor: 'pointer' }}>
                <Statistic
                  title="RFQ"
                  value={stats.rfqs.total}
                  prefix={<SnippetsOutlined />}
                />
              </Card>
            </Col>
            <Col xs={12} sm={8} lg={4}>
              <Card hoverable onClick={() => navigate('/offers')} style={{ cursor: 'pointer' }}>
                <Statistic
                  title="报价"
                  value={stats.offers.total}
                  prefix={<TagsOutlined />}
                />
              </Card>
            </Col>
            <Col xs={12} sm={8} lg={4}>
              <Card hoverable onClick={() => navigate('/matching')} style={{ cursor: 'pointer' }}>
                <Statistic
                  title="匹配"
                  value={stats.matching.totalMatches}
                  prefix={<LinkOutlined />}
                />
              </Card>
            </Col>
            <Col xs={12} sm={8} lg={4}>
              <Card hoverable onClick={() => navigate('/notifications')} style={{ cursor: 'pointer' }}>
                <Statistic
                  title="通知"
                  value={unreadCount}
                  prefix={
                    <Badge count={unreadCount} size="small" offset={[4, -2]}>
                      <BellOutlined />
                    </Badge>
                  }
                  suffix={
                    <span style={{ fontSize: 12, color: unreadCount > 0 ? '#ff4d4f' : '#999' }}>
                      未读
                    </span>
                  }
                />
              </Card>
            </Col>
          </Row>

          {/* ===== Matching Intelligence Overview ===== */}
          <Title level={5} style={{ marginBottom: 12, color: '#666' }}>
            <ExperimentOutlined style={{ marginRight: 6 }} />
            匹配引擎状态
          </Title>
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={12} sm={6} lg={6}>
              <Card>
                <Statistic
                  title="总匹配数"
                  value={matchingStats.totalMatches}
                  prefix={<LinkOutlined />}
                  valueStyle={{ color: '#1677ff' }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6} lg={6}>
              <Card>
                <Statistic
                  title="平均匹配度"
                  value={matchScorePercent}
                  suffix="%"
                  prefix={<RiseOutlined />}
                  valueStyle={{ color: matchScorePercent >= 50 ? '#52c41a' : '#faad14' }}
                />
                <Progress
                  percent={matchScorePercent}
                  showInfo={false}
                  strokeColor={matchScorePercent >= 50 ? '#52c41a' : '#faad14'}
                  size="small"
                  style={{ marginTop: 4 }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6} lg={6}>
              <Card
                hoverable
                onClick={() => navigate('/matching')}
                style={{ cursor: 'pointer' }}
              >
                <Statistic
                  title="硬失败"
                  value={matchingStats.hardFailCount}
                  prefix={<CloseCircleOutlined />}
                  valueStyle={{ color: matchingStats.hardFailCount > 0 ? '#ff4d4f' : '#999' }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6} lg={6}>
              <Card
                hoverable
                onClick={() => navigate('/matching')}
                style={{ cursor: 'pointer' }}
              >
                <Statistic
                  title="重新匹配"
                  value={matchingStats.rematchCount}
                  prefix={<SyncOutlined />}
                  valueStyle={{ color: matchingStats.rematchCount > 0 ? '#722ed1' : '#999' }}
                />
              </Card>
            </Col>
          </Row>

          {/* ===== Pending Items ===== */}
          <Title level={5} style={{ marginBottom: 12, color: '#666' }}>
            <ExclamationCircleOutlined style={{ marginRight: 6 }} />
            待处理事项
          </Title>
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={12} sm={6} lg={4}>
              <Card>
                <Statistic
                  title="待处理用户"
                  value={pending.usersPending}
                  prefix={<ExclamationCircleOutlined />}
                  valueStyle={{ color: pending.usersPending > 0 ? '#faad14' : undefined }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6} lg={4}>
              <Card>
                <Statistic
                  title="待处理询价"
                  value={pending.inquiriesPending}
                  prefix={<ThunderboltOutlined />}
                  valueStyle={{ color: pending.inquiriesPending > 0 ? '#faad14' : undefined }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6} lg={4}>
              <Card>
                <Statistic
                  title="待处理需求"
                  value={pending.demandsPending}
                  prefix={<FileSearchOutlined />}
                  valueStyle={{ color: pending.demandsPending > 0 ? '#faad14' : undefined }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6} lg={4}>
              <Card>
                <Statistic
                  title="待处理RFQ"
                  value={pending.rfqPending}
                  prefix={<SnippetsOutlined />}
                  valueStyle={{ color: pending.rfqPending > 0 ? '#faad14' : undefined }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6} lg={4}>
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
        </div>
      ),
    },
    {
      key: 'charts',
      label: '数据图表',
      children: (
        <div>
          {/* ===== Trend Chart - Real Data ===== */}
          <Card title="平台趋势（近7天）" style={{ marginBottom: 16 }}>
            {hasTrendData ? (
              <Text type="secondary" style={{ display: 'block', marginBottom: 16, fontSize: 12 }}>
                基于 ConversionEvent 真实事件数据，展示近7天平台用户行为趋势
              </Text>
            ) : (
              <Text type="secondary" style={{ display: 'block', marginBottom: 16, fontSize: 12 }}>
                暂无趋势数据，ConversionEvent 数据积累后趋势图将自动展示
              </Text>
            )}
            {hasTrendData ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={trendChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPageViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1677ff" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#1677ff" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorProductViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#52c41a" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#52c41a" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorContentViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#722ed1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#722ed1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorSearches" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#faad14" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#faad14" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorInquiries2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#eb2f96" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#eb2f96" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" name="页面浏览" dataKey="pageViews" stroke="#1677ff" fill="url(#colorPageViews)" />
                  <Area type="monotone" name="产品浏览" dataKey="productViews" stroke="#52c41a" fill="url(#colorProductViews)" />
                  <Area type="monotone" name="内容浏览" dataKey="contentViews" stroke="#722ed1" fill="url(#colorContentViews)" />
                  <Area type="monotone" name="搜索" dataKey="searches" stroke="#faad14" fill="url(#colorSearches)" />
                  <Area type="monotone" name="询价" dataKey="inquiries" stroke="#eb2f96" fill="url(#colorInquiries2)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <Empty description="暂无趋势数据" />
            )}
          </Card>

          {/* ===== Entity Distribution + Business Funnel ===== */}
          <Row gutter={16}>
            <Col xs={24} lg={12}>
              <Card title="实体分布" style={{ marginBottom: 16 }}>
                {entityPieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={entityPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={3}
                        dataKey="value"
                        label={({ name, percent }: { name?: string; percent?: number }) =>
                          `${name ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`
                        }
                      >
                        {entityPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <Empty description="暂无数据" />
                )}
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card
                title="商业转化漏斗"
                style={{ marginBottom: 16 }}
              >
                <Text type="secondary" style={{ display: 'block', marginBottom: 16, fontSize: 12 }}>
                  产品 → 内容 → 询价 → 需求 → RFQ → 报价 → 匹配 全链路转化
                </Text>
                {funnelData.some((d) => d.value > 0) ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <FunnelChart>
                      <Tooltip />
                      <Funnel dataKey="value" data={funnelData} isAnimationActive>
                        <LabelList position="right" fill="#000" stroke="none" dataKey="name" />
                      </Funnel>
                    </FunnelChart>
                  </ResponsiveContainer>
                ) : (
                  <Empty description="暂无转化数据" />
                )}
              </Card>
            </Col>
          </Row>

          {/* ===== Entity Bar Chart ===== */}
          <Card title="实体数量对比" style={{ marginBottom: 16 }}>
            <Text type="secondary" style={{ display: 'block', marginBottom: 16, fontSize: 12 }}>
              各业务实体数量横向对比
            </Text>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={entityBarData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#1677ff" radius={[4, 4, 0, 0]}>
                  {entityBarData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      ),
    },
    {
      key: 'activity',
      label: '最近活动',
      children: (
        <Row gutter={[16, 16]}>
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
                          <Tag
                            color={MATCH_STATUS_COLOR[m.matchStatus] || 'default'}
                            style={{ marginLeft: 4 }}
                          >
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
                          <Tag
                            color={NOTIFICATION_TYPE_COLOR[n.type] || 'default'}
                            style={{ marginLeft: 4 }}
                          >
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
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <div>
          <Title level={4} style={{ marginBottom: 4 }}>
            运营驾驶舱
          </Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            VISNDT 工业检测平台运营中心
          </Text>
        </div>
        <Space>
          <Text type="secondary" style={{ fontSize: 12 }}>
            更新于 {new Date(systemStatus.lastUpdated).toLocaleString()}
          </Text>
          <Button icon={<ReloadOutlined />} onClick={fetchData} size="small">
            刷新
          </Button>
        </Space>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        style={{ marginBottom: 16 }}
      />

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