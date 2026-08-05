import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Input, Select, Space, Spin, Alert, Button, Tag, Typography } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { SorterResult } from 'antd/es/table/interface';
import { productService } from '../api';
import type { Product, SearchProductParams } from '../types';

const { Title } = Typography;

type PageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: Product[]; total: number };

interface QueryParams {
  keyword: string;
  status: string;
  sortBy: string;
  sortOrder: string;
  page: number;
  pageSize: number;
}

const STATUS_OPTIONS = [
  { value: '', label: '全部状态' },
  { value: 'ACTIVE', label: '已上架' },
  { value: 'DRAFT', label: '草稿' },
  { value: 'INACTIVE', label: '已下架' },
];

const STATUS_COLOR_MAP: Record<string, string> = {
  ACTIVE: 'green',
  DRAFT: 'default',
  INACTIVE: 'red',
};

function ProductList() {
  const navigate = useNavigate();
  const [pageState, setPageState] = useState<PageState>({ status: 'loading' });
  const [query, setQuery] = useState<QueryParams>({
    keyword: '',
    status: '',
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

      const result = await productService.getList(params);
      setPageState({
        status: 'success',
        data: result.data,
        total: result.total,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : '加载产品失败';
      setPageState({ status: 'error', message });
    }
  }, [query]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = useCallback((value: string) => {
    setQuery((prev) => ({ ...prev, keyword: value, page: 1 }));
  }, []);

  const handleStatusChange = useCallback((value: string) => {
    setQuery((prev) => ({ ...prev, status: value, page: 1 }));
  }, []);

  const handleReset = useCallback(() => {
    setQuery({
      keyword: '',
      status: '',
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
        message="加载产品失败"
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
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => (
        <Tag color={STATUS_COLOR_MAP[status] || 'default'}>{status}</Tag>
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
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={4} style={{ marginBottom: 16 }}>
        产品管理
      </Title>

      <Space style={{ marginBottom: 16 }} wrap>
        <Button
          type="primary"
          onClick={() => navigate('/products/create')}
        >
          创建产品
        </Button>
        <Input.Search
          placeholder="按名称、型号或描述搜索"
          allowClear
          onSearch={handleSearch}
          style={{ width: 320 }}
          prefix={<SearchOutlined />}
        />
        <Select
          placeholder="按状态筛选"
          allowClear
          value={query.status || undefined}
          onChange={handleStatusChange}
          options={STATUS_OPTIONS}
          style={{ width: 160 }}
        />
        <Button icon={<ReloadOutlined />} onClick={handleReset}>
          重置
        </Button>
      </Space>

      <Table<Product>
        columns={columns}
        dataSource={pageState.data}
        rowKey="id"
        onChange={handleTableChange}
        pagination={{
          current: query.page,
          pageSize: query.pageSize,
          total: pageState.total,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50'],
          showTotal: (total, range) => `${range[0]}-${range[1]} / ${total}`,
        }}
      />
    </div>
  );
}

export default ProductList;