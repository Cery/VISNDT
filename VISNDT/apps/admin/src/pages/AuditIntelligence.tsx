import { useEffect, useState, useCallback } from 'react';
import {
  Card, Row, Col, Spin, Alert, Typography, Statistic, Tooltip, Empty, Tag,
  Segmented, Table, Tabs,
} from 'antd';
import {
  ReloadOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  CloseCircleOutlined,
  AuditOutlined,
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  SwapOutlined,
  LoginOutlined,
  BarChartOutlined,
  PieChartOutlined,
  TeamOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend, AreaChart, Area,
} from 'recharts';
import { auditIntelligenceService } from '../api';
import type { AuditIntelligenceOverview, ActorActivity, RiskLevel } from '../types';

const { Title, Text } = Typography;

// ============================================
// Colors
// ============================================
const RISK_COLORS: Record<RiskLevel, string> = {
  NORMAL: '#52c41a',
  WARNING: '#faad14',
  CRITICAL: '#ff4d4f',
};

const RISK_ICONS: Record<RiskLevel, React.ReactNode> = {
  NORMAL: <CheckCircleOutlined />,
  WARNING: <WarningOutlined />,
  CRITICAL: <CloseCircleOutlined />,
};

const RISK_LABELS: Record<RiskLevel, string> = {
  NORMAL: '正常',
  WARNING: '警告',
  CRITICAL: '严重',
};

const ACTION_COLORS: Record<string, string> = {
  create: '#52c41a',
  update: '#2563eb',
  delete: '#ff4d4f',
  statusChange: '#faad14',
  login: '#722ed1',
};

const PIE_COLORS = ['#2563eb', '#52c41a', '#faad14', '#ff4d4f', '#722ed1', '#13c2c2', '#eb2f96', '#fa8c16', '#2f54eb', '#a0d911'];

const TIME_RANGES = [
  { label: '7天', value: 7 },
  { label: '30天', value: 30 },
  { label: '90天', value: 90 },
];

// ============================================
// Audit Intelligence Page
// ============================================
function AuditIntelligence() {
  const [data, setData] = useState<AuditIntelligenceOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [days, setDays] = useState(7);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await auditIntelligenceService.getOverview(days);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载审计智能数据失败');
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '120px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 24 }}>
        <Alert
          type="error"
          message="加载审计智能数据失败"
          description={error}
          showIcon
          action={
            <ReloadOutlined onClick={fetchData} style={{ cursor: 'pointer', fontSize: 16 }} />
          }
        />
      </div>
    );
  }

  if (!data) {
    return <Empty description="暂无审计智能数据" />;
  }

  const trendData = data.trend.map((d) => ({
    ...d,
    date: d.date.slice(5), // MM-DD
  }));

  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div>
          <Title level={4} style={{ marginBottom: 4 }}>
            审计智能
          </Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            审计概览 · 操作趋势 · 实体分布 · 用户活动 · 风险指标
          </Text>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Segmented
            options={TIME_RANGES}
            value={days}
            onChange={(v) => setDays(v as number)}
          />
          <ReloadOutlined
            onClick={fetchData}
            style={{ cursor: 'pointer', fontSize: 18, color: '#2563eb' }}
          />
        </div>
      </div>

      {/* ============================================
          1. Audit Overview
       ============================================ */}
      <Card title={<><AuditOutlined /> 审计概览</>} style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]}>
          <Col xs={12} sm={8} md={4}>
            <Card size="small">
              <Statistic
                title="总事件"
                value={data.overview.totalEvents}
                prefix={<AuditOutlined />}
                valueStyle={{ color: '#2563eb' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Card size="small">
              <Statistic
                title="创建"
                value={data.overview.createCount}
                prefix={<PlusCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Card size="small">
              <Statistic
                title="更新"
                value={data.overview.updateCount}
                prefix={<EditOutlined />}
                valueStyle={{ color: '#2563eb' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Card size="small">
              <Statistic
                title="删除"
                value={data.overview.deleteCount}
                prefix={<DeleteOutlined />}
                valueStyle={{ color: '#ff4d4f' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Card size="small">
              <Statistic
                title="状态变更"
                value={data.overview.statusChangeCount}
                prefix={<SwapOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Card size="small">
              <Statistic
                title="登录"
                value={data.overview.loginCount}
                prefix={<LoginOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
        </Row>
      </Card>

      <Tabs
        defaultActiveKey="trend"
        items={[
          // ============================================
          // 2. Audit Trend
          // ============================================
          {
            key: 'trend',
            label: <><BarChartOutlined /> 操作趋势</>,
            children: (
              <Row gutter={16}>
                <Col xs={24} lg={12}>
                  <Card title="事件总量趋势" style={{ marginBottom: 16 }}>
                    {trendData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={trendData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" fontSize={11} />
                          <YAxis fontSize={11} />
                          <RechartsTooltip />
                          <Area type="monotone" dataKey="total" stroke="#2563eb" fill="#2563eb" fillOpacity={0.15} />
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <Empty description="暂无趋势数据" />
                    )}
                  </Card>
                </Col>
                <Col xs={24} lg={12}>
                  <Card title="操作类型分布" style={{ marginBottom: 16 }}>
                    {trendData.some((d) => d.total > 0) ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={trendData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" fontSize={11} />
                          <YAxis fontSize={11} />
                          <RechartsTooltip />
                          <Bar dataKey="create" stackId="a" fill={ACTION_COLORS.create} name="创建" />
                          <Bar dataKey="update" stackId="a" fill={ACTION_COLORS.update} name="更新" />
                          <Bar dataKey="delete" stackId="a" fill={ACTION_COLORS.delete} name="删除" />
                          <Bar dataKey="statusChange" stackId="a" fill={ACTION_COLORS.statusChange} name="状态变更" />
                          <Bar dataKey="login" stackId="a" fill={ACTION_COLORS.login} name="登录" />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <Empty description="暂无操作分布数据" />
                    )}
                  </Card>
                </Col>
              </Row>
            ),
          },
          // ============================================
          // 3. Entity Distribution
          // ============================================
          {
            key: 'entity',
            label: <><PieChartOutlined /> 实体分布</>,
            children: (
              <Row gutter={16}>
                <Col xs={24} lg={12}>
                  <Card title="实体类型分布（饼图）" style={{ marginBottom: 16 }}>
                    {data.entityDistribution.length > 0 ? (
                      <ResponsiveContainer width="100%" height={350}>
                        <PieChart>
                          <Pie
                            data={data.entityDistribution}
                            dataKey="count"
                            nameKey="label"
                            cx="50%"
                            cy="50%"
                            outerRadius={120}
                            label={({ payload, percent }: any) => {
                              const pct = percent != null ? (percent * 100).toFixed(0) : '0';
                              return `${payload.label} ${pct}%`;
                            }}
                          >
                            {data.entityDistribution.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                            ))}
                          </Pie>
                          <RechartsTooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <Empty description="暂无实体分布数据" />
                    )}
                  </Card>
                </Col>
                <Col xs={24} lg={12}>
                  <Card title="实体类型分布（柱状图）" style={{ marginBottom: 16 }}>
                    {data.entityDistribution.length > 0 ? (
                      <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={data.entityDistribution} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" fontSize={11} />
                          <YAxis dataKey="label" type="category" width={80} fontSize={11} />
                          <RechartsTooltip />
                          <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                            {data.entityDistribution.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <Empty description="暂无实体分布数据" />
                    )}
                  </Card>
                </Col>
              </Row>
            ),
          },
          // ============================================
          // 4. Actor Activity
          // ============================================
          {
            key: 'actor',
            label: <><TeamOutlined /> 用户活动</>,
            children: (
              <Card title="Top 用户活动">
                {data.topActors.length > 0 ? (
                  <Table
                    dataSource={data.topActors}
                    rowKey="operatorId"
                    pagination={false}
                    size="small"
                    columns={[
                      {
                        title: '操作人',
                        dataIndex: 'operatorName',
                        key: 'name',
                        render: (name: string, record: ActorActivity) => (
                          <Tooltip title={record.operatorEmail}>
                            <span>{name}</span>
                          </Tooltip>
                        ),
                      },
                      {
                        title: '总事件',
                        dataIndex: 'totalEvents',
                        key: 'total',
                        sorter: (a: ActorActivity, b: ActorActivity) => a.totalEvents - b.totalEvents,
                        render: (v: number) => <strong>{v}</strong>,
                      },
                      {
                        title: '创建',
                        dataIndex: 'createCount',
                        key: 'create',
                        render: (v: number) => <span style={{ color: '#52c41a' }}>{v}</span>,
                      },
                      {
                        title: '更新',
                        dataIndex: 'updateCount',
                        key: 'update',
                        render: (v: number) => <span style={{ color: '#2563eb' }}>{v}</span>,
                      },
                      {
                        title: '删除',
                        dataIndex: 'deleteCount',
                        key: 'delete',
                        render: (v: number) => (
                          <span style={{ color: v > 0 ? '#ff4d4f' : undefined, fontWeight: v > 0 ? 600 : 400 }}>
                            {v}
                          </span>
                        ),
                      },
                      {
                        title: '状态变更',
                        dataIndex: 'statusChangeCount',
                        key: 'statusChange',
                        render: (v: number) => <span style={{ color: '#faad14' }}>{v}</span>,
                      },
                      {
                        title: '登录',
                        dataIndex: 'loginCount',
                        key: 'login',
                        render: (v: number) => <span style={{ color: '#722ed1' }}>{v}</span>,
                      },
                      {
                        title: '最后活跃',
                        dataIndex: 'lastActivity',
                        key: 'last',
                        render: (v: string) => (
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {v ? new Date(v).toLocaleString('zh-CN') : '-'}
                          </Text>
                        ),
                      },
                    ]}
                  />
                ) : (
                  <Empty description="暂无用户活动数据" />
                )}
              </Card>
            ),
          },
          // ============================================
          // 5. Risk Indicators
          // ============================================
          {
            key: 'risk',
            label: <><ExclamationCircleOutlined /> 风险指标</>,
            children: (
              <Card title="审计风险指标" extra={<Text type="secondary" style={{ fontSize: 12 }}>指标仅用于观察，非安全决策依据</Text>}>
                <Row gutter={[16, 16]}>
                  {data.riskIndicators.map((indicator) => (
                    <Col key={indicator.metric} xs={24} sm={12} lg={8}>
                      <Card
                        size="small"
                        style={{
                          borderLeft: `4px solid ${RISK_COLORS[indicator.level]}`,
                          background: indicator.level === 'CRITICAL' ? '#fff2f0' : indicator.level === 'WARNING' ? '#fffbe6' : undefined,
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
                              {indicator.label}
                            </Text>
                            <span style={{ fontSize: 24, fontWeight: 600, color: RISK_COLORS[indicator.level] }}>
                              {indicator.value}
                            </span>
                          </div>
                          <Tag color={RISK_COLORS[indicator.level]} style={{ marginTop: 4 }}>
                            {RISK_ICONS[indicator.level]} {RISK_LABELS[indicator.level]}
                          </Tag>
                        </div>
                        <Text type="secondary" style={{ fontSize: 11, display: 'block', marginTop: 8 }}>
                          {indicator.detail}
                        </Text>
                      </Card>
                    </Col>
                  ))}
                </Row>
                {data.riskIndicators.length === 0 && (
                  <Empty description="暂无风险指标" />
                )}
              </Card>
            ),
          },
        ]}
      />
    </div>
  );
}

export default AuditIntelligence;