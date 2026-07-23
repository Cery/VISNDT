import { useEffect, useState, useCallback } from 'react';
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
  { value: '', label: 'All Statuses' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'INACTIVE', label: 'Inactive' },
];

const STATUS_COLOR_MAP: Record<string, string> = {
  ACTIVE: 'green',
  DRAFT: 'default',
  INACTIVE: 'red',
};

function ProductList() {
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
        err instanceof Error ? err.message : 'Failed to load products';
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
        message="Failed to load products"
        description={pageState.message}
        showIcon
        action={
          <Button size="small" onClick={fetchProducts}>
            Retry
          </Button>
        }
      />
    );
  }

  const columns: ColumnsType<Product> = [
    {
      title: 'Name',
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
      title: 'Model',
      dataIndex: 'model',
      key: 'model',
      render: (model: string | undefined) => model || '-',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category: Product['category']) => category?.name || '-',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => (
        <Tag color={STATUS_COLOR_MAP[status] || 'default'}>{status}</Tag>
      ),
    },
    {
      title: 'Created At',
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
  ];

  return (
    <div>
      <Title level={4} style={{ marginBottom: 16 }}>
        Products
      </Title>

      <Space style={{ marginBottom: 16 }} wrap>
        <Input.Search
          placeholder="Search by name, model, or description"
          allowClear
          onSearch={handleSearch}
          style={{ width: 320 }}
          prefix={<SearchOutlined />}
        />
        <Select
          placeholder="Filter by status"
          allowClear
          value={query.status || undefined}
          onChange={handleStatusChange}
          options={STATUS_OPTIONS}
          style={{ width: 160 }}
        />
        <Button icon={<ReloadOutlined />} onClick={handleReset}>
          Reset
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
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
        }}
      />
    </div>
  );
}

export default ProductList;