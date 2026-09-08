import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Spin,
  Alert,
  Button,
  Space,
  Tag,
  Typography,
  Table,
  Input,
  Empty,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  ReloadOutlined,
  CheckCircleOutlined,
  RocketOutlined,
  CloseCircleOutlined,
  ExperimentOutlined,
  AuditOutlined,
  AppstoreOutlined,
  BankOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { supplierProductService, dashboardService } from '../api';
import type { SupplierProduct } from '../types';
import { VISNDT_COLORS } from '../components/design-system/tokens';
import { StatusTag } from '../components/design-system';

const { Text } = Typography;

/**
 * WP-5B — Admin Core Operations → Platform Governance Workbench.
 *
 * Mental model (frozen platform / freed governance experience):
 *   Object → State → Queue → Evidence → Governance Action → Result
 *
 * Homepage is Queue-first, Action-over-Decoration:
 *   Governance Queue (To Review / Reviewing / To Publish / Rejected / Published)
 *   ↓ real numbers from the Admin governance pool API
 *   ↓ dense actionable table → Review Workbench
 *   Then compact platform state + recent governance activity (both real API).
 *
 * No fake KPI / hard-coded counts. No invented backend capability.
 */

type LoadState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success' };

type StageStatus = 'SUBMITTED' | 'REVIEWING' | 'APPROVED' | 'REJECTED' | 'PUBLISHED' | '';

interface StageDef {
  key: string;
  status: StageStatus;
  label: string;
  color: string;
}

const STAGES: StageDef[] = [
  { key: 'toReview', status: 'SUBMITTED', label: '待审核', color: VISNDT_COLORS.warning },
  { key: 'reviewing', status: 'REVIEWING', label: '审核中', color: VISNDT_COLORS.industrialCyan },
  { key: 'toPublish', status: 'APPROVED', label: '待发布', color: VISNDT_COLORS.primary },
  { key: 'rejected', status: 'REJECTED', label: '已拒绝', color: VISNDT_COLORS.error },
  { key: 'published', status: 'PUBLISHED', label: '已发布', color: VISNDT_COLORS.success },
];

const STATUS_LABEL_MAP: Record<string, string> = {
  DRAFT: '草稿',
  SUBMITTED: '已提交',
  REVIEWING: '审核中',
  APPROVED: '已通过',
  PUBLISHED: '已发布',
  REJECTED: '已拒绝',
};

interface QueueState {
  stage: string;
  rows: SupplierProduct[];
  total: number;
  loading: boolean;
  error: string;
}

function recentDate(value?: string | null): string {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
}

export default function OperationCenter() {
  const navigate = useNavigate();

  const [loadState, setLoadState] = useState<LoadState>({ status: 'loading' });
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [platform, setPlatform] = useState<{
    products: number;
    content: number;
    organizations: number;
    totalMatches: number;
    pending: { usersPending: number; demandsPending: number; inquiriesPending: number; rfqPending: number };
    recentUsers: { id: string; name?: string; email: string; status: string; createdAt: string }[];
    recentDemands: { id: string; title: string; status: string; createdAt: string }[];
  } | null>(null);

  const [queue, setQueue] = useState<QueueState>({
    stage: 'toReview',
    rows: [],
    total: 0,
    loading: true,
    error: '',
  });
  const [keyword, setKeyword] = useState('');

  const loadCounts = useCallback(async () => {
    const defs: StageDef[] = [...STAGES];
    const entries = await Promise.all(
      defs.map(async (s) => {
        try {
          const r = await supplierProductService.getList(1, 1, s.status);
          return [s.key, r.total] as const;
        } catch {
          return [s.key, 0] as const;
        }
      }),
    );
    setCounts(Object.fromEntries(entries));
  }, []);

  const loadPlatform = useCallback(async () => {
    try {
      const [stats, pending, activities] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getPending(),
        dashboardService.getActivities(),
      ]);
      setPlatform({
        products: stats.products.total ?? 0,
        content: stats.content.total ?? 0,
        organizations: stats.organizations.total ?? 0,
        totalMatches: stats.matching.totalMatches ?? 0,
        pending: {
          usersPending: pending.usersPending ?? 0,
          demandsPending: pending.demandsPending ?? 0,
          inquiriesPending: pending.inquiriesPending ?? 0,
          rfqPending: pending.rfqPending ?? 0,
        },
        recentUsers: activities.users ?? [],
        recentDemands: activities.demands ?? [],
      });
    } catch {
      setPlatform(null);
    }
  }, []);

  const bootstrap = useCallback(async () => {
    setLoadState({ status: 'loading' });
    setQueue((q) => ({ ...q, loading: true, error: '' }));
    try {
      await Promise.all([loadCounts(), loadPlatform(), loadQueue('toReview')]);
      setLoadState({ status: 'success' });
    } catch (err) {
      setLoadState({
        status: 'error',
        message: err instanceof Error ? err.message : '加载治理工作台失败',
      });
    }
  }, [loadCounts, loadPlatform]);

  const loadQueue = useCallback(
    async (stageKey: string) => {
      const stage = STAGES.find((s) => s.key === stageKey);
      setQueue((q) => ({ ...q, stage: stageKey, loading: true, error: '' }));
      try {
        const r = await supplierProductService.getList(1, 20, stage?.status);
        setQueue((q) => ({ ...q, rows: r.data, total: r.total, loading: false }));
      } catch (err) {
        setQueue((q) => ({
          ...q,
          rows: [],
          total: 0,
          loading: false,
          error: err instanceof Error ? err.message : '加载队列失败',
        }));
      }
    },
    [],
  );

  useEffect(() => {
    bootstrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredRows = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    if (!kw) return queue.rows;
    return queue.rows.filter((r) =>
      [r.brand, r.modelNumber, r.series, r.platformProduct?.name, r.organization?.name]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(kw)),
    );
  }, [queue.rows, keyword]);

  const columns: ColumnsType<SupplierProduct> = [
    {
      title: '型号',
      dataIndex: 'modelNumber',
      key: 'modelNumber',
      render: (model: string, r: SupplierProduct) => (
        <span>
          <b>{r.brand || '-'}</b>
          {r.series ? ` ${r.series}` : ''} <Text type="secondary">{model}</Text>
        </span>
      ),
    },
    {
      title: '所属能力',
      dataIndex: 'platformProduct',
      key: 'platformProduct',
      render: (pp: SupplierProduct['platformProduct']) => pp?.name || '-',
    },
    {
      title: '所属组织',
      dataIndex: 'organization',
      key: 'organization',
      render: (org: SupplierProduct['organization']) => org?.name || '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 110,
      render: (status: string) => (
        <StatusTag status={status} label={STATUS_LABEL_MAP[status] || '未知状态'} />
      ),
    },
    {
      title: '提交 / 审核',
      key: 'ts',
      width: 130,
      render: (_, r: SupplierProduct) => (
        <span className="admin-mono" style={{ fontSize: 12, color: '#64748b' }}>
          {r.submittedAt ? `提交 ${recentDate(r.submittedAt)}` : `更新 ${recentDate(r.updatedAt)}`}
        </span>
      ),
    },
    {
      title: '操作',
      key: 'actions',
      width: 90,
      fixed: 'right' as const,
      render: (_, r: SupplierProduct) => (
        <Button
          type="link"
          style={{ paddingLeft: 0, minHeight: 44, fontSize: 13 }}
          onClick={() => navigate(`/supplier-products/${r.id}`)}
        >
          审核
        </Button>
      ),
    },
  ];

  const pendingTotal =
    platform?.pending
      ? platform.pending.usersPending +
        platform.pending.demandsPending +
        platform.pending.inquiriesPending +
        platform.pending.rfqPending
      : 0;

  const stageItem = (s: StageDef, icon: JSX.Element) => {
    const count = counts[s.key];
    return (
      <button
        type="button"
        onClick={() => void loadQueue(s.key)}
        className="admin-gov-stage"
        data-active={queue.stage === s.key}
        aria-pressed={queue.stage === s.key}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          minHeight: 48,
          padding: '6px 14px',
          borderRadius: 10,
          border:
            queue.stage === s.key ? `1px solid ${s.color}` : '1px solid #e2e8f0',
          background: queue.stage === s.key ? `${s.color}14` : '#fff',
          cursor: 'pointer',
          font: 'inherit',
        }}
      >
        <span style={{ color: s.color }}>{icon}</span>
        <span style={{ fontWeight: 600, fontSize: 13 }}>{s.label}</span>
        {typeof count === 'number' && (
          <span
            className="admin-mono"
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: queue.stage === s.key ? s.color : '#0f172a',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {count}
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="admin-gov-workbench">
      {/* Governance masthead — non-marketing, state-first */}
      <header className="admin-gov-head">
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ minWidth: 0 }}>
            <div className="admin-mono" style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: VISNDT_COLORS.industrialCyan }}>
              Platform Governance · Workbench
            </div>
            <h1 style={{ margin: '8px 0 6px', fontSize: 22, color: '#fff', fontWeight: 800 }}>平台治理工作台</h1>
            <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.62)', maxWidth: 680, lineHeight: 1.6 }}>
              对象 → 状态 → 队列 → 证据 → 治理动作 → 结果。优先呈现待处理审核 / 待发布 / 异常，而非装饰性大盘。
            </p>
          </div>
          <Space>
            <Button
              icon={<ReloadOutlined />}
              size="small"
              style={{ background: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.2)', color: '#fff' }}
              onClick={() => void bootstrap()}
            >
              刷新
            </Button>
          </Space>
        </div>

        {/* Platform state — real counts, compact, queue-first */}
        <div className="admin-gov-telemetry" style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 16, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <Telemetry label="待处理业务" value={pendingTotal} color={VISNDT_COLORS.warning} icon={<ClockCircleOutlined />} />
          <Telemetry label="产品" value={platform?.products ?? 0} color={VISNDT_COLORS.primary} icon={<AppstoreOutlined />} />
          <Telemetry label="组织" value={platform?.organizations ?? 0} color={VISNDT_COLORS.industrialCyan} icon={<BankOutlined />} />
          <Telemetry label="内容" value={platform?.content ?? 0} color={VISNDT_COLORS.success} icon={<FileTextOutlined />} />
          <Telemetry label="匹配" value={platform?.totalMatches ?? 0} color={VISNDT_COLORS.industrialCyan} icon={<ExperimentOutlined />} />
        </div>
      </header>

      {loadState.status === 'loading' && (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <Spin size="large" />
          <div style={{ marginTop: 12 }}>
            <Text type="secondary">正在加载治理工作台...</Text>
          </div>
        </div>
      )}

      {loadState.status === 'error' && (
        <Alert
          type="error"
          message="治理工作台加载失败"
          description={loadState.message}
          showIcon
          action={<Button size="small" onClick={() => void bootstrap()}>重新加载</Button>}
        />
      )}

      {loadState.status === 'success' && (
        <>
          {/* Governance Queue — primary surface */}
          <Card
            className="admin-gov-block"
            title={
              <Space>
                <AuditOutlined style={{ color: VISNDT_COLORS.warning }} />
                <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>治理队列</h2>
              </Space>
            }
            extra={
              <Space wrap>
                <Input
                  allowClear
                  prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
                  placeholder="当前队列快速过滤"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  style={{ width: 200 }}
                  aria-label="当前队列快速过滤"
                />
                <Button size="small" onClick={() => navigate('/supplier-products')}>
                  全部产品型号
                </Button>
              </Space>
            }
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
              {stageItem(STAGES[0], <CheckCircleOutlined />)}
              {stageItem(STAGES[1], <ClockCircleOutlined />)}
              {stageItem(STAGES[2], <RocketOutlined />)}
              {stageItem(STAGES[3], <CloseCircleOutlined />)}
              {stageItem(STAGES[4], <AuditOutlined />)}
              {stageItem({ key: 'all', status: '', label: '全部', color: VISNDT_COLORS.neutral }, <AppstoreOutlined />)}
            </div>

            {queue.error && (
              <Alert type="error" showIcon message={queue.error} style={{ marginBottom: 12 }} />
            )}

            <Table<SupplierProduct>
              columns={columns}
              dataSource={filteredRows}
              rowKey="id"
              loading={queue.loading}
              size="small"
              scroll={{ x: 'max-content' }}
              locale={{ emptyText: <Empty description="该阶段当前无治理对象" image={Empty.PRESENTED_IMAGE_SIMPLE} /> }}
              pagination={{
                current: 1,
                pageSize: 20,
                total: filteredRows.length,
                showSizeChanger: false,
                showTotal: (t) => `本阶段 ${t} 条`,
              }}
            />
          </Card>

          {/* Governance activity + organization state */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 16, marginTop: 16 }}>
            <Card
              className="admin-gov-block"
              title={
                <Space>
                  <FileTextOutlined style={{ color: VISNDT_COLORS.primary }} />
                  <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>近期治理活动</h2>
                </Space>
              }
            >
              {(platform?.recentUsers ?? []).length === 0 && (platform?.recentDemands ?? []).length === 0 ? (
                <Empty description="暂无近期活动" image={Empty.PRESENTED_IMAGE_SIMPLE} />
              ) : (
                <ul className="admin-gov-activity" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                  {(platform?.recentDemands ?? []).map((d) => (
                    <li key={d.id} style={{ padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                      <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                        <Space>
                          <Tag color="processing">需求</Tag>
                          <span style={{ fontSize: 13 }}>{d.title || d.id}</span>
                        </Space>
                        <Text type="secondary" style={{ fontSize: 12 }}>{recentDate(d.createdAt)}</Text>
                      </Space>
                    </li>
                  ))}
                  {(platform?.recentUsers ?? []).map((u) => (
                    <li key={u.id} style={{ padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                      <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                        <Space>
                          <Tag color="cyan">用户</Tag>
                          <span style={{ fontSize: 13 }}>{u.name || u.email}</span>
                        </Space>
                        <Text type="secondary" style={{ fontSize: 12 }}>{recentDate(u.createdAt)}</Text>
                      </Space>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            <Card
              className="admin-gov-block"
              title={
                <Space>
                  <BankOutlined style={{ color: VISNDT_COLORS.industrialCyan }} />
                  <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>平台治理入口</h2>
                </Space>
              }
            >
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 10 }}>
                <GovEntry label="产品治理" count={platform?.products ?? 0} to="/products" color={VISNDT_COLORS.primary} navigate={navigate} />
                <GovEntry label="产品型号审核" count={counts.toReview ?? 0} to="/supplier-products" color={VISNDT_COLORS.warning} navigate={navigate} />
                <GovEntry label="组织治理" count={platform?.organizations ?? 0} to="/organizations" color={VISNDT_COLORS.industrialCyan} navigate={navigate} />
                <GovEntry label="用户治理" count={platform?.pending.usersPending ?? 0} to="/users" color={VISNDT_COLORS.success} navigate={navigate} />
                <GovEntry label="内容治理" count={platform?.content ?? 0} to="/content" color={VISNDT_COLORS.industrialCyan} navigate={navigate} />
                <GovEntry label="业务监控" count={platform?.totalMatches ?? 0} to="/monitoring" color={VISNDT_COLORS.neutral} navigate={navigate} />
              </div>
            </Card>
          </div>

          <Card style={{ background: '#f8fafc', marginTop: 16 }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              本工作台全部数字来自真实 Admin API（治理池 / 仪表盘 / 活动）；无假 KPI、无硬编码计数、无营销装饰。
              未引入新数据库模型、新 API 契约或 RBAC 变更。
            </Text>
          </Card>
        </>
      )}
    </div>
  );
}

function Telemetry({
  label,
  value,
  color,
  icon,
}: {
  label: string;
  value: number;
  color: string;
  icon: JSX.Element;
}) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <span style={{ color, fontSize: 13 }}>{icon}</span>
      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>{label}</span>
      <span className="admin-mono" style={{ fontSize: 14, fontWeight: 700, color: '#fff', fontVariantNumeric: 'tabular-nums' }}>
        {value}
      </span>
    </span>
  );
}

function GovEntry({
  label,
  count,
  to,
  color,
  navigate,
}: {
  label: string;
  count: number;
  to: string;
  color: string;
  navigate: (p: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => navigate(to)}
      className="admin-gov-entry"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 6,
        padding: '12px 14px',
        minHeight: 64,
        borderRadius: 10,
        border: '1px solid #e2e8f0',
        background: '#fff',
        cursor: 'pointer',
        font: 'inherit',
        textAlign: 'left',
      }}
    >
      <span style={{ fontSize: 13, color: '#334155' }}>{label}</span>
      <span className="admin-mono" style={{ fontSize: 20, fontWeight: 800, color, fontVariantNumeric: 'tabular-nums' }}>
        {count}
      </span>
    </button>
  );
}