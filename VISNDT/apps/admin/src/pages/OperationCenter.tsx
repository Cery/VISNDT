import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card, Spin, Alert, Button, Row, Col, Tabs, Statistic, Typography, Empty, Segmented, Space, Tag,
} from 'antd';
import {
  ReloadOutlined,
  AppstoreOutlined,
  FileTextOutlined,
  BankOutlined,
  SnippetsOutlined,
  MailOutlined,
  NodeIndexOutlined,
  TagsOutlined,
  RiseOutlined,
  LinkOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import { operationService } from '../api';
import {
  OperationSectionHeader,
  StatusGroupPanel,
  OperationQueueCard,
  DomainEntryCard,
  type QueueRow,
} from '../components/operation-center';
import type {
  OperationCenterOverview,
  ProductOperationData,
  ContentOperationData,
  SupplierOperationData,
  BusinessOperationData,
  StatusGroupItem,
} from '../types';
import { VISNDT_COLORS } from '../components/design-system/tokens';

const { Text } = Typography;

type LoadState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success' };

// 近似状态分组：不满足进入分组的「待处理」数量近似为总数（平台未细分时保证可用）。
function approximateQueue(
  counts: { label: string; count: number; target: string }[],
): QueueRow[] {
  return counts
    .filter((c) => c.count > 0)
    .map((c) => ({
      id: c.target,
      title: `${c.label}（${c.count}）`,
      status: 'PENDING',
      target: c.target,
      updatedAt: new Date().toISOString(),
    }));
}

export default function OperationCenter() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [loadState, setLoadState] = useState<LoadState>({ status: 'loading' });
  const [overview, setOverview] = useState<OperationCenterOverview | null>(null);

  // 各运营域数据（懒加载，切到对应 Tab 才请求）
  const [product, setProduct] = useState<ProductOperationData | null>(null);
  const [content, setContent] = useState<ContentOperationData | null>(null);
  const [supplier, setSupplier] = useState<SupplierOperationData | null>(null);
  const [business, setBusiness] = useState<BusinessOperationData | null>(null);
  const [tabLoading, setTabLoading] = useState<string | null>(null);

  const fetchOverview = useCallback(async () => {
    setLoadState({ status: 'loading' });
    try {
      const data = await operationService.getOverview();
      setOverview(data);
      setLoadState({ status: 'success' });
    } catch (err) {
      setLoadState({
        status: 'error',
        message: err instanceof Error ? err.message : '加载运营中心失败',
      });
    }
  }, []);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  const loadProduct = useCallback(async () => {
    setTabLoading('product');
    const data = await operationService.getProductStatus();
    setProduct(data);
    setTabLoading(null);
  }, []);

  const loadContent = useCallback(async () => {
    setTabLoading('content');
    const data = await operationService.getContentStatus();
    setContent(data);
    setTabLoading(null);
  }, []);

  const loadSupplier = useCallback(async () => {
    setTabLoading('supplier');
    const data = await operationService.getSupplierStatus();
    setSupplier(data);
    setTabLoading(null);
  }, []);

  const loadBusiness = useCallback(async () => {
    setTabLoading('business');
    const data = await operationService.getBusinessStatus();
    setBusiness(data);
    setTabLoading(null);
  }, []);

  useEffect(() => {
    if (activeTab === 'product' && !product) loadProduct();
    if (activeTab === 'content' && !content) loadContent();
    if (activeTab === 'supplier' && !supplier) loadSupplier();
    if (activeTab === 'business' && !business) loadBusiness();
  }, [activeTab, product, content, supplier, business, loadProduct, loadContent, loadSupplier, loadBusiness]);

  // 领域视图通用「搜索 + 状态快捷筛选」状态
  const [productFilter, setProductFilter] = useState('全部');
  const [contentFilter, setContentFilter] = useState('全部');
  const [supplierFilter, setSupplierFilter] = useState('全部');
  const [demandFilter, setDemandFilter] = useState('全部');
  const [rfqFilter, setRfqFilter] = useState('全部');
  const [offerFilter, setOfferFilter] = useState('全部');
  const [inquiryFilter, setInquiryFilter] = useState('全部');

  if (loadState.status === 'loading') {
    return (
      <div style={{ padding: 24 }}>
        <Spin size="large" style={{ width: '100%', margin: '120px 0' }} />
        <div style={{ textAlign: 'center' }}>
          <Text type="secondary">正在加载运营中心...</Text>
        </div>
      </div>
    );
  }

  if (loadState.status === 'error') {
    return (
      <Alert
        type="error"
        message="运营中心加载失败"
        description={loadState.message}
        showIcon
        action={<Button type="primary" onClick={fetchOverview}>重新加载</Button>}
      />
    );
  }

  const groupFilterOptions = (groups: StatusGroupItem[]) => [
    { label: '全部', value: '全部' },
    ...groups.map((g) => ({ label: `${g.label} (${g.count})`, value: g.label })),
  ];

  const filterRows = (rows: QueueRow[], group: StatusGroupItem[], filter: string) =>
    filter === '全部'
      ? rows
      : rows.filter((r) => {
          const match = group.find((g) => g.label === filter);
          return match ? r.status === match.status : true;
        });

  const overviewTodo = overview
    ? approximateQueue([
        { label: '待处理用户', count: overview.pending.usersPending, target: '/users' },
        { label: '待处理询价', count: overview.pending.inquiriesPending, target: '/inquiries' },
        { label: '待处理需求', count: overview.pending.demandsPending, target: '/demands' },
        { label: '待处理RFQ', count: overview.pending.rfqPending, target: '/rfqs' },
        { label: '未读通知', count: overview.pending.unreadNotifications, target: '/notifications' },
      ])
    : [];

  const tabItems = [
    {
      key: 'overview',
      label: '运营总览',
      children: (
        <div>
          <OperationSectionHeader
            title="运营域总览"
            icon={<GlobalOutlined />}
            accentColor={VISNDT_COLORS.primary}
            subtitle="产品 / 内容 / 供应商 / 商业 四大运营域统一管理入口"
          />
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} lg={6}>
              <DomainEntryCard
                title="产品运营"
                description="待审核产品、分类状态、推荐/上架状态与数据完整度提示"
                icon={<AppstoreOutlined />}
                accentColor={VISNDT_COLORS.primary}
                metric={{
                  label: '产品',
                  value: overview?.stats.products.total ?? 0,
                  color: VISNDT_COLORS.primary,
                }}
                badgeCount={overview?.pending.demandsPending}
                onClick={() => setActiveTab('product')}
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <DomainEntryCard
                title="内容运营"
                description="草稿 / 已发布 / 审核状态与内容关联检查"
                icon={<FileTextOutlined />}
                accentColor={VISNDT_COLORS.success}
                metric={{
                  label: '内容',
                  value: overview?.stats.content.total ?? 0,
                  color: VISNDT_COLORS.success,
                }}
                onClick={() => setActiveTab('content')}
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <DomainEntryCard
                title="供应商运营"
                description=" Organization 状态、能力画像与产品关联情况"
                icon={<BankOutlined />}
                accentColor={VISNDT_COLORS.industrialCyan}
                metric={{
                  label: '组织',
                  value: overview?.stats.organizations.total ?? 0,
                  color: VISNDT_COLORS.industrialCyan,
                }}
                onClick={() => setActiveTab('supplier')}
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <DomainEntryCard
                title="商业运营"
                description="RFQ / 需求 / 询价 / 报价队列与匹配状态查看"
                icon={<SnippetsOutlined />}
                accentColor={VISNDT_COLORS.warning}
                metric={{
                  label: '匹配',
                  value: overview?.matchingStats.totalMatches ?? 0,
                  color: VISNDT_COLORS.warning,
                }}
                badgeCount={
                  overview
                    ? overview.pending.rfqPending + overview.pending.inquiriesPending
                    : 0
                }
                onClick={() => setActiveTab('business')}
              />
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} lg={14}>
              <OperationSectionHeader
                title="运营待办队列"
                icon={<RiseOutlined />}
                accentColor={VISNDT_COLORS.warning}
                subtitle="待处理用户 / 询价 / 需求 / RFQ / 通知 统一待办入口"
              />
              <OperationQueueCard
                title="待处理队列"
                rows={overviewTodo}
                emptyHint="当前无待处理事项"
                onRowClick={(target) => navigate(target)}
              />
            </Col>
            <Col xs={24} lg={10}>
              <OperationSectionHeader
                title="匹配状态"
                icon={<NodeIndexOutlined />}
                accentColor={VISNDT_COLORS.industrialCyan}
                subtitle="确定性匹配引擎运行快照"
              />
              <Card>
                {overview ? (
                  <Row gutter={16}>
                    <Col span={12}>
                      <Statistic
                        title="总匹配数"
                        value={overview.matchingStats.totalMatches}
                        prefix={<LinkOutlined />}
                        valueStyle={{ color: VISNDT_COLORS.primary, fontWeight: 700 }}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title="平均匹配度"
                        value={Math.round((overview.matchingStats.averageScore || 0) * 100)}
                        suffix="%"
                        prefix={<RiseOutlined />}
                        valueStyle={{ color: VISNDT_COLORS.success, fontWeight: 700 }}
                      />
                    </Col>
                    <Col span={12} style={{ marginTop: 16 }}>
                      <Statistic
                        title="硬失败"
                        value={overview.matchingStats.hardFailCount}
                        prefix={<TagsOutlined />}
                        valueStyle={{
                          color:
                            overview.matchingStats.hardFailCount > 0
                              ? VISNDT_COLORS.error
                              : VISNDT_COLORS.neutral,
                          fontWeight: 700,
                        }}
                      />
                    </Col>
                    <Col span={12} style={{ marginTop: 16 }}>
                      <Statistic
                        title="重新匹配"
                        value={overview.matchingStats.rematchCount}
                        prefix={<ReloadOutlined />}
                        valueStyle={{ color: VISNDT_COLORS.neutral, fontWeight: 700 }}
                      />
                    </Col>
                  </Row>
                ) : (
                  <Empty description="暂无匹配数据" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                )}
              </Card>
            </Col>
          </Row>
        </div>
      ),
    },
    {
      key: 'product',
      label: '产品运营',
      children: (
        <DomainView
          loading={tabLoading === 'product'}
          title="产品运营"
          desc="待上架 / 已上架 / 已下架状态分组与近期产品队列"
          onManage={() => navigate('/products')}
          managementLabel="前往产品管理"
          groups={product?.status.groups ?? []}
          total={product?.status.summary.total ?? 0}
          active={product?.status.summary.active ?? 0}
          activeLabel="已上架"
          filter={productFilter}
          setFilter={setProductFilter}
          filterOptions={groupFilterOptions(product?.status.groups ?? [])}
          rows={filterRows(
            (product?.status.recent ?? []).map((p) => ({
              id: p.id,
              title: p.name,
              status: p.status,
              updatedAt: p.updatedAt,
            })),
            product?.status.groups ?? [],
            productFilter,
          )}
          onRowClick={(id) => navigate(`/products/${id}`)}
        />
      ),
    },
    {
      key: 'content',
      label: '内容运营',
      children: (
        <DomainView
          loading={tabLoading === 'content'}
          title="内容运营"
          desc="草稿 / 审核中 / 已发布 / 已归档 状态分组与近期内容队列"
          onManage={() => navigate('/content')}
          managementLabel="前往内容管理"
          groups={content?.status.groups ?? []}
          total={content?.status.summary.total ?? 0}
          active={content?.status.summary.active ?? 0}
          activeLabel="已发布"
          filter={contentFilter}
          setFilter={setContentFilter}
          filterOptions={groupFilterOptions(content?.status.groups ?? [])}
          rows={filterRows(
            (content?.status.recent ?? []).map((c) => ({
              id: c.id,
              title: c.title,
              status: c.status,
              updatedAt: c.updatedAt,
            })),
            content?.status.groups ?? [],
            contentFilter,
          )}
          onRowClick={(id) => navigate(`/content/${id}`)}
        />
      ),
    },
    {
      key: 'supplier',
      label: '供应商运营',
      children: (
        <DomainView
          loading={tabLoading === 'supplier'}
          title="供应商运营"
          desc=" Organization 状态分组与能力画像（成员）查看，禁止商城化"
          onManage={() => navigate('/organizations')}
          managementLabel="前往组织管理"
          groups={supplier?.status.groups ?? []}
          total={supplier?.status.summary.total ?? 0}
          active={supplier?.status.summary.active ?? 0}
          activeLabel="正常"
          filter={supplierFilter}
          setFilter={setSupplierFilter}
          filterOptions={groupFilterOptions(supplier?.status.groups ?? [])}
          rows={filterRows(
            (supplier?.status.recent ?? []).map((o) => ({
              id: o.id,
              title: o.name,
              status: o.status,
              updatedAt: o.updatedAt,
            })),
            supplier?.status.groups ?? [],
            supplierFilter,
          )}
          onRowClick={(id) => navigate(`/organizations/${id}`)}
        />
      ),
    },
    {
      key: 'business',
      label: '商业运营',
      children: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <BusinessQueueBlock
                loading={tabLoading === 'business'}
                title="需求队列"
                desc="需求状态分组与近期需求"
                onManage={() => navigate('/demands')}
                groups={business?.demandStatus.groups ?? []}
                total={business?.demandStatus.summary.total ?? 0}
                active={business?.demandStatus.summary.active ?? 0}
                filter={demandFilter}
                setFilter={setDemandFilter}
                rows={filterRows(
                  (business?.demandStatus.recent ?? []).map((d) => ({
                    id: d.id,
                    title: d.title,
                    status: d.status,
                    updatedAt: d.updatedAt,
                  })),
                  business?.demandStatus.groups ?? [],
                  demandFilter,
                )}
                onRowClick={(id) => navigate(`/demands/${id}`)}
              />
            </Col>
            <Col xs={24} lg={12}>
              <BusinessQueueBlock
                loading={tabLoading === 'business'}
                title="询价队列"
                desc="询价状态分组与近期询价"
                onManage={() => navigate('/inquiries')}
                groups={business?.inquiryStatus.groups ?? []}
                total={business?.inquiryStatus.summary.total ?? 0}
                active={business?.inquiryStatus.summary.active ?? 0}
                filter={inquiryFilter}
                setFilter={setInquiryFilter}
                rows={filterRows(
                  (business?.inquiryStatus.recent ?? []).map((i) => ({
                    id: i.id,
                    title: i.product?.name || i.contactName || i.id,
                    status: i.status,
                    updatedAt: i.updatedAt,
                  })),
                  business?.inquiryStatus.groups ?? [],
                  inquiryFilter,
                )}
                onRowClick={(id) => navigate(`/inquiries/${id}`)}
              />
            </Col>
            <Col xs={24} lg={12}>
              <BusinessQueueBlock
                loading={tabLoading === 'business'}
                title="RFQ 队列"
                desc="RFQ 状态分组与近期 RFQ"
                onManage={() => navigate('/rfqs')}
                groups={business?.rfqStatus.groups ?? []}
                total={business?.rfqStatus.summary.total ?? 0}
                active={business?.rfqStatus.summary.active ?? 0}
                filter={rfqFilter}
                setFilter={setRfqFilter}
                rows={filterRows(
                  (business?.rfqStatus.recent ?? []).map((r) => ({
                    id: r.id,
                    title: r.demand?.title || r.id,
                    status: r.status,
                    updatedAt: r.updatedAt,
                  })),
                  business?.rfqStatus.groups ?? [],
                  rfqFilter,
                )}
                onRowClick={(id) => navigate(`/rfqs/${id}`)}
              />
            </Col>
            <Col xs={24} lg={12}>
              <BusinessQueueBlock
                loading={tabLoading === 'business'}
                title="报价队列"
                desc="报价状态分组与近期报价"
                onManage={() => navigate('/offers')}
                groups={business?.offerStatus.groups ?? []}
                total={business?.offerStatus.summary.total ?? 0}
                active={business?.offerStatus.summary.active ?? 0}
                filter={offerFilter}
                setFilter={setOfferFilter}
                rows={filterRows(
                  (business?.offerStatus.recent ?? []).map((o) => ({
                    id: o.id,
                    title: o.title,
                    status: o.status,
                    updatedAt: o.updatedAt,
                  })),
                  business?.offerStatus.groups ?? [],
                  offerFilter,
                )}
                onRowClick={(id) => navigate(`/offers/${id}`)}
              />
            </Col>
          </Row>
          <Card
            title={
              <span>
                <MailOutlined style={{ marginRight: 8, color: VISNDT_COLORS.warning }} />
                匹配状态
              </span>
            }
          >
            {business ? (
              <Row gutter={[16, 16]}>
                <Col xs={12} sm={6}>
                  <Statistic
                    title="总匹配数"
                    value={business.matchingStats.totalMatches}
                    valueStyle={{ color: VISNDT_COLORS.primary, fontWeight: 700 }}
                  />
                </Col>
                <Col xs={12} sm={6}>
                  <Statistic
                    title="平均匹配度"
                    value={Math.round((business.matchingStats.averageScore || 0) * 100)}
                    suffix="%"
                    valueStyle={{ color: VISNDT_COLORS.success, fontWeight: 700 }}
                  />
                </Col>
                <Col xs={12} sm={6}>
                  <Statistic
                    title="硬失败"
                    value={business.matchingStats.hardFailCount}
                    valueStyle={{
                      color:
                        business.matchingStats.hardFailCount > 0
                          ? VISNDT_COLORS.error
                          : VISNDT_COLORS.neutral,
                      fontWeight: 700,
                    }}
                  />
                </Col>
                <Col xs={12} sm={6}>
                  <Statistic
                    title="重新匹配"
                    value={business.matchingStats.rematchCount}
                    valueStyle={{ color: VISNDT_COLORS.neutral, fontWeight: 700 }}
                  />
                </Col>
              </Row>
            ) : (
              <Empty description="暂无匹配数据" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Card>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: 8 }}>
      {/* Industrial masthead — 复用 730 Home 受控深色锚点 + tech grid + mono 元数据 + 遥测 */}
      <header
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 14,
          background: '#0f172a', // Controlled Dark Anchor（Slate-900）
          marginBottom: 16,
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        <div style={{ position: 'relative', padding: '20px clamp(16px, 3vw, 24px)' }}>
          {/* Identity row */}
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
                Operation / Center · Five Views
              </div>
              <h1 style={{ margin: '10px 0 6px', fontSize: '22px', lineHeight: 1.2, color: '#fff', fontWeight: 800 }}>
                运营中心
              </h1>
              <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.62)', maxWidth: 620, lineHeight: 1.6 }}>
                管理运营中心 · 产品 / 内容 / 供应商 / 商业 四大运营域统一管理入口，待办队列与确定性匹配快照
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
                  产品 <b style={{ color: '#fff' }}>{overview?.stats.products.total ?? 0}</b>
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
                  内容 <b style={{ color: '#fff' }}>{overview?.stats.content.total ?? 0}</b>
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
                  组织 <b style={{ color: '#fff' }}>{overview?.stats.organizations.total ?? 0}</b>
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
                  匹配 <b style={{ color: VISNDT_COLORS.industrialCyan }}>{overview?.matchingStats.totalMatches ?? 0}</b>
                </span>
              </div>
            </div>
            <Button icon={<ReloadOutlined />} onClick={() => { fetchOverview(); loadProduct(); }} size="small">
              刷新
            </Button>
          </div>

          {/* Telemetry row */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: 16, paddingTop: 14 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'center' }}>
              <TelemetryDot label="待处理用户" value={overview?.pending.usersPending ?? 0} color={VISNDT_COLORS.warning} />
              <TelemetryDot label="待处理询价" value={overview?.pending.inquiriesPending ?? 0} color={VISNDT_COLORS.warning} />
              <TelemetryDot label="待处理需求" value={overview?.pending.demandsPending ?? 0} color={VISNDT_COLORS.warning} />
              <TelemetryDot label="待处理RFQ" value={overview?.pending.rfqPending ?? 0} color={VISNDT_COLORS.warning} />
              <TelemetryDot label="未读通知" value={overview?.pending.unreadNotifications ?? 0} color={VISNDT_COLORS.industrialCyan} />
              <span
                style={{
                  marginLeft: 'auto',
                  fontFamily: "'JetBrains Mono','SFMono-Regular',Consolas,monospace",
                  fontSize: 14,
                  fontWeight: 700,
                  color: VISNDT_COLORS.industrialCyan,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                TOT {overview ? overview.pending.usersPending + overview.pending.inquiriesPending + overview.pending.demandsPending + overview.pending.rfqPending + overview.pending.unreadNotifications : 0}
              </span>
            </div>
          </div>
        </div>

        {/* Controlled accent divider */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: 3,
            background: `linear-gradient(90deg, ${VISNDT_COLORS.primary}, ${VISNDT_COLORS.industrialCyan})`,
          }}
        />
      </header>

      <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />

      <Card style={{ background: '#fafafa' }}>
        <Text type="secondary" style={{ fontSize: 12 }}>
          本视图仅做运营聚合与快捷导航，全部数据来自现有 API 组合；不引入新数据库模型、新 API 契约或 RBAC 变更。
        </Text>
      </Card>
    </div>
  );
}

function DomainView({
  loading,
  title,
  desc,
  onManage,
  managementLabel,
  groups,
  total,
  active,
  activeLabel,
  filter,
  setFilter,
  filterOptions,
  rows,
  onRowClick,
}: {
  loading: boolean;
  title: string;
  desc: string;
  onManage: () => void;
  managementLabel: string;
  groups: StatusGroupItem[];
  total: number;
  active: number;
  activeLabel: string;
  filter: string;
  setFilter: (v: string) => void;
  filterOptions: { label: string; value: string }[];
  rows: QueueRow[];
  onRowClick: (id: string) => void;
}) {
  return (
    <Spin spinning={loading}>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={10}>
          <OperationSectionHeader title={title} icon={<RiseOutlined />} subtitle={desc} />
          <StatusGroupPanel
            title="状态分组"
            groups={groups}
            total={total}
            active={active}
            activeLabel={activeLabel}
          />
        </Col>
        <Col xs={24} lg={14}>
          <OperationSectionHeader
            title={`${title}队列`}
            icon={<TagsOutlined />}
            subtitle="快捷筛选 + 近期对象队列"
          />
          <Card
            title={
              <Space wrap>
                <span>近期队列</span>
                <Segmented
                  size="small"
                  value={filter}
                  onChange={(v) => setFilter(String(v))}
                  options={filterOptions}
                />
              </Space>
            }
            extra={
              <Button type="link" size="small" onClick={onManage}>
                {managementLabel}
              </Button>
            }
          >
            <OperationQueueCard
              title=""
              rows={rows}
              emptyHint="暂无近期对象"
              onRowClick={onRowClick}
            />
          </Card>
        </Col>
      </Row>
    </Spin>
  );
}

function BusinessQueueBlock({
  loading,
  title,
  desc,
  onManage,
  groups,
  total,
  active,
  filter,
  setFilter,
  rows,
  onRowClick,
}: {
  loading: boolean;
  title: string;
  desc: string;
  onManage: () => void;
  groups: StatusGroupItem[];
  total: number;
  active: number;
  filter: string;
  setFilter: (v: string) => void;
  rows: QueueRow[];
  onRowClick: (id: string) => void;
}) {
  return (
    <Spin spinning={loading}>
      <Card
        title={
          <Space wrap>
            <span>{title}</span>
            <Tag
              color={
                total > 0 ? 'processing' : 'default'
              }
              style={{ marginRight: 0 }}
            >
              总 {total} · {active} 活跃
            </Tag>
          </Space>
        }
        extra={
          <Button type="link" size="small" onClick={onManage}>
            前往管理
          </Button>
        }
      >
        <OperationSectionHeader title="状态分组" icon={<RiseOutlined />} subtitle={desc} />
        <StatusGroupPanel title="状态分组" groups={groups} total={total} active={active} />
        <div style={{ margin: '12px 0 8px' }}>
          <Segmented
            size="small"
            block
            value={filter}
            onChange={(v) => setFilter(String(v))}
            options={[
              { label: '全部', value: '全部' },
              ...groups.map((g) => ({ label: g.label, value: g.label })),
            ]}
          />
        </div>
        <OperationQueueCard
          title=""
          rows={rows}
          emptyHint="暂无近期对象"
          onRowClick={onRowClick}
        />
      </Card>
    </Spin>
  );
}

// 工业遥测指示点：受控色点 + mono 标签 + mono 值（复用 730 Home 遥测语言）
function TelemetryDot({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <span
        aria-hidden="true"
        style={{ width: 7, height: 7, borderRadius: '50%', background: color, flexShrink: 0 }}
      />
      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>{label}</span>
      <span
        style={{
          fontFamily: "'JetBrains Mono','SFMono-Regular',Consolas,monospace",
          fontSize: 14,
          fontWeight: 700,
          color: '#fff',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {value}
      </span>
    </span>
  );
}