import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Space, Spin, Alert, Button, Typography, message, Modal, Checkbox, Card, Row, Col, Statistic } from 'antd';
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

const { Title, Text } = Typography;

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
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 4, height: 20, borderRadius: 2, background: VISNDT_COLORS.primary, flexShrink: 0 }} />
          <Title level={4} style={{ margin: 0 }}>能力管理</Title>
        </div>
        <Text type="secondary" style={{ fontSize: 12, marginLeft: 12, display: 'block', marginTop: 4 }}>
          管理工业检测能力、状态与分类
        </Text>
      </div>

      {/* Governance Statistics Dashboard */}
      {(governanceStats.total > 0) && (
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col xs={12} sm={6} md={4}>
            <Card size="small">
              <Statistic title="能力总数" value={governanceStats.total} prefix={<AppstoreOutlined />} />
            </Card>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Card size="small">
              <Statistic title="已上架" value={governanceStats.active} valueStyle={{ color: '#52c41a' }} prefix={<CheckCircleOutlined />} />
            </Card>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Card size="small">
              <Statistic title="草稿" value={governanceStats.draft} valueStyle={{ color: '#faad14' }} prefix={<EditOutlined />} />
            </Card>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Card size="small">
              <Statistic title="已下架" value={governanceStats.inactive} valueStyle={{ color: VISNDT_COLORS.error }} prefix={<StopOutlined />} />
            </Card>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Card size="small">
              <Statistic title="能力分类" value={governanceStats.categoryCount} prefix={<TagsOutlined />} />
            </Card>
          </Col>
        </Row>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
        <Button type="primary" onClick={() => navigate('/products/create')}>
          创建能力
        </Button>
        <Space>
          <ExportButton<Product>
            data={pageState.status === 'success' ? pageState.data : []}
            columns={PRODUCT_EXPORT_COLUMNS}
            fileName="能力列表"
            onExportAll={async () => {
              const all = await productService.getList({ page: 1, pageSize: 10000 });
              return all.data;
            }}
          />
        </Space>
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