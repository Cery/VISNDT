import { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Row, Col, Spin, Alert, Typography, Button, Space, Tag,
  Timeline, Descriptions, Empty, Tabs, Divider,
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
  UserOutlined,
  FileSearchOutlined,
  ThunderboltOutlined,
  NotificationOutlined,
  MailOutlined,
  SnippetsOutlined,
  TagsOutlined,
  ReloadOutlined,
  RiseOutlined,
  SettingOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  DashboardOutlined,
  AppstoreOutlined,
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
import { KpiCard, SectionHeader as VdsSectionHeader } from '../components/dashboard';
import type { SemanticTone } from '../components/design-system/tokens';

const { Text } = Typography;

// ============================================
// Industrial Operations Center Surface
// 继承 729 Industrial Technology Visual Language：
// Controlled Dark Anchor（Slate-900）+ Tech Grid + mono 元数据 + 受控 accent 分隔线
// ============================================
const MASTHEAD_BG = '#0f172a'; // Slate-900，受控深色视觉锚点（非整页黑色）
const MASTHEAD_GRID =
  'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)';
const CARD_GAP = 16;

// ============================================
// Executive KPI Grid（727/728 KpiCard 消费入口）
// 信息层级：Label → Metric(mono) → Status(Meta) → Operational Meaning(Hint)
// ============================================
interface KpiItem {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  tone: SemanticTone;
  hint: string;
  meta?: React.ReactNode;
  metaTone?: SemanticTone;
  suffix?: React.ReactNode;
  onClick?: () => void;
}

function KpiGrid({
  items,
  xs = 12,
  sm = 8,
  lg = 4,
}: {
  items: KpiItem[];
  xs?: number;
  sm?: number;
  lg?: number;
}) {
  return (
    <Row gutter={[CARD_GAP, CARD_GAP]} className="admin-stat-row">
      {items.map((it) => (
        <Col xs={xs} sm={sm} lg={lg} key={it.title}>
          <KpiCard
            title={it.title}
            value={it.value}
            icon={it.icon}
            tone={it.tone}
            hint={it.hint}
            meta={it.meta}
            metaTone={it.metaTone}
            suffix={it.suffix}
            onClick={it.onClick}
          />
        </Col>
      ))}
    </Row>
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
      <div style={{ padding: CARD_GAP }}>
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
      <div style={{ padding: CARD_GAP }}>
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
  // Industrial Operations Telemetry
  // ============================================
  const healthItems = [
    { label: '数据库', status: systemStatus.database === 'CONNECTED' ? 'ok' as const : 'warn' as const },
    { label: 'API', status: systemStatus.api === 'ONLINE' ? 'ok' as const : 'warn' as const },
    { label: '能力', status: stats.products.total > 0 ? 'ok' as const : 'warn' as const, value: stats.products.total },
    { label: '匹配引擎', status: stats.matching.totalMatches > 0 ? 'ok' as const : 'info' as const, value: stats.matching.totalMatches },
    { label: '活跃用户', status: stats.users.active > 0 ? 'ok' as const : 'info' as const, value: stats.users.active },
  ];
  const okCount = healthItems.filter((h) => h.status === 'ok').length;
  const overallHealth = okCount === healthItems.length ? 'healthy' : okCount >= 3 ? 'degraded' : 'attention';
  const healthColor = overallHealth === 'healthy' ? VISNDT_COLORS.success : overallHealth === 'degraded' ? VISNDT_COLORS.warning : VISNDT_COLORS.error;
  const healthTagColor = overallHealth === 'healthy' ? 'success' : overallHealth === 'degraded' ? 'warning' : 'error';
  const statusDotColor = (status: 'ok' | 'warn' | 'info') =>
    status === 'ok' ? VISNDT_COLORS.success : status === 'warn' ? VISNDT_COLORS.warning : VISNDT_COLORS.info;

  const entityTotal =
    systemStatus.entityCounts.users +
    systemStatus.entityCounts.organizations +
    systemStatus.entityCounts.products +
    systemStatus.entityCounts.demands;
  const totalPendingItems = pending.usersPending + pending.inquiriesPending + pending.demandsPending + pending.rfqPending + pending.unreadNotifications;

  // ============================================
  // Industrial Operations Masthead
  // ============================================
  const masthead = (
    <header
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 14,
        background: MASTHEAD_BG,
        marginBottom: 16,
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0, backgroundImage: MASTHEAD_GRID, backgroundSize: '28px 28px' }}
      />
      <div style={{ position: 'relative', padding: '22px clamp(16px, 3vw, 28px)' }}>
        {/* Identity row：Operations eyebrow + H1 + 说明 + 刷新 */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontFamily: "'JetBrains Mono','SFMono-Regular',Consolas,monospace",
                fontSize: 11,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: VISNDT_COLORS.industrialCyan,
              }}
            >
              Industrial Operations / Complex · VISNDT
            </div>
            <h1 style={{ margin: '10px 0 6px', fontSize: '22px', lineHeight: 1.2, color: '#fff', fontWeight: 800 }}>
              平台运营总览
            </h1>
            <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.62)', maxWidth: 560, lineHeight: 1.6 }}>
              VISNDT 工业检测能力发现平台 · 工业运营中心 · 实时掌握平台能力资产、业务流转与系统运行状态
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
              <span
                style={{
                  fontFamily: "'JetBrains Mono','SFMono-Regular',Consolas,monospace",
                  fontSize: 12,
                  color: '#e2e8f0',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 6,
                  padding: '3px 8px',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                能力资产 <b style={{ color: '#fff' }}>{stats.products.total}</b>
              </span>
              <span
                style={{
                  fontFamily: "'JetBrains Mono','SFMono-Regular',Consolas,monospace",
                  fontSize: 12,
                  color: '#e2e8f0',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 6,
                  padding: '3px 8px',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                业务实体 <b style={{ color: '#fff' }}>{entityTotal}</b>
              </span>
              <span
                style={{
                  fontFamily: "'JetBrains Mono','SFMono-Regular',Consolas,monospace",
                  fontSize: 12,
                  color: '#94a3b8',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 6,
                  padding: '3px 8px',
                }}
              >
                LC:{new Date(systemStatus.lastUpdated).toLocaleString()}
              </span>
            </div>
          </div>
          <Button icon={<ReloadOutlined />} onClick={fetchData} size="small">
            刷新
          </Button>
        </div>

        {/* Telemetry row：受控深色状态遥测（分隔线下方） */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: 18, paddingTop: 16 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'center' }}>
            {healthItems.map((item) => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span
                  aria-hidden="true"
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: statusDotColor(item.status),
                  }}
                />
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>{item.label}</span>
                {item.value !== undefined && (
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono','SFMono-Regular',Consolas,monospace",
                      fontSize: 14,
                      fontWeight: 700,
                      color: '#fff',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {item.value}
                  </span>
                )}
              </div>
            ))}
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Tag color={healthTagColor} style={{ margin: 0, fontSize: 11 }}>
                {overallHealth === 'healthy' ? '运行正常' : overallHealth === 'degraded' ? '部分降级' : '需要关注'}
              </Tag>
              <span
                style={{
                  fontFamily: "'JetBrains Mono','SFMono-Regular',Consolas,monospace",
                  fontSize: 14,
                  fontWeight: 700,
                  color: healthColor,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {okCount}/{healthItems.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Controlled accent divider（受控单点，非泛光） */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 2,
          background: `linear-gradient(to right, ${VISNDT_COLORS.primary}, ${VISNDT_COLORS.industrialCyan}, transparent)`,
        }}
      />
    </header>
  );

  const overviewTab = (
    <div>
      {/* ===== Capability Surface（Primary） ===== */}
      <VdsSectionHeader title="能力总览" subtitle="平台核心能力资产与覆盖" tone="primary" />
      <div style={{ marginBottom: 16 }}>
        <KpiGrid
          items={[
            { title: '能力', value: stats.products.total, icon: <ShoppingOutlined />, tone: 'primary', hint: '能力目录中已登记的工业检测能力与参数上下文', onClick: () => navigate('/products') },
            { title: '内容资产', value: stats.content.total, icon: <FileTextOutlined />, tone: 'success', hint: '已发布的知识 / 检测内容资产', onClick: () => navigate('/content') },
            { title: '注册用户', value: stats.users.total, icon: <TeamOutlined />, tone: 'violet', hint: '平台注册用户规模（含活跃口径）', meta: `${stats.users.active} 活跃`, metaTone: 'success', onClick: () => navigate('/users') },
            { title: '组织', value: stats.organizations.total, icon: <BankOutlined />, tone: 'info', hint: '参与能力撮合的供需机构', onClick: () => navigate('/organizations') },
            { title: '产品分类', value: categoryCount, icon: <TagsOutlined />, tone: 'warning', hint: '产品分类目录节点（导向分类上下文）', onClick: () => navigate('/product-categories') },
            { title: '参数定义', value: parameterCount, icon: <SettingOutlined />, tone: 'neutral', hint: '可用筛选参数定义（能力匹配上下文）', onClick: () => navigate('/parameter-definitions') },
          ]}
        />
      </div>

      {/* ===== Business Flow（Operational Context） ===== */}
      <VdsSectionHeader title="业务流转" subtitle="需求 → 匹配的工业闭环运营信号" tone="success" />
      <div style={{ marginBottom: 16 }}>
        <KpiGrid
          items={[
            { title: '询价', value: stats.inquiries.total, icon: <MailOutlined />, tone: 'info', hint: '买家发起的检测咨询请求', onClick: () => navigate('/inquiries') },
            { title: '需求', value: stats.demands.total, icon: <FileSearchOutlined />, tone: 'primary', hint: '进入撮合的能力需求', meta: `${stats.demands.published} 已发布`, metaTone: 'primary', onClick: () => navigate('/demands') },
            { title: 'RFQ', value: stats.rfqs.total, icon: <SnippetsOutlined />, tone: 'warning', hint: '进入询价流程的正式询价单', onClick: () => navigate('/rfqs') },
            { title: '报价', value: stats.offers.total, icon: <TagsOutlined />, tone: 'success', hint: '供应商提交的能力报价', onClick: () => navigate('/offers') },
            { title: '匹配', value: stats.matching.totalMatches, icon: <LinkOutlined />, tone: 'violet', hint: '确定性生成的匹配结果', onClick: () => navigate('/matching') },
            { title: '未读通知', value: unreadCount, icon: <BellOutlined />, tone: unreadCount > 0 ? 'error' : 'neutral', hint: '待消费的平台运营通知', meta: unreadCount > 0 ? `${unreadCount} 条未读` : '已清零', metaTone: unreadCount > 0 ? 'error' : 'success', onClick: () => navigate('/notifications') },
          ]}
        />
      </div>

      {/* ===== Matching Engine（Technical Signals） ===== */}
      <VdsSectionHeader title="匹配引擎状态" subtitle="确定性匹配引擎运行指标" tone="primary" />
      <div style={{ marginBottom: 16 }}>
        <KpiGrid
          xs={12}
          sm={12}
          lg={6}
          items={[
            { title: '总匹配数', value: matchingStats.totalMatches, icon: <LinkOutlined />, tone: 'primary', hint: '确定性匹配引擎已生成的结果总量', onClick: () => navigate('/matching') },
            { title: '平均匹配度', value: matchScorePercent, suffix: '%', icon: <RiseOutlined />, tone: matchScorePercent >= 50 ? 'success' : 'warning', hint: '各需求平均匹配得分', meta: matchScorePercent >= 50 ? '匹配质量稳定' : '建议关注匹配口径', metaTone: matchScorePercent >= 50 ? 'success' : 'warning' },
            { title: '硬失败', value: matchingStats.hardFailCount, icon: <CloseCircleOutlined />, tone: matchingStats.hardFailCount > 0 ? 'error' : 'neutral', hint: '无法生成匹配的需求数', onClick: () => navigate('/matching') },
            { title: '重新匹配', value: matchingStats.rematchCount, icon: <SyncOutlined />, tone: matchingStats.rematchCount > 0 ? 'warning' : 'neutral', hint: '需重新匹配的处理数', onClick: () => navigate('/matching') },
          ]}
        />
      </div>

      {/* ===== Pending（Action / Status Context） ===== */}
      <VdsSectionHeader
        title="待处理事项"
        subtitle={`共 ${totalPendingItems} 项待处理`}
        tone="warning"
        extra={
          <span style={{ fontFamily: "'JetBrains Mono','SFMono-Regular',Consolas,monospace", fontSize: 12, color: '#94a3b8', fontVariantNumeric: 'tabular-nums' }} aria-hidden="true">
            Q:{totalPendingItems}
          </span>
        }
      />
      <KpiGrid
        xs={12}
        sm={6}
        lg={4}
        items={[
          { title: '待处理用户', value: pending.usersPending, icon: <UserOutlined />, tone: pending.usersPending > 0 ? 'warning' : 'neutral', hint: '待审核 / 激活的注册用户', onClick: () => navigate('/users') },
          { title: '待处理询价', value: pending.inquiriesPending, icon: <ThunderboltOutlined />, tone: pending.inquiriesPending > 0 ? 'warning' : 'neutral', hint: '待处理的咨询请求', onClick: () => navigate('/inquiries') },
          { title: '待处理需求', value: pending.demandsPending, icon: <FileSearchOutlined />, tone: pending.demandsPending > 0 ? 'warning' : 'neutral', hint: '待处理的能力需求', onClick: () => navigate('/demands') },
          { title: '待处理 RFQ', value: pending.rfqPending, icon: <SnippetsOutlined />, tone: pending.rfqPending > 0 ? 'warning' : 'neutral', hint: '待处理的询价单', onClick: () => navigate('/rfqs') },
          { title: '未读通知', value: pending.unreadNotifications, icon: <NotificationOutlined />, tone: pending.unreadNotifications > 0 ? 'error' : 'neutral', hint: '未读的平台通知', onClick: () => navigate('/notifications') },
        ]}
      />
    </div>
  );

  const chartsTab = (
    <div>
      {/* ===== Trend Chart ===== */}
      <div className="vds-surface-1" style={{ borderRadius: 12, padding: 16, marginBottom: CARD_GAP }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <RiseOutlined style={{ color: VISNDT_COLORS.primary }} />
          <Text strong>平台趋势（近7天）</Text>
        </div>
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
      </div>

      {/* ===== Entity Distribution + Business Funnel ===== */}
      <Row gutter={CARD_GAP}>
        <Col xs={24} lg={12}>
          <div className="vds-surface-1" style={{ borderRadius: 12, padding: 16, marginBottom: CARD_GAP }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <AppstoreOutlined style={{ color: VISNDT_COLORS.primary }} />
              <Text strong>实体分布</Text>
            </div>
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
          </div>
        </Col>
        <Col xs={24} lg={12}>
          <div className="vds-surface-1" style={{ borderRadius: 12, padding: 16, marginBottom: CARD_GAP }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <BarChartOutlinedLegendMarkerForFunnel />
              <Text strong>商业转化漏斗</Text>
            </div>
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
          </div>
        </Col>
      </Row>

      {/* ===== Entity Bar Chart ===== */}
      <div className="vds-surface-1" style={{ borderRadius: 12, padding: 16, marginBottom: CARD_GAP }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <BarChartOutlinedLegendMarkerForFunnel />
          <Text strong>实体数量对比</Text>
        </div>
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
      </div>
    </div>
  );

  const activityTab = (
    <Row gutter={[CARD_GAP, CARD_GAP]}>
      <Col xs={24} lg={14}>
        <div className="vds-surface-1" style={{ borderRadius: 12, padding: 16, height: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <ClockCircleOutlined style={{ color: VISNDT_COLORS.primary }} />
            <Text strong>最近活动</Text>
          </div>
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
        </div>
      </Col>

      <Col xs={24} lg={10}>
        <div className="vds-surface-1" style={{ borderRadius: 12, padding: 16, height: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <DashboardOutlined style={{ color: VISNDT_COLORS.success }} />
            <Text strong>系统状态</Text>
          </div>
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
        </div>
      </Col>
    </Row>
  );

  const tabItems = [
    { key: 'overview', label: '运营概览', children: overviewTab },
    { key: 'charts', label: '数据图表', children: chartsTab },
    { key: 'activity', label: '最近活动', children: activityTab },
  ];

  return (
    <div className="vds-surface-0" style={{ minHeight: '100%' }}>
      <div className="vds-container-wide" style={{ marginInline: 'auto', padding: '4px clamp(4px, 1vw, 8px)' }}>
        {/* ===== Industrial Operations Masthead（Visual Anchor） ===== */}
        {masthead}

        {/* ===== Tabs ===== */}
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          style={{ marginBottom: CARD_GAP }}
        />

        {/* ===== Quick Actions ===== */}
        <VdsSectionHeader title="快捷操作" subtitle="常用运营动作入口" tone="cyan" />
        <div className="vds-surface-elevated" style={{ borderRadius: 12, padding: 16 }}>
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
        </div>
      </div>
    </div>
  );
}

/**
 * 图表标题图标占位（recharts Legend 语义保留）。
 * 仅作视觉分类图标，不承载数据逻辑。
 */
function BarChartOutlinedLegendMarkerForFunnel() {
  return <AppstoreOutlined style={{ color: VISNDT_COLORS.success }} />;
}

export default Home;