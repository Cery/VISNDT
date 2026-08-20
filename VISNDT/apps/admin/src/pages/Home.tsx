import { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card, Statistic, Row, Col, Spin, Alert, Typography, Button, Space, Badge,
  Timeline, Descriptions, Tag, Empty, Tabs, Progress, Divider,
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
  SettingOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  ExperimentOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  DashboardOutlined,
  AppstoreOutlined,
  SafetyOutlined,
} from '@ant-design/icons';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell,
  FunnelChart, Funnel, LabelList, Legend,
} from 'recharts';
import { dashboardService, notificationService, categoriesService, parameterDefinitionService } from '../api';
import type {
  DashboardStats, DashboardTrendItem, DashboardStatus, MatchingStats,
} from '../types';
import { VISNDT_COLORS, CHART_PALETTE, resolveStatusTone } from '../components/design-system/tokens';

const { Title, Text } = Typography;

// ============================================
// Industrial Dashboard Design Tokens
// ============================================
const DASHBOARD = {
  sectionGap: 24,
  cardGap: 16,
  accentWidth: 4,
  accentHeight: 18,
  accentRadius: 2,
  headerGap: 8,
} as const;

// ============================================
// Section Header Component
// ============================================
function SectionHeader({
  title,
  icon,
  accentColor = VISNDT_COLORS.primary,
  subtitle,
}: {
  title: string;
  icon?: React.ReactNode;
  accentColor?: string;
  subtitle?: string;
}) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: DASHBOARD.headerGap }}>
        <div
          style={{
            width: DASHBOARD.accentWidth,
            height: DASHBOARD.accentHeight,
            borderRadius: DASHBOARD.accentRadius,
            background: accentColor,
            flexShrink: 0,
          }}
        />
        {icon && (
          <span style={{ color: accentColor, fontSize: 16 }}>{icon}</span>
        )}
        <Title level={5} style={{ margin: 0 }}>
          {title}
        </Title>
      </div>
      {subtitle && (
        <Text type="secondary" style={{ fontSize: 12, marginLeft: DASHBOARD.accentWidth + DASHBOARD.headerGap + (icon ? 24 : 0), display: 'block', marginTop: 2 }}>
          {subtitle}
        </Text>
      )}
    </div>
  );
}

// ============================================
// Enhanced StatCard Component
// ============================================
function StatCard({
  title,
  value,
  prefix,
  suffix,
  color,
  onClick,
  hoverable = true,
  trend,
  badge,
}: {
  title: string;
  value: number | string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  color?: string;
  onClick?: () => void;
  hoverable?: boolean;
  trend?: { direction: 'up' | 'down'; label: string };
  badge?: { count: number; color?: string };
}) {
  return (
    <Card
      hoverable={hoverable && !!onClick}
      onClick={onClick}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease',
        borderTop: color ? `3px solid ${color}` : undefined,
      }}
      styles={{ body: { padding: '16px 20px' } }}
    >
      <Statistic
        title={
          <span style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>
            {title}
          </span>
        }
        value={value}
        prefix={
          <span style={{ color: color || VISNDT_COLORS.primary }}>
            {prefix}
          </span>
        }
        suffix={suffix}
        valueStyle={{
          color: color || '#0f172a',
          fontSize: 28,
          fontWeight: 700,
          lineHeight: 1.2,
        }}
      />
      {trend && (
        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
          {trend.direction === 'up' ? (
            <ArrowUpOutlined style={{ color: VISNDT_COLORS.success, fontSize: 12 }} />
          ) : (
            <ArrowDownOutlined style={{ color: VISNDT_COLORS.error, fontSize: 12 }} />
          )}
          <Text
            style={{
              fontSize: 12,
              color: trend.direction === 'up' ? VISNDT_COLORS.success : VISNDT_COLORS.error,
            }}
          >
            {trend.label}
          </Text>
        </div>
      )}
      {badge && badge.count > 0 && (
        <div style={{ marginTop: 8 }}>
          <Badge
            count={badge.count}
            style={{ backgroundColor: badge.color || VISNDT_COLORS.warning }}
            overflowCount={999}
          />
        </div>
      )}
    </Card>
  );
}

// ============================================
// Platform Health Banner
// ============================================
function PlatformHealthBanner({
  stats,
  systemStatus,
}: {
  stats: DashboardStats;
  systemStatus: DashboardStatus;
}) {
  const healthItems = [
    { label: '数据库', status: systemStatus.database === 'CONNECTED' ? 'ok' as const : 'warn' as const },
    { label: 'API', status: systemStatus.api === 'ONLINE' ? 'ok' as const : 'warn' as const },
    { label: '产品', status: stats.products.total > 0 ? 'ok' as const : 'warn' as const, value: stats.products.total },
    { label: '匹配引擎', status: stats.matching.totalMatches > 0 ? 'ok' as const : 'info' as const, value: stats.matching.totalMatches },
    { label: '活跃用户', status: stats.users.active > 0 ? 'ok' as const : 'info' as const, value: stats.users.active },
  ];

  const okCount = healthItems.filter((h) => h.status === 'ok').length;
  const overallHealth = okCount === healthItems.length ? 'healthy' : okCount >= 3 ? 'degraded' : 'attention';

  const healthColor = overallHealth === 'healthy' ? VISNDT_COLORS.success : overallHealth === 'degraded' ? VISNDT_COLORS.warning : VISNDT_COLORS.error;

  return (
    <Card
      style={{
        marginBottom: DASHBOARD.sectionGap,
        background: `linear-gradient(135deg, ${VISNDT_COLORS.industrialSlate} 0%, #1a2744 100%)`,
        border: 'none',
        borderRadius: 10,
      }}
      styles={{ body: { padding: '20px 24px' } }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: `linear-gradient(135deg, ${VISNDT_COLORS.primary}, ${VISNDT_COLORS.industrialCyan})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <DashboardOutlined style={{ color: '#fff', fontSize: 20 }} />
          </div>
          <div>
            <div style={{ color: '#fff', fontSize: 16, fontWeight: 700 }}>
              平台运营中心
            </div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>
              VISNDT Industrial Operation Console · 实时平台健康监控
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          {healthItems.map((item) => (
            <div key={item.label} style={{ textAlign: 'center', minWidth: 60 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center', marginBottom: 4 }}>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: item.status === 'ok' ? VISNDT_COLORS.success : item.status === 'warn' ? VISNDT_COLORS.warning : VISNDT_COLORS.info,
                    display: 'inline-block',
                    boxShadow: `0 0 6px ${item.status === 'ok' ? VISNDT_COLORS.success : item.status === 'warn' ? VISNDT_COLORS.warning : VISNDT_COLORS.info}`,
                  }}
                />
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11 }}>{item.label}</span>
              </div>
              {item.value !== undefined && (
                <span style={{ color: '#fff', fontSize: 18, fontWeight: 700 }}>
                  {item.value}
                </span>
              )}
            </div>
          ))}
          <div style={{ textAlign: 'center', minWidth: 60 }}>
            <div style={{ marginBottom: 4 }}>
              <Tag
                color={overallHealth === 'healthy' ? 'success' : overallHealth === 'degraded' ? 'warning' : 'error'}
                style={{ margin: 0, fontSize: 11 }}
              >
                {overallHealth === 'healthy' ? '运行正常' : overallHealth === 'degraded' ? '部分降级' : '需要关注'}
              </Tag>
            </div>
            <span style={{ color: healthColor, fontSize: 18, fontWeight: 700 }}>
              {okCount}/{healthItems.length}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

// ============================================
// Main Home Component
// ============================================
type PageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | {
      status: 'success';
      stats: DashboardStats;
      trend: DashboardTrendItem[];
      matchingStats: MatchingStats;
      unreadCount: number;
      activities: { users: { email: string; createdAt: string }[]; demands: { title: string; status: string; createdAt: string }[]; matches: { matchScore: number; matchStatus: string; createdAt: string }[]; notifications: { title: string; type: string; createdAt: string }[] };
      pending: { usersPending: number; inquiriesPending: number; demandsPending: number; rfqPending: number; unreadNotifications: number };
      systemStatus: DashboardStatus;
      categoryCount: number;
      parameterCount: number;
    };

function Home() {
  const navigate = useNavigate();
  const [pageState, setPageState] = useState<PageState>({ status: 'loading' });
  const [activeTab, setActiveTab] = useState('overview');

  const fetchData = useCallback(async () => {
    setPageState({ status: 'loading' });
    try {
      const [stats, trend, matchingStats, unread, activities, pending, systemStatus, cats, params] =
        await Promise.all([
          dashboardService.getStats(),
          dashboardService.getTrend().catch(() => [] as DashboardTrendItem[]),
          dashboardService.getMatchingStats().catch(() => ({ totalMatches: 0, averageScore: 0, hardFailCount: 0, rematchCount: 0 }) as MatchingStats),
          notificationService.getUnreadCount(),
          dashboardService.getActivities(),
          dashboardService.getPending(),
          dashboardService.getStatus(),
          categoriesService.getList().catch(() => []),
          parameterDefinitionService.getList({ page: 1, pageSize: 1 }).catch(() => ({ data: [], total: 0, page: 1, pageSize: 1, totalPages: 0 })),
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
        parameterCount: params.total,
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

  // ============================================
  // Chart Data Preparation
  // （提升至 Loading/Error 条件返回之前，保证 hooks 调用顺序稳定）
  // ============================================

  // Entity distribution pie data
  const entityPieData = useMemo(() => {
    if (pageState.status !== 'success') return [];
    const st = pageState.stats;
    return [
      { name: '产品', value: st.products.total, color: CHART_PALETTE[0] },
      { name: '内容', value: st.content.total, color: CHART_PALETTE[1] },
      { name: '用户', value: st.users.total, color: CHART_PALETTE[2] },
      { name: '组织', value: st.organizations.total, color: CHART_PALETTE[3] },
      { name: '需求', value: st.demands.total, color: CHART_PALETTE[4] },
      { name: '匹配', value: st.matching.totalMatches, color: CHART_PALETTE[5] },
    ].filter((d) => d.value > 0);
  }, [pageState]);

  // Business funnel data
  const funnelData = useMemo(() => {
    if (pageState.status !== 'success') return [];
    const st = pageState.stats;
    return [
      { name: '产品库', value: st.products.total, fill: CHART_PALETTE[0] },
      { name: '内容', value: st.content.total, fill: CHART_PALETTE[1] },
      { name: '询价', value: st.inquiries.total, fill: CHART_PALETTE[2] },
      { name: '需求', value: st.demands.total, fill: CHART_PALETTE[3] },
      { name: 'RFQ', value: st.rfqs.total, fill: CHART_PALETTE[4] },
      { name: '报价', value: st.offers.total, fill: CHART_PALETTE[5] },
      { name: '匹配', value: st.matching.totalMatches, fill: CHART_PALETTE[6] },
    ];
  }, [pageState]);

  // Entity bar chart
  const entityBarData = useMemo(() => {
    if (pageState.status !== 'success') return [];
    const st = pageState.stats;
    return [
      { name: '产品', count: st.products.total },
      { name: '内容', count: st.content.total },
      { name: '用户', count: st.users.total },
      { name: '组织', count: st.organizations.total },
      { name: '询价', count: st.inquiries.total },
      { name: '需求', count: st.demands.total },
      { name: 'RFQ', count: st.rfqs.total },
      { name: '报价', count: st.offers.total },
      { name: '匹配', count: st.matching.totalMatches },
      { name: '分类', count: pageState.categoryCount },
    ];
  }, [pageState]);

  // ============================================
  // Loading State
  // ============================================
  if (pageState.status === 'loading') {
    return (
      <div style={{ padding: DASHBOARD.sectionGap }}>
        <div style={{ textAlign: 'center', padding: '120px 0' }}>
          <Spin size="large" />
          <div style={{ marginTop: 16 }}>
            <Text type="secondary">正在加载平台运营数据...</Text>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // Error State
  // ============================================
  if (pageState.status === 'error') {
    return (
      <div style={{ padding: DASHBOARD.sectionGap }}>
        <Alert
          type="error"
          message="仪表盘加载失败"
          description={pageState.message}
          showIcon
          action={
            <Space direction="vertical" size={8}>
              <Button size="small" type="primary" onClick={fetchData}>
                重新加载
              </Button>
              <Button size="small" onClick={() => navigate('/analytics')}>
                前往数据分析
              </Button>
            </Space>
          }
        />
      </div>
    );
  }

  const { stats, trend, matchingStats, unreadCount, activities, pending, systemStatus, categoryCount, parameterCount } = pageState;

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
  // Trend data preparation
  // ============================================

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

  // Matching intelligence stats
  const matchScorePercent = matchingStats.totalMatches > 0
    ? Math.round((matchingStats.averageScore || 0) * 100)
    : 0;

  // ============================================
  // Calculate platform health
  // ============================================
  const totalPendingItems = pending.usersPending + pending.inquiriesPending + pending.demandsPending + pending.rfqPending + pending.unreadNotifications;

  const tabItems = [
    {
      key: 'overview',
      label: '运营概览',
      children: (
        <div>
          {/* ===== Platform Capability Overview ===== */}
          <SectionHeader
            title="能力总览"
            icon={<AppstoreOutlined />}
            accentColor={VISNDT_COLORS.primary}
            subtitle="平台核心资产与能力覆盖"
          />
          <Row gutter={[DASHBOARD.cardGap, DASHBOARD.cardGap]} style={{ marginBottom: DASHBOARD.sectionGap }}>
            <Col xs={12} sm={8} lg={4}>
              <StatCard
                title="产品"
                value={stats.products.total}
                prefix={<ShoppingOutlined />}
                color={CHART_PALETTE[0]}
                onClick={() => navigate('/products')}
              />
            </Col>
            <Col xs={12} sm={8} lg={4}>
              <StatCard
                title="内容"
                value={stats.content.total}
                prefix={<FileTextOutlined />}
                color={VISNDT_COLORS.success}
                onClick={() => navigate('/content')}
              />
            </Col>
            <Col xs={12} sm={8} lg={4}>
              <StatCard
                title="用户"
                value={stats.users.total}
                prefix={<TeamOutlined />}
                color={CHART_PALETTE[2]}
                onClick={() => navigate('/users')}
                suffix={
                  <span style={{ fontSize: 12, color: VISNDT_COLORS.success }}>
                    {stats.users.active} 活跃
                  </span>
                }
              />
            </Col>
            <Col xs={12} sm={8} lg={4}>
              <StatCard
                title="组织"
                value={stats.organizations.total}
                prefix={<BankOutlined />}
                color={CHART_PALETTE[3]}
                onClick={() => navigate('/organizations')}
              />
            </Col>
            <Col xs={12} sm={8} lg={4}>
              <StatCard
                title="分类"
                value={categoryCount}
                prefix={<TagsOutlined />}
                color={CHART_PALETTE[4]}
                onClick={() => navigate('/product-categories')}
              />
            </Col>
            <Col xs={12} sm={8} lg={4}>
              <StatCard
                title="参数"
                value={parameterCount}
                prefix={<SettingOutlined />}
                color={CHART_PALETTE[5]}
                onClick={() => navigate('/parameter-definitions')}
              />
            </Col>
          </Row>

          {/* ===== Business Flow Overview ===== */}
          <SectionHeader
            title="业务流转"
            icon={<BarChartOutlined />}
            accentColor={VISNDT_COLORS.success}
            subtitle="需求到匹配的完整业务闭环"
          />
          <Row gutter={[DASHBOARD.cardGap, DASHBOARD.cardGap]} style={{ marginBottom: DASHBOARD.sectionGap }}>
            <Col xs={12} sm={8} lg={4}>
              <StatCard
                title="询价"
                value={stats.inquiries.total}
                prefix={<MailOutlined />}
                color={VISNDT_COLORS.warning}
                onClick={() => navigate('/inquiries')}
              />
            </Col>
            <Col xs={12} sm={8} lg={4}>
              <StatCard
                title="需求"
                value={stats.demands.total}
                prefix={<FileSearchOutlined />}
                color={CHART_PALETTE[3]}
                onClick={() => navigate('/demands')}
                suffix={
                  <span style={{ fontSize: 12, color: VISNDT_COLORS.primary }}>
                    {stats.demands.published} 已发布
                  </span>
                }
              />
            </Col>
            <Col xs={12} sm={8} lg={4}>
              <StatCard
                title="RFQ"
                value={stats.rfqs.total}
                prefix={<SnippetsOutlined />}
                color={CHART_PALETTE[4]}
                onClick={() => navigate('/rfqs')}
              />
            </Col>
            <Col xs={12} sm={8} lg={4}>
              <StatCard
                title="报价"
                value={stats.offers.total}
                prefix={<TagsOutlined />}
                color={CHART_PALETTE[5]}
                onClick={() => navigate('/offers')}
              />
            </Col>
            <Col xs={12} sm={8} lg={4}>
              <StatCard
                title="匹配"
                value={stats.matching.totalMatches}
                prefix={<LinkOutlined />}
                color={CHART_PALETTE[6]}
                onClick={() => navigate('/matching')}
              />
            </Col>
            <Col xs={12} sm={8} lg={4}>
              <StatCard
                title="未读通知"
                value={unreadCount}
                prefix={<BellOutlined />}
                color={unreadCount > 0 ? VISNDT_COLORS.error : VISNDT_COLORS.neutral}
                onClick={() => navigate('/notifications')}
                badge={unreadCount > 0 ? { count: unreadCount, color: VISNDT_COLORS.error } : undefined}
              />
            </Col>
          </Row>

          {/* ===== Matching Engine Status ===== */}
          <SectionHeader
            title="匹配引擎状态"
            icon={<ExperimentOutlined />}
            accentColor={CHART_PALETTE[3]}
            subtitle="确定性匹配引擎运行指标"
          />
          <Row gutter={[DASHBOARD.cardGap, DASHBOARD.cardGap]} style={{ marginBottom: DASHBOARD.sectionGap }}>
            <Col xs={12} sm={6} lg={6}>
              <Card style={{ borderTop: `3px solid ${VISNDT_COLORS.primary}` }}>
                <Statistic
                  title="总匹配数"
                  value={matchingStats.totalMatches}
                  prefix={<LinkOutlined />}
                  valueStyle={{ color: VISNDT_COLORS.primary, fontSize: 28, fontWeight: 700 }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6} lg={6}>
              <Card style={{ borderTop: `3px solid ${matchScorePercent >= 50 ? VISNDT_COLORS.success : VISNDT_COLORS.warning}` }}>
                <Statistic
                  title="平均匹配度"
                  value={matchScorePercent}
                  suffix="%"
                  prefix={<RiseOutlined />}
                  valueStyle={{
                    color: matchScorePercent >= 50 ? VISNDT_COLORS.success : VISNDT_COLORS.warning,
                    fontSize: 28,
                    fontWeight: 700,
                  }}
                />
                <Progress
                  percent={matchScorePercent}
                  showInfo={false}
                  strokeColor={matchScorePercent >= 50 ? VISNDT_COLORS.success : VISNDT_COLORS.warning}
                  size="small"
                  style={{ marginTop: 4 }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6} lg={6}>
              <Card
                hoverable
                onClick={() => navigate('/matching')}
                style={{
                  cursor: 'pointer',
                  borderTop: `3px solid ${matchingStats.hardFailCount > 0 ? VISNDT_COLORS.error : VISNDT_COLORS.neutral}`,
                }}
              >
                <Statistic
                  title="硬失败"
                  value={matchingStats.hardFailCount}
                  prefix={<CloseCircleOutlined />}
                  valueStyle={{
                    color: matchingStats.hardFailCount > 0 ? VISNDT_COLORS.error : VISNDT_COLORS.neutral,
                    fontSize: 28,
                    fontWeight: 700,
                  }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6} lg={6}>
              <Card
                hoverable
                onClick={() => navigate('/matching')}
                style={{
                  cursor: 'pointer',
                  borderTop: `3px solid ${matchingStats.rematchCount > 0 ? CHART_PALETTE[3] : VISNDT_COLORS.neutral}`,
                }}
              >
                <Statistic
                  title="重新匹配"
                  value={matchingStats.rematchCount}
                  prefix={<SyncOutlined />}
                  valueStyle={{
                    color: matchingStats.rematchCount > 0 ? CHART_PALETTE[3] : VISNDT_COLORS.neutral,
                    fontSize: 28,
                    fontWeight: 700,
                  }}
                />
              </Card>
            </Col>
          </Row>

          {/* ===== Pending Items ===== */}
          <SectionHeader
            title="待处理事项"
            icon={<ExclamationCircleOutlined />}
            accentColor={VISNDT_COLORS.warning}
            subtitle={`共 ${totalPendingItems} 项待处理`}
          />
          <Row gutter={[DASHBOARD.cardGap, DASHBOARD.cardGap]} style={{ marginBottom: DASHBOARD.sectionGap }}>
            <Col xs={12} sm={6} lg={4}>
              <StatCard
                title="待处理用户"
                value={pending.usersPending}
                prefix={<UserOutlined />}
                color={pending.usersPending > 0 ? VISNDT_COLORS.warning : VISNDT_COLORS.neutral}
                onClick={() => navigate('/users')}
              />
            </Col>
            <Col xs={12} sm={6} lg={4}>
              <StatCard
                title="待处理询价"
                value={pending.inquiriesPending}
                prefix={<ThunderboltOutlined />}
                color={pending.inquiriesPending > 0 ? VISNDT_COLORS.warning : VISNDT_COLORS.neutral}
                onClick={() => navigate('/inquiries')}
              />
            </Col>
            <Col xs={12} sm={6} lg={4}>
              <StatCard
                title="待处理需求"
                value={pending.demandsPending}
                prefix={<FileSearchOutlined />}
                color={pending.demandsPending > 0 ? VISNDT_COLORS.warning : VISNDT_COLORS.neutral}
                onClick={() => navigate('/demands')}
              />
            </Col>
            <Col xs={12} sm={6} lg={4}>
              <StatCard
                title="待处理RFQ"
                value={pending.rfqPending}
                prefix={<SnippetsOutlined />}
                color={pending.rfqPending > 0 ? VISNDT_COLORS.warning : VISNDT_COLORS.neutral}
                onClick={() => navigate('/rfqs')}
              />
            </Col>
            <Col xs={12} sm={6} lg={4}>
              <StatCard
                title="未读通知"
                value={pending.unreadNotifications}
                prefix={<NotificationOutlined />}
                color={pending.unreadNotifications > 0 ? VISNDT_COLORS.error : VISNDT_COLORS.neutral}
                onClick={() => navigate('/notifications')}
              />
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
          {/* ===== Trend Chart ===== */}
          <Card
            title={
              <span>
                <RiseOutlined style={{ marginRight: 8, color: VISNDT_COLORS.primary }} />
                平台趋势（近7天）
              </span>
            }
            style={{ marginBottom: DASHBOARD.cardGap }}
          >
            {hasTrendData ? (
              <>
                <Text type="secondary" style={{ display: 'block', marginBottom: 16, fontSize: 12 }}>
                  基于 ConversionEvent 真实事件数据，展示近7天平台用户行为趋势
                </Text>
                <ResponsiveContainer width="100%" height={320}>
                  <AreaChart data={trendChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPageViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={CHART_PALETTE[0]} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={CHART_PALETTE[0]} stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorProductViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={CHART_PALETTE[1]} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={CHART_PALETTE[1]} stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorContentViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={CHART_PALETTE[3]} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={CHART_PALETTE[3]} stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorSearches" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={CHART_PALETTE[2]} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={CHART_PALETTE[2]} stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorInquiries2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={CHART_PALETTE[5]} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={CHART_PALETTE[5]} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <RechartsTooltip />
                    <Legend />
                    <Area type="monotone" name="页面浏览" dataKey="pageViews" stroke={CHART_PALETTE[0]} fill="url(#colorPageViews)" />
                    <Area type="monotone" name="产品浏览" dataKey="productViews" stroke={CHART_PALETTE[1]} fill="url(#colorProductViews)" />
                    <Area type="monotone" name="内容浏览" dataKey="contentViews" stroke={CHART_PALETTE[3]} fill="url(#colorContentViews)" />
                    <Area type="monotone" name="搜索" dataKey="searches" stroke={CHART_PALETTE[2]} fill="url(#colorSearches)" />
                    <Area type="monotone" name="询价" dataKey="inquiries" stroke={CHART_PALETTE[5]} fill="url(#colorInquiries2)" />
                  </AreaChart>
                </ResponsiveContainer>
              </>
            ) : (
              <Empty
                description={
                  <span>
                    <Text type="secondary">暂无趋势数据</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>ConversionEvent 数据积累后趋势图将自动展示</Text>
                  </span>
                }
              />
            )}
          </Card>

          {/* ===== Entity Distribution + Business Funnel ===== */}
          <Row gutter={DASHBOARD.cardGap}>
            <Col xs={24} lg={12}>
              <Card
                title={
                  <span>
                    <AppstoreOutlined style={{ marginRight: 8, color: VISNDT_COLORS.primary }} />
                    实体分布
                  </span>
                }
                style={{ marginBottom: DASHBOARD.cardGap }}
              >
                {entityPieData.length > 0 ? (
                  <>
                    <Text type="secondary" style={{ display: 'block', marginBottom: 12, fontSize: 12 }}>
                      平台各业务实体数量占比
                    </Text>
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
                        <RechartsTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </>
                ) : (
                  <Empty description="暂无实体数据" />
                )}
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card
                title={
                  <span>
                    <BarChartOutlined style={{ marginRight: 8, color: VISNDT_COLORS.success }} />
                    商业转化漏斗
                  </span>
                }
                style={{ marginBottom: DASHBOARD.cardGap }}
              >
                <Text type="secondary" style={{ display: 'block', marginBottom: 12, fontSize: 12 }}>
                  产品 → 内容 → 询价 → 需求 → RFQ → 报价 → 匹配 全链路转化
                </Text>
                {funnelData.some((d) => d.value > 0) ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <FunnelChart>
                      <RechartsTooltip />
                      <Funnel dataKey="value" data={funnelData} isAnimationActive>
                        <LabelList position="right" fill="#334155" stroke="none" dataKey="name" />
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
          <Card
            title={
              <span>
                <BarChartOutlined style={{ marginRight: 8, color: CHART_PALETTE[3] }} />
                实体数量对比
              </span>
            }
            style={{ marginBottom: DASHBOARD.cardGap }}
          >
            <Text type="secondary" style={{ display: 'block', marginBottom: 12, fontSize: 12 }}>
              各业务实体数量横向对比
            </Text>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={entityBarData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <RechartsTooltip />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {entityBarData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_PALETTE[index % CHART_PALETTE.length]} />
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
        <Row gutter={[DASHBOARD.cardGap, DASHBOARD.cardGap]}>
          <Col xs={24} lg={14}>
            <Card
              title={
                <span>
                  <ClockCircleOutlined style={{ marginRight: 8, color: VISNDT_COLORS.primary }} />
                  最近活动
                </span>
              }
              style={{ height: '100%' }}
            >
              {activities.users.length === 0 &&
              activities.demands.length === 0 &&
              activities.matches.length === 0 &&
              activities.notifications.length === 0 ? (
                <Empty description="暂无最近活动" />
              ) : (
                <Timeline
                  items={[
                    ...activities.users.map((u) => ({
                      color: VISNDT_COLORS.primary,
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
                      color: VISNDT_COLORS.success,
                      dot: <FileTextOutlined style={{ fontSize: 16 }} />,
                      children: (
                        <div>
                          <Text strong>新需求创建</Text>
                          <br />
                          <Text type="secondary">{d.title}</Text>
                          <Tag
                            color={resolveStatusTone(d.status) === 'success' ? 'green' : resolveStatusTone(d.status) === 'warning' ? 'orange' : resolveStatusTone(d.status) === 'error' ? 'red' : resolveStatusTone(d.status) === 'info' ? 'cyan' : 'default'}
                            style={{ marginLeft: 4 }}
                          >
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
                      color: VISNDT_COLORS.warning,
                      dot: <LinkOutlined style={{ fontSize: 16 }} />,
                      children: (
                        <div>
                          <Text strong>新匹配生成</Text>
                          <br />
                          <Text type="secondary">匹配度： {(m.matchScore * 100).toFixed(0)}%</Text>
                          <Tag
                            color={resolveStatusTone(m.matchStatus) === 'success' ? 'green' : resolveStatusTone(m.matchStatus) === 'warning' ? 'orange' : resolveStatusTone(m.matchStatus) === 'error' ? 'red' : resolveStatusTone(m.matchStatus) === 'info' ? 'cyan' : 'default'}
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
                      color: VISNDT_COLORS.industrialCyan,
                      dot: <BellOutlined style={{ fontSize: 16 }} />,
                      children: (
                        <div>
                          <Text strong>通知</Text>
                          <br />
                          <Text type="secondary">{n.title}</Text>
                          <Tag
                            color={resolveStatusTone(n.type) === 'success' ? 'green' : resolveStatusTone(n.type) === 'warning' ? 'orange' : resolveStatusTone(n.type) === 'error' ? 'red' : resolveStatusTone(n.type) === 'info' ? 'cyan' : 'default'}
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

          <Col xs={24} lg={10}>
            <Card
              title={
                <span>
                  <SafetyOutlined style={{ marginRight: 8, color: VISNDT_COLORS.success }} />
                  系统状态
                </span>
              }
              style={{ height: '100%', marginBottom: DASHBOARD.cardGap }}
            >
              <Descriptions bordered column={1} size="small">
                <Descriptions.Item label="数据库">
                  <Tag color={systemStatus.database === 'CONNECTED' ? 'success' : 'error'}>
                    {systemStatus.database === 'CONNECTED' ? '正常' : systemStatus.database}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="API 服务">
                  <Tag color={systemStatus.api === 'ONLINE' ? 'success' : 'error'}>
                    {systemStatus.api === 'ONLINE' ? '运行中' : systemStatus.api}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="最后更新">
                  <Text style={{ fontSize: 12 }}>
                    {new Date(systemStatus.lastUpdated).toLocaleString()}
                  </Text>
                </Descriptions.Item>
              </Descriptions>
              <Divider style={{ margin: '12px 0' }} />
              <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>
                实体数量统计
              </Text>
              <Descriptions bordered column={1} size="small">
                <Descriptions.Item label="用户">
                  <Text strong>{systemStatus.entityCounts.users}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="组织">
                  <Text strong>{systemStatus.entityCounts.organizations}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="产品">
                  <Text strong>{systemStatus.entityCounts.products}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="需求">
                  <Text strong>{systemStatus.entityCounts.demands}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="匹配">
                  <Text strong>{systemStatus.entityCounts.matches}</Text>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
        </Row>
      ),
    },
  ];

  return (
    <div style={{ padding: DASHBOARD.sectionGap }}>
      {/* ===== Page Header ===== */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 20,
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: `linear-gradient(135deg, ${VISNDT_COLORS.primary}, ${VISNDT_COLORS.industrialCyan})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <DashboardOutlined style={{ color: '#fff', fontSize: 16 }} />
            </div>
            <Title level={4} style={{ margin: 0 }}>
              平台运营总览
            </Title>
          </div>
          <Text type="secondary" style={{ fontSize: 13, marginLeft: 42 }}>
            VISNDT 工业检测能力发现平台 · 工业运营中心 · 实时掌握平台运营状态与业务流转
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

      {/* ===== Platform Health Banner ===== */}
      <PlatformHealthBanner stats={stats} systemStatus={systemStatus} />

      {/* ===== Tabs ===== */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        style={{ marginBottom: DASHBOARD.cardGap }}
      />

      {/* ===== Quick Actions ===== */}
      <SectionHeader
        title="快捷操作"
        icon={<ThunderboltOutlined />}
        accentColor={VISNDT_COLORS.industrialCyan}
      />
      <Card>
        <Space wrap size="middle">
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={() => navigate('/users/create')}
          >
            创建用户
          </Button>
          <Button icon={<PlusOutlined />} onClick={() => navigate('/organizations/create')}>
            创建组织
          </Button>
          <Button icon={<ShoppingOutlined />} onClick={() => navigate('/products/create')}>
            创建产品
          </Button>
          <Button icon={<FileTextOutlined />} onClick={() => navigate('/content/create')}>
            创建内容
          </Button>
          <Button icon={<BellOutlined />} onClick={() => navigate('/notifications')}>
            通知中心
          </Button>
          <Button icon={<TeamOutlined />} onClick={() => navigate('/users')}>
            查看用户
          </Button>
          <Button icon={<BankOutlined />} onClick={() => navigate('/organizations')}>
            查看组织
          </Button>
        </Space>
      </Card>
    </div>
  );
}

export default Home;