import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Space, Spin, Alert, Button, message, Modal, Checkbox, Row, Col } from 'antd';
import { AppstoreOutlined, CheckCircleOutlined, EditOutlined, StopOutlined, TagsOutlined } from '@ant-design/icons';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { SorterResult } from 'antd/es/table/interface';
import { productService, categoriesService, extractErrorMessage } from '../api';
import type { Product, SearchProductParams } from '../types';
import type { ProductCategory } from '../types/category.types';
import { ExportButton, BatchActionBar, AdvancedFilterPanel } from '../components/operation';
import type { ExportColumn } from '../utils/export';
import { VISNDT_COLORS } from '../components/design-system/tokens';
import { StatusTag } from '../components/design-system';
import { KpiCard } from '../components/dashboard';

type PageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: Product[]; total: number };

interface QueryParams {
  keyword: string;
  status: string;
  categoryId: string;
  sortBy: string;
  sortOrder: string;
  page: number;
  pageSize: number;
}

interface GovernanceStats {
  total: number;
  active: number;
  draft: number;
  inactive: number;
  categoryCount: number;
}

const STATUS_OPTIONS = [
  { value: '', label: '全部状态' },
  { value: 'ACTIVE', label: '已上架' },
  { value: 'DRAFT', label: '草稿' },
  { value: 'INACTIVE', label: '已下架' },
];

const BATCH_STATUS_OPTIONS = [
  { label: '上架', value: 'ACTIVE' },
  { label: '草稿', value: 'DRAFT' },
  { label: '下架', value: 'INACTIVE' },
];

const STATUS_LABEL_MAP: Record<string, string> = {
  ACTIVE: '已上架',
  DRAFT: '草稿',
  INACTIVE: '已下架',
};

const PRODUCT_EXPORT_COLUMNS: ExportColumn<Product>[] = [
  { key: 'name', title: '名称' },
  { key: 'model', title: '型号', render: (item) => item.model || '' },
  { key: 'category', title: '分类', render: (item) => item.category?.name || '' },
  { key: 'status', title: '状态', render: (item) => STATUS_LABEL_MAP[item.status] || item.status },
  { key: 'createdAt', title: '创建时间', render: (item) => new Date(item.createdAt).toLocaleDateString() },
];

function ProductList() {
  const navigate = useNavigate();
  const [pageState, setPageState] = useState<PageState>({ status: 'loading' });
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [batchLoading, setBatchLoading] = useState(false);
  const [governanceStats, setGovernanceStats] = useState<GovernanceStats>({ total: 0, active: 0, draft: 0, inactive: 0, categoryCount: 0 });
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [query, setQuery] = useState<QueryParams>({
    keyword: '',
    status: '',
    categoryId: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    pageSize: 20,
  });

  const fetchProducts = useCallback(async () => {
    setPageState({ status: 'loading' });
    try {
      const params: SearchProductParams = {
        page: query.page,
        pageSize: query.pageSize,
        sortBy: query.sortBy as SearchProductParams['sortBy'],
        sortOrder: query.sortOrder as SearchProductParams['sortOrder'],
      };
      if (query.keyword.trim()) {
        params.keyword = query.keyword.trim();
      }
      if (query.status) {
        params.status = query.status;
      }
      if (query.categoryId) {
        params.categoryId = query.categoryId;
      }

      const result = await productService.getList(params);
      setPageState({
        status: 'success',
        data: result.data,
        total: result.total,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : '加载能力失败';
      setPageState({ status: 'error', message });
    }
  }, [query]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Load governance statistics and categories on mount
  useEffect(() => {
    const loadGovernanceData = async () => {
      try {
        const [allProducts, catsData] = await Promise.all([
          productService.getList({ page: 1, pageSize: 1 }),
          categoriesService.getList(),
        ]);
        const total = allProducts.total;
        setCategories(catsData);
        // Fetch status counts
        const [activeRes, draftRes, inactiveRes] = await Promise.all([
          productService.getList({ page: 1, pageSize: 1, status: 'ACTIVE' }),
          productService.getList({ page: 1, pageSize: 1, status: 'DRAFT' }),
          productService.getList({ page: 1, pageSize: 1, status: 'INACTIVE' }),
        ]);
        setGovernanceStats({
          total,
          active: activeRes.total,
          draft: draftRes.total,
          inactive: inactiveRes.total,
          categoryCount: catsData.length,
        });
      } catch {
        // Stats load failure is non-critical
      }
    };
    loadGovernanceData();
  }, []);

  const handleReset = useCallback(() => {
    setQuery({
      keyword: '',
      status: '',
      categoryId: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
      page: 1,
      pageSize: 20,
    });
  }, []);

  const handleTableChange = useCallback(
    (
      pagination: TablePaginationConfig,
      _filters: Record<string, unknown>,
      sorter: SorterResult<Product> | SorterResult<Product>[],
    ) => {
      const singleSorter = Array.isArray(sorter) ? sorter[0] : sorter;
      setQuery((prev) => ({
        ...prev,
        page: pagination.current || 1,
        pageSize: pagination.pageSize || 20,
        sortBy: (singleSorter.field as string) || prev.sortBy,
        sortOrder: singleSorter.order === 'ascend' ? 'asc' : 'desc',
      }));
    },
    [],
  );

  const handleDelete = useCallback((id: string) => {
    let forceDelete = false;
    const content = (
      <div>
        <p>确定要删除此能力吗？此操作不可撤销。</p>
        <Checkbox onChange={(e) => { forceDelete = e.target.checked; }}>
          同时删除关联数据（报价、匹配记录等）
        </Checkbox>
      </div>
    );
    Modal.confirm({
      title: '确认删除',
      content,
      okText: '确认删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          await productService.remove(id, forceDelete);
          message.success('能力已删除');
          fetchProducts();
        } catch (err) {
          const errorMsg = extractErrorMessage(err, '删除失败');
          Modal.error({
            title: '删除失败',
            content: errorMsg,
            okText: '知道了',
          });
        }
      },
    });
  }, [fetchProducts]);

  const handleBatchDelete = useCallback(async (ids: string[]) => {
    setBatchLoading(true);
    const hideLoading = message.loading('正在删除...');
    try {
      const result = await productService.batchDelete(ids);
      hideLoading();
      if (result.count === ids.length) {
        message.success(`成功删除 ${result.count} 个能力`);
      } else {
        message.warning(`成功删除 ${result.count} / ${ids.length} 个能力（部分因有关联数据无法删除）`);
      }
      setSelectedRowKeys([]);
      fetchProducts();
    } catch (err) {
      hideLoading();
      const errorMsg = extractErrorMessage(err, '批量删除失败');
      Modal.error({
        title: '批量删除失败',
        content: errorMsg,
        okText: '知道了',
      });
    } finally {
      setBatchLoading(false);
    }
  }, [fetchProducts]);

  const handleBatchStatus = useCallback(async (ids: string[], status: string) => {
    setBatchLoading(true);
    const hideLoading = message.loading('正在更新状态...');
    try {
      await productService.batchStatus(ids, status);
      hideLoading();
      message.success(`成功更新 ${ids.length} 个能力状态`);
      setSelectedRowKeys([]);
      fetchProducts();
    } catch (err) {
      hideLoading();
      message.error(err instanceof Error ? err.message : '批量更新状态失败');
    } finally {
      setBatchLoading(false);
    }
  }, [fetchProducts]);

  if (pageState.status === 'loading') {
    return (
      <div style={{ textAlign: 'center', padding: '120px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (pageState.status === 'error') {
    return (
      <Alert
        type="error"
        message="加载能力失败"
        description={pageState.message}
        showIcon
        action={
          <Button size="small" onClick={fetchProducts}>
            重试
          </Button>
        }
      />
    );
  }

  const columns: ColumnsType<Product> = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      sortOrder:
        query.sortBy === 'name'
          ? query.sortOrder === 'asc'
            ? 'ascend'
            : 'descend'
          : undefined,
      render: (name: string) => (
        <span style={{ fontWeight: 500 }}>{name}</span>
      ),
    },
    {
      title: '型号',
      dataIndex: 'model',
      key: 'model',
      render: (model: string | undefined) => model || '-',
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      render: (category: Product['category']) => category?.name || '-',
    },
    {
      title: '组织',
      key: 'organization',
      width: 140,
      render: (_: unknown, record: Product) =>
        record.createdBy?.organization?.name || '-',
    },
    {
      title: '创建者',
      key: 'creator',
      width: 120,
      render: (_: unknown, record: Product) =>
        record.createdBy?.name || record.createdBy?.email || '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => (
        <StatusTag status={status} label={STATUS_LABEL_MAP[status] || status} />
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: true,
      sortOrder:
        query.sortBy === 'createdAt'
          ? query.sortOrder === 'asc'
            ? 'ascend'
            : 'descend'
          : undefined,
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  {
      title: '操作',
      key: 'actions',
      width: 160,
      fixed: 'right' as const,
      render: (_: unknown, record: Product) => (
        <Space>
          <Button
            type="link"
            onClick={() => navigate(`/products/${record.id}`)}
          >
            查看
          </Button>
          <Button
            type="link"
            onClick={() => navigate(`/products/${record.id}/edit`)}
          >
            编辑
          </Button>
          <Button
            type="link"
            danger
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Industrial masthead — 复用 730/731 受控深色锚点 + tech grid + mono 元数据 */}
      <header
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 14,
          background: '#0f172a',
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
                Capability / Governance · Registry
              </div>
              <h1 style={{ margin: '10px 0 6px', fontSize: '22px', lineHeight: 1.2, color: '#fff', fontWeight: 800 }}>
                能力管理
              </h1>
              <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.62)', maxWidth: 620, lineHeight: 1.6 }}>
                管理工业检测能力、状态与分类 · 能力资产全生命周期治理
              </p>
            </div>
            <Button type="primary" onClick={() => navigate('/products/create')}>
              创建能力
            </Button>
          </div>

          {/* Telemetry — mono 遥测快照 */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: 16, paddingTop: 14 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'center' }}>
              {[
                { label: '能力总数', value: governanceStats.total, color: '#fff' },
                { label: '已上架', value: governanceStats.active, color: VISNDT_COLORS.success },
                { label: '草稿', value: governanceStats.draft, color: VISNDT_COLORS.warning },
                { label: '已下架', value: governanceStats.inactive, color: VISNDT_COLORS.error },
                { label: '能力分类', value: governanceStats.categoryCount, color: VISNDT_COLORS.industrialCyan },
              ].map((it) => (
                <span key={it.label} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <span aria-hidden="true" style={{ width: 7, height: 7, borderRadius: '50%', background: it.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>{it.label}</span>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono','SFMono-Regular',Consolas,monospace",
                      fontSize: 14,
                      fontWeight: 700,
                      color: '#fff',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {it.value}
                  </span>
                </span>
              ))}
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

      {/* Governance Statistics — 728 KpiCard Executive Grid */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={12} sm={8} lg={5}>
          <KpiCard title="能力总数" value={governanceStats.total} icon={<AppstoreOutlined />} tone="primary" hint="平台能力资产总量" />
        </Col>
        <Col xs={12} sm={8} lg={5}>
          <KpiCard title="已上架" value={governanceStats.active} icon={<CheckCircleOutlined />} tone="success" hint="当前在售能力规格" />
        </Col>
        <Col xs={12} sm={8} lg={5}>
          <KpiCard title="草稿" value={governanceStats.draft} icon={<EditOutlined />} tone="warning" hint="待完善能力条目" />
        </Col>
        <Col xs={12} sm={8} lg={5}>
          <KpiCard title="已下架" value={governanceStats.inactive} icon={<StopOutlined />} tone="error" hint="已停售能力条目" />
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <KpiCard title="能力分类" value={governanceStats.categoryCount} icon={<TagsOutlined />} tone="cyan" hint="分类目录节点数" />
        </Col>
      </Row>

      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
        <ExportButton<Product>
          data={pageState.status === 'success' ? pageState.data : []}
          columns={PRODUCT_EXPORT_COLUMNS}
          fileName="能力列表"
          onExportAll={async () => {
            const all = await productService.getList({ page: 1, pageSize: 10000 });
            return all.data;
          }}
        />
      </div>

      <AdvancedFilterPanel
        fields={[
          { key: 'keyword', label: '能力名称', type: 'keyword', placeholder: '按名称、型号或描述搜索', width: 320 },
          { key: 'status', label: '状态', type: 'select', options: STATUS_OPTIONS, width: 160 },
          { key: 'categoryId', label: '分类', type: 'select', options: categories.map((c) => ({ value: c.id, label: c.name })), width: 200 },
        ]}
        values={{ keyword: query.keyword, status: query.status, categoryId: query.categoryId }}
        onChange={(values) => {
          setQuery((prev) => ({ ...prev, ...values, page: 1 }));
        }}
        onSearch={fetchProducts}
        onReset={handleReset}
      />

      <BatchActionBar
        selectedRowKeys={selectedRowKeys}
        actions={[
          ...BATCH_STATUS_OPTIONS.map((opt) => ({
            key: `status:${opt.value}`,
            label: opt.label,
            confirmTitle: '确认状态变更',
            confirmContent: `确定要将选中的 ${selectedRowKeys.length} 项状态变更为「${opt.label}」吗？`,
          })),
          { key: 'delete', label: '批量删除', danger: true, icon: undefined, confirmTitle: '确认删除', confirmContent: `确定要删除选中的 ${selectedRowKeys.length} 个能力吗？此操作不可撤销。` },
        ]}
        onAction={async (actionKey, ids) => {
          if (actionKey === 'delete') {
            await handleBatchDelete(ids);
          } else if (actionKey.startsWith('status:')) {
            const status = actionKey.replace('status:', '');
            await handleBatchStatus(ids, status);
          }
        }}
        loading={batchLoading}
      />

      <Table<Product>
        columns={columns}
        dataSource={pageState.data}
        rowKey="id"
        scroll={{ x: 'max-content' }}
        rowSelection={{
          selectedRowKeys,
          onChange: (keys) => setSelectedRowKeys(keys),
        }}
        onChange={handleTableChange}
        pagination={{
          current: query.page,
          pageSize: query.pageSize,
          total: pageState.total,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50'],
          showTotal: (total, range) => `共 ${total} 条，第 ${range[0]}-${range[1]} 条`,
        }}
      />
    </div>
  );
}

export default ProductList;