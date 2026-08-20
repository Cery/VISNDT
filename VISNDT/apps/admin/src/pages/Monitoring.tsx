import { useEffect, useState, useCallback } from 'react';
import {
  Card, Row, Col, Spin, Alert, Typography, Statistic, Tooltip, Empty, Tag,
} from 'antd';
import {
  ReloadOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  CloseCircleOutlined,
  DashboardOutlined,
  ShopOutlined,
  NodeIndexOutlined,
  ThunderboltOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import { monitoringService } from '../api';
import type { MonitoringOverview, MonitoringResult, HealthStatus } from '../types';

const { Title, Text } = Typography;

// ============================================
// Status Colors & Icons
// ============================================
const STATUS_CONFIG: Record<HealthStatus, { color: string; icon: React.ReactNode; text: string }> = {
  healthy: { color: '#52c41a', icon: <CheckCircleOutlined />, text: '正常' },
  warning: { color: '#faad14', icon: <WarningOutlined />, text: '警告' },
  critical: { color: '#ff4d4f', icon: <CloseCircleOutlined />, text: '严重' },
};

const SECTION_ICONS: Record<string, React.ReactNode> = {
  system: <DashboardOutlined />,
  business: <ShopOutlined />,
  matching: <NodeIndexOutlined />,
  embedding: <ThunderboltOutlined />,
  analytics: <BarChartOutlined />,
};

const SECTION_LABELS: Record<string, string> = {
  system: '系统健康',
  business: '业务风险',
  matching: '匹配健康',
  embedding: 'Embedding 覆盖',
  analytics: 'Analytics 管道',
};

// ============================================
// Monitoring Section Component
// ============================================
function MonitoringSection({
  title,
  icon,
  result,
}: {
  title: string;
  icon: React.ReactNode;
  result: MonitoringResult;
}) {
  const statusConfig = STATUS_CONFIG[result.health];

  return (
    <Card
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {icon}
          <span>{title}</span>
          <Tag color={statusConfig.color} style={{ marginLeft: 8 }}>
            {statusConfig.icon} {statusConfig.text}
          </Tag>
        </div>
      }
      style={{ marginBottom: 16 }}
    >
      <Row gutter={[12, 12]}>
        {result.items.map((item) => {
          const itemConfig = STATUS_CONFIG[item.status];
          return (
            <Col key={item.metric} xs={12} sm={8} lg={6} xl={4}>
              <Tooltip title={item.detail || item.label}>
                <Card
                  size="small"
                  styles={{
                    body: { padding: '12px 16px' },
                  }}
                  style={{
                    borderLeft: `3px solid ${itemConfig.color}`,
                  }}
                >
                  <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
                    {item.label}
                  </Text>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 18, fontWeight: 600, color: itemConfig.color }}>
                      {item.value}
                    </span>
                    <span style={{ color: itemConfig.color, fontSize: 12 }}>
                      {itemConfig.icon}
                    </span>
                  </div>
                </Card>
              </Tooltip>
            </Col>
          );
        })}
      </Row>
    </Card>
  );
}

// ============================================
// Overall Health Banner
// ============================================
function OverallBanner({ overview }: { overview: MonitoringOverview }) {
  const sections: Array<{ key: string; result: MonitoringResult }> = [
    { key: 'system', result: overview.system },
    { key: 'business', result: overview.business },
    { key: 'matching', result: overview.matching },
    { key: 'embedding', result: overview.embedding },
    { key: 'analytics', result: overview.analytics },
  ];

  const criticalCount = sections.filter((s) => s.result.health === 'critical').length;
  const warningCount = sections.filter((s) => s.result.health === 'warning').length;
  const healthyCount = sections.filter((s) => s.result.health === 'healthy').length;

  let overallStatus: HealthStatus = 'healthy';
  let overallLabel = '系统运行正常';
  if (criticalCount > 0) {
    overallStatus = 'critical';
    overallLabel = `${criticalCount} 个模块严重异常`;
  } else if (warningCount > 0) {
    overallStatus = 'warning';
    overallLabel = `${warningCount} 个模块需要关注`;
  }

  const config = STATUS_CONFIG[overallStatus];

  return (
    <Card
      style={{
        marginBottom: 16,
        borderLeft: `4px solid ${config.color}`,
        background: overallStatus === 'critical' ? '#fff2f0' : overallStatus === 'warning' ? '#fffbe6' : '#f6ffed',
      }}
    >
      <Row gutter={16} align="middle">
        <Col>
          <span style={{ fontSize: 32, color: config.color }}>{config.icon}</span>
        </Col>
        <Col flex="auto">
          <Title level={5} style={{ margin: 0, color: config.color }}>
            {overallLabel}
          </Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            {healthyCount} 正常 · {warningCount} 警告 · {criticalCount} 严重
          </Text>
        </Col>
        <Col>
          <Row gutter={12}>
            <Col>
              <Statistic
                title="正常"
                value={healthyCount}
                valueStyle={{ color: '#52c41a', fontSize: 20 }}
                suffix="/ 5"
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  );
}

// ============================================
// Main Monitoring Page
// ============================================
function Monitoring() {
  const [overview, setOverview] = useState<MonitoringOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await monitoringService.getOverview();
      setOverview(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载监控数据失败');
    } finally {
      setLoading(false);
    }
  }, []);

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
          message="加载监控数据失败"
          description={error}
          showIcon
          action={
            <ReloadOutlined onClick={fetchData} style={{ cursor: 'pointer', fontSize: 16 }} />
          }
        />
      </div>
    );
  }

  if (!overview) {
    return <Empty description="暂无监控数据" />;
  }

  const sections: Array<{ key: string; result: MonitoringResult }> = [
    { key: 'system', result: overview.system },
    { key: 'business', result: overview.business },
    { key: 'matching', result: overview.matching },
    { key: 'embedding', result: overview.embedding },
    { key: 'analytics', result: overview.analytics },
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
            运营监控
          </Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            系统健康 · 业务风险 · 匹配健康 · Embedding 覆盖 · Analytics 管道
          </Text>
        </div>
        <ReloadOutlined
          onClick={fetchData}
          style={{ cursor: 'pointer', fontSize: 18, color: '#2563eb' }}
        />
      </div>

      <OverallBanner overview={overview} />

      {/* Alert: Analytics pipeline may show critical when no events exist (normal in dev) */}
      {overview.analytics.health === 'critical' && (
        <Alert
          type="info"
          message="Analytics 管道状态说明"
          description="当前 Analytics 管道显示为「严重」是因为尚未收集到任何事件数据。这是正常现象 — 当用户开始浏览产品、搜索内容、提交询价等操作后，事件数据会自动填充，管道状态将恢复正常。"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      {sections.map(({ key, result }) => (
        <MonitoringSection
          key={key}
          title={SECTION_LABELS[key]}
          icon={SECTION_ICONS[key]}
          result={result}
        />
      ))}
    </div>
  );
}

export default Monitoring;