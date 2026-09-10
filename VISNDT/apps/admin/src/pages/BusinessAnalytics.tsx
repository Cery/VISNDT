import { useEffect, useState, useCallback } from 'react';
import {
  Card, Row, Col, Spin, Alert, Typography, Statistic, Tabs, Progress, Empty,
} from 'antd';
import {
  BarChartOutlined,
  ReloadOutlined,
  RiseOutlined,
  SwapOutlined,
  ExperimentOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
  FunnelChart, Funnel, LabelList,
} from 'recharts';
import { businessAnalyticsService } from '../api';
import type {
  BusinessFunnel, BusinessLifecycle, BusinessConversion, BusinessMatching,
} from '../types';
import { VISNDT_COLORS, CHART_PALETTE } from '../components/design-system/tokens';

const { Title, Text } = Typography;

const PIE_COLORS = CHART_PALETTE.slice(0, 8);
const FUNNEL_COLORS = CHART_PALETTE.slice(0, 6);
const MATCH_COLORS = CHART_PALETTE.slice(0, 6);

type PageState =
  | { status: 'loading' }
  | { status: 'error'; error: string }
  | {
      status: 'success';
      funnel: BusinessFunnel;
      lifecycle: BusinessLifecycle;
      conversion: BusinessConversion;
      matching: BusinessMatching;
    };

function BusinessAnalytics() {
  const [pageState, setPageState] = useState<PageState>({ status: 'loading' });

  const fetchData = useCallback(async () => {
    setPageState({ status: 'loading' });
    try {
      const [funnel, lifecycle, conversion, matching] = await Promise.all([
        businessAnalyticsService.getFunnel(),
        businessAnalyticsService.getLifecycle(),
        businessAnalyticsService.getConversion(),
        businessAnalyticsService.getMatching(),
      ]);
      setPageState({ status: 'success', funnel, lifecycle, conversion, matching });
    } catch (err) {
      setPageState({
        status: 'error',
        error: err instanceof Error ? err.message : '加载业务分析数据失败',
      });
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
          message="加载业务分析失败"
          description={pageState.error}
          showIcon
          action={
            <ReloadOutlined onClick={fetchData} style={{ cursor: 'pointer', fontSize: 16 }} />
          }
        />
      </div>
    );
  }

  const { funnel, lifecycle, conversion, matching } = pageState;

  // ============================================
  // Demand Funnel Chart Data
  // ============================================
  const demandFunnelData = funnel.demandFunnel.filter((d) => d.count > 0);
  const pipelineData = [
    { name: '询价', value: funnel.pipeline.totalInquiries, fill: '#2563eb' },
    { name: '需求', value: funnel.pipeline.totalDemands, fill: VISNDT_COLORS.success },
    { name: 'RFQ', value: funnel.pipeline.totalRfqs, fill: VISNDT_COLORS.warning },
    { name: '报价', value: funnel.pipeline.totalOffers, fill: '#722ed1' },
    { name: '匹配', value: funnel.pipeline.totalMatches, fill: '#13c2c2' },
  ];

  // ============================================
  // RFQ Lifecycle Charts
  // ============================================
  const rfqLifecycleData = lifecycle.rfqLifecycle.filter((d) => d.count > 0);
  const responseDistData = lifecycle.responseDistribution.filter((d) => d.count > 0);

  // ============================================
  // Conversion Charts
  // ============================================
  const inquiryStatusData = conversion.inquiryStatus.filter((d) => d.count > 0);
  const offerStatusData = conversion.offerStatus.filter((d) => d.count > 0);

  // Full pipeline stages for conversion
  const conversionPipelineData = [
    { name: '询价', value: conversion.pipeline.inquiries, fill: '#2563eb' },
    { name: '需求', value: conversion.pipeline.demands, fill: VISNDT_COLORS.success },
    { name: 'RFQ', value: conversion.pipeline.rfqs, fill: VISNDT_COLORS.warning },
    { name: '活跃RFQ', value: conversion.pipeline.activeRfqs, fill: VISNDT_COLORS.error },
    { name: '响应', value: conversion.pipeline.responses, fill: '#722ed1' },
    { name: '报价', value: conversion.pipeline.offers, fill: '#13c2c2' },
    { name: '已接受报价', value: conversion.pipeline.acceptedOffers, fill: '#eb2f96' },
    { name: '匹配', value: conversion.pipeline.matches, fill: '#a0d911' },
    { name: '已接受匹配', value: conversion.pipeline.acceptedMatches, fill: '#fa541c' },
  ];

  // ============================================
  // Matching Charts
  // ============================================
  const matchStatusData = matching.statusDistribution.filter((d) => d.count > 0);
  const scoreDistData = matching.scoreDistribution.filter((d) => d.count > 0);

  const tabItems = [
    {
      key: 'funnel',
      label: '需求漏斗',
      children: (
        <div>
          {/* Funnel Metrics */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={12} sm={6} lg={4}>
              <Card>
                <Statistic
                  title="询价"
                  value={funnel.pipeline.totalInquiries}
                  prefix={<RiseOutlined />}
                  valueStyle={{ color: '#2563eb' }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6} lg={4}>
              <Card>
                <Statistic
                  title="需求"
                  value={funnel.pipeline.totalDemands}
                  prefix={<BarChartOutlined />}
                  valueStyle={{ color: VISNDT_COLORS.success }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6} lg={4}>
              <Card>
                <Statistic
                  title="RFQ"
                  value={funnel.pipeline.totalRfqs}
                  prefix={<SwapOutlined />}
                  valueStyle={{ color: VISNDT_COLORS.warning }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6} lg={4}>
              <Card>
                <Statistic
                  title="报价"
                  value={funnel.pipeline.totalOffers}
                  prefix={<ExperimentOutlined />}
                  valueStyle={{ color: '#722ed1' }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6} lg={4}>
              <Card>
                <Statistic
                  title="匹配"
                  value={funnel.pipeline.totalMatches}
                  prefix={<CheckCircleOutlined />}
                  valueStyle={{ color: '#13c2c2' }}
                />
              </Card>
            </Col>
          </Row>

          {/* Conversion Rates */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={12} sm={6} lg={6}>
              <Card>
                <Statistic
                  title="询价→需求转化"
                  value={funnel.conversionRates.inquiryToDemand}
                  suffix="%"
                />
                <Progress
                  percent={funnel.conversionRates.inquiryToDemand}
                  showInfo={false}
                  strokeColor="#2563eb"
                  size="small"
                />
              </Card>
            </Col>
            <Col xs={12} sm={6} lg={6}>
              <Card>
                <Statistic
                  title="需求→RFQ转化"
                  value={funnel.conversionRates.demandToRfq}
                  suffix="%"
                />
                <Progress
                  percent={funnel.conversionRates.demandToRfq}
                  showInfo={false}
                  strokeColor={VISNDT_COLORS.success}
                  size="small"
                />
              </Card>
            </Col>
            <Col xs={12} sm={6} lg={6}>
              <Card>
                <Statistic
                  title="RFQ→报价转化"
                  value={funnel.conversionRates.rfqToOffer}
                  suffix="%"
                />
                <Progress
                  percent={funnel.conversionRates.rfqToOffer}
                  showInfo={false}
                  strokeColor={VISNDT_COLORS.warning}
                  size="small"
                />
              </Card>
            </Col>
            <Col xs={12} sm={6} lg={6}>
              <Card>
                <Statistic
                  title="报价→匹配转化"
                  value={funnel.conversionRates.offerToMatch}
                  suffix="%"
                />
                <Progress
                  percent={funnel.conversionRates.offerToMatch}
                  showInfo={false}
                  strokeColor="#722ed1"
                  size="small"
                />
              </Card>
            </Col>
          </Row>

          {/* Demand Status Distribution + Pipeline Funnel */}
          <Row gutter={16}>
            <Col xs={24} lg={12}>
              <Card title="需求状态分布" style={{ marginBottom: 16 }}>
                {demandFunnelData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={demandFunnelData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="label" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                        {demandFunnelData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={FUNNEL_COLORS[index % FUNNEL_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <Empty description="暂无需求数据" />
                )}
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="商业转化漏斗" style={{ marginBottom: 16 }}>
                <Text type="secondary" style={{ display: 'block', marginBottom: 12, fontSize: 12 }}>
                  询价 → 需求 → RFQ → 报价 → 匹配 全链路
                </Text>
                {pipelineData.some((d) => d.value > 0) ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <FunnelChart>
                      <Tooltip />
                      <Funnel dataKey="value" data={pipelineData} isAnimationActive>
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
        </div>
      ),
    },
    {
      key: 'lifecycle',
      label: 'RFQ 生命周期',
      children: (
        <div>
          {/* Lifecycle Metrics */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={12} sm={6} lg={6}>
              <Card>
                <Statistic title="RFQ总数" value={lifecycle.metrics.totalRfqs} />
              </Card>
            </Col>
            <Col xs={12} sm={6} lg={6}>
              <Card>
                <Statistic
                  title="完成率"
                  value={lifecycle.metrics.rfqCompletionRate}
                  suffix="%"
                  valueStyle={{ color: lifecycle.metrics.rfqCompletionRate >= 50 ? VISNDT_COLORS.success : VISNDT_COLORS.warning }}
                />
                <Progress
                  percent={lifecycle.metrics.rfqCompletionRate}
                  showInfo={false}
                  size="small"
                />
              </Card>
            </Col>
            <Col xs={12} sm={6} lg={6}>
              <Card>
                <Statistic
                  title="响应接受率"
                  value={lifecycle.metrics.responseAcceptRate}
                  suffix="%"
                  valueStyle={{ color: lifecycle.metrics.responseAcceptRate >= 50 ? VISNDT_COLORS.success : VISNDT_COLORS.warning }}
                />
                <Progress
                  percent={lifecycle.metrics.responseAcceptRate}
                  showInfo={false}
                  strokeColor={lifecycle.metrics.responseAcceptRate >= 50 ? VISNDT_COLORS.success : VISNDT_COLORS.warning}
                  size="small"
                />
              </Card>
            </Col>
            <Col xs={12} sm={6} lg={6}>
              <Card>
                <Statistic
                  title="平均响应数/RFQ"
                  value={lifecycle.metrics.avgResponsesPerRfq}
                  precision={1}
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} lg={12}>
              <Card title="RFQ 状态分布" style={{ marginBottom: 16 }}>
                {rfqLifecycleData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={rfqLifecycleData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="count"
                        nameKey="label"
                        label={({ label, percent }: { label?: string; percent?: number }) =>
                          `${label ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`
                        }
                      >
                        {rfqLifecycleData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <Empty description="暂无RFQ数据" />
                )}
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="响应状态分布" style={{ marginBottom: 16 }}>
                {responseDistData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={responseDistData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="label" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                        {responseDistData.map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={[VISNDT_COLORS.primary, VISNDT_COLORS.warning, VISNDT_COLORS.success, VISNDT_COLORS.error][index] || '#ccc'}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <Empty description="暂无响应数据" />
                )}
              </Card>
            </Col>
          </Row>
        </div>
      ),
    },
    {
      key: 'conversion',
      label: '业务转化',
      children: (
        <div>
          {/* Conversion Metrics */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={12} sm={6} lg={4}>
              <Card>
                <Statistic
                  title="询价→需求"
                  value={conversion.conversionRates.inquiryToDemand}
                  suffix="%"
                  valueStyle={{ color: '#2563eb' }}
                />
                <Progress percent={conversion.conversionRates.inquiryToDemand} showInfo={false} size="small" />
              </Card>
            </Col>
            <Col xs={12} sm={6} lg={4}>
              <Card>
                <Statistic
                  title="需求→RFQ"
                  value={conversion.conversionRates.demandToRfq}
                  suffix="%"
                  valueStyle={{ color: VISNDT_COLORS.success }}
                />
                <Progress percent={conversion.conversionRates.demandToRfq} showInfo={false} strokeColor={VISNDT_COLORS.success} size="small" />
              </Card>
            </Col>
            <Col xs={12} sm={6} lg={4}>
              <Card>
                <Statistic
                  title="RFQ→响应"
                  value={conversion.conversionRates.rfqToResponse}
                  suffix="%"
                  valueStyle={{ color: VISNDT_COLORS.warning }}
                />
                <Progress percent={conversion.conversionRates.rfqToResponse} showInfo={false} strokeColor={VISNDT_COLORS.warning} size="small" />
              </Card>
            </Col>
            <Col xs={12} sm={6} lg={4}>
              <Card>
                <Statistic
                  title="响应→报价"
                  value={conversion.conversionRates.responseToOffer}
                  suffix="%"
                  valueStyle={{ color: '#722ed1' }}
                />
                <Progress percent={conversion.conversionRates.responseToOffer} showInfo={false} strokeColor="#722ed1" size="small" />
              </Card>
            </Col>
            <Col xs={12} sm={6} lg={4}>
              <Card>
                <Statistic
                  title="报价→匹配"
                  value={conversion.conversionRates.offerToMatch}
                  suffix="%"
                  valueStyle={{ color: '#13c2c2' }}
                />
                <Progress percent={conversion.conversionRates.offerToMatch} showInfo={false} strokeColor="#13c2c2" size="small" />
              </Card>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} lg={12}>
              <Card title="询价状态分布" style={{ marginBottom: 16 }}>
                {inquiryStatusData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={inquiryStatusData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="count"
                        nameKey="label"
                        label={({ label, percent }: { label?: string; percent?: number }) =>
                          `${label ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`
                        }
                      >
                        {inquiryStatusData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <Empty description="暂无询价数据" />
                )}
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="报价状态分布" style={{ marginBottom: 16 }}>
                {offerStatusData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={offerStatusData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="label" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                        <Cell fill={VISNDT_COLORS.success} />
                        <Cell fill="#2563eb" />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <Empty description="暂无报价数据" />
                )}
              </Card>
            </Col>
          </Row>

          {/* Full Pipeline */}
          <Card title="全链路转化管道" style={{ marginBottom: 16 }}>
            <Text type="secondary" style={{ display: 'block', marginBottom: 12, fontSize: 12 }}>
              询价 → 需求 → RFQ → 活跃RFQ → 响应 → 报价 → 已接受报价 → 匹配 → 已接受匹配
            </Text>
            {conversionPipelineData.some((d) => d.value > 0) ? (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={conversionPipelineData}
                  layout="vertical"
                  margin={{ top: 10, right: 30, left: 80, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={80} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {conversionPipelineData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Empty description="暂无管道数据" />
            )}
          </Card>
        </div>
      ),
    },
    {
      key: 'matching',
      label: '匹配分析',
      children: (
        <div>
          {/* Matching Metrics */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={12} sm={6} lg={6}>
              <Card>
                <Statistic
                  title="总匹配数"
                  value={matching.metrics.totalMatches}
                  prefix={<SwapOutlined />}
                  valueStyle={{ color: '#2563eb' }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6} lg={6}>
              <Card>
                <Statistic
                  title="平均匹配度"
                  value={matching.metrics.averageScore}
                  suffix="%"
                  prefix={<RiseOutlined />}
                  valueStyle={{ color: matching.metrics.averageScore >= 50 ? VISNDT_COLORS.success : VISNDT_COLORS.warning }}
                />
                <Progress
                  percent={matching.metrics.averageScore}
                  showInfo={false}
                  strokeColor={matching.metrics.averageScore >= 50 ? VISNDT_COLORS.success : VISNDT_COLORS.warning}
                  size="small"
                />
              </Card>
            </Col>
            <Col xs={12} sm={6} lg={6}>
              <Card>
                <Statistic
                  title="接受率"
                  value={matching.metrics.acceptRate}
                  suffix="%"
                  prefix={<CheckCircleOutlined />}
                  valueStyle={{ color: VISNDT_COLORS.success }}
                />
                <Progress
                  percent={matching.metrics.acceptRate}
                  showInfo={false}
                  strokeColor={VISNDT_COLORS.success}
                  size="small"
                />
              </Card>
            </Col>
            <Col xs={12} sm={6} lg={6}>
              <Card>
                <Statistic
                  title="拒绝率"
                  value={matching.metrics.rejectRate}
                  suffix="%"
                  prefix={<CloseCircleOutlined />}
                  valueStyle={{ color: matching.metrics.rejectRate > 20 ? VISNDT_COLORS.error : '#999' }}
                />
                <Progress
                  percent={matching.metrics.rejectRate}
                  showInfo={false}
                  strokeColor={matching.metrics.rejectRate > 20 ? VISNDT_COLORS.error : VISNDT_COLORS.success}
                  size="small"
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} lg={12}>
              <Card title="匹配状态分布" style={{ marginBottom: 16 }}>
                {matchStatusData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={matchStatusData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="count"
                        nameKey="label"
                        label={({ label, percent }: { label?: string; percent?: number }) =>
                          `${label ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`
                        }
                      >
                        {matchStatusData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={MATCH_COLORS[index % MATCH_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <Empty description="暂无匹配数据" />
                )}
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="匹配度分布" style={{ marginBottom: 16 }}>
                {scoreDistData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={scoreDistData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="label" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                        <Cell fill={VISNDT_COLORS.success} />
                        <Cell fill={VISNDT_COLORS.warning} />
                        <Cell fill={VISNDT_COLORS.error} />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <Empty description="暂无匹配度分布数据" />
                )}
              </Card>
            </Col>
          </Row>
        </div>
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
            业务分析
          </Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            平台业务链路状态、转化趋势与关键指标
          </Text>
        </div>
        <ReloadOutlined
          onClick={fetchData}
          style={{ cursor: 'pointer', fontSize: 18, color: '#2563eb' }}
        />
      </div>

      <Tabs
        defaultActiveKey="funnel"
        items={tabItems}
        style={{ marginBottom: 16 }}
      />
    </div>
  );
}

export default BusinessAnalytics;