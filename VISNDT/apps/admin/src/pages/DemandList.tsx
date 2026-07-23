import { useEffect, useState, useCallback } from 'react';
import { Table, Input, Select, Space, Spin, Alert, Button, Tag, Typography } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { SorterResult } from 'antd/es/table/interface';
import { demandService } from '../api';
import type { Demand, SearchDemandParams } from '../types';

const { Title } = Typography;

type PageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: Demand[]; total: number };

interface QueryParams {
  keyword: string;
  status: string;
  sort: 'latest' | 'updated' | 'published';
  page: number;
  pageSize: number;
}

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'PUBLISHED', label: 'Published' },
  { value: 'SUBMITTED', label: 'Submitted' },
  { value: 'PROCESSING', label: 'Processing' },
  { value: 'CLOSED', label: 'Closed' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

const STATUS_COLOR_MAP: Record<string, string> = {
  DRAFT: 'orange',
  PUBLISHED: 'green',
  SUBMITTED: 'cyan',
  PROCESSING: 'blue',
  CLOSED: 'default',
  CANCELLED: 'red',
};

function DemandList() {
  const [pageState, setPageState] = useState<PageState>({ status: 'loading' });
  const [query, setQuery] = useState<QueryParams>({
    keyword: '',
    status: '',
    sort: 'latest',
    page: 1,
    pageSize: 20,
  });

  const fetchDemands = useCallback(async () => {
    setPageState({ status: 'loading' });
    try {
      const params: SearchDemandParams = {
        page: query.page,
        pageSize: query.pageSize,
        sort: query.sort,
      };
      if (query.keyword.trim()) {
        params.keyword = query.keyword.trim();
      }
      if (query.status) {
        params.status = query.status as SearchDemandParams['status'];
      }

      const result = await demandService.getList(params);
      setPageState({
        status: 'success',
        data: result.data,
        total: result.total,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to load demands';
      setPageState({ status: 'error', message });
    }
  }, [query]);

  useEffect(() => {
    fetchDemands();
  }, [fetchDemands]);

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
      sort: 'latest',
      page: 1,
      pageSize: 20,
    });
  }, []);

  const handleTableChange = useCallback(
    (
      pagination: TablePaginationConfig,
      _filters: Record<string, unknown>,
      sorter: SorterResult<Demand> | SorterResult<Demand>[],
    ) => {
      const singleSorter = Array.isArray(sorter) ? sorter[0] : sorter;
      const sortField = (singleSorter.field as string) || 'publishedAt';
      const sortMap: Record<string, 'latest' | 'updated' | 'published'> = {
        publishedAt: 'published',
        createdAt: 'latest',
        updatedAt: 'updated',
      };
      setQuery((prev) => ({
        ...prev,
        page: pagination.current || 1,
        pageSize: pagination.pageSize || 20,
        sort: sortMap[sortField] || 'latest',
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
        message="Failed to load demands"
        description={pageState.message}
        showIcon
        action={
          <Button size="small" onClick={fetchDemands}>
            Retry
          </Button>
        }
      />
    );
  }

  const columns: ColumnsType<Demand> = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (title: string) => (
        <span style={{ fontWeight: 500 }}>{title}</span>
      ),
    },
    {
      title: 'Organization',
      dataIndex: 'organization',
      key: 'organization',
      render: (org: Demand['organization']) => org?.name || '-',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (cat: Demand['category']) => cat?.name || '-',
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
      title: 'Published',
      dataIndex: 'publishedAt',
      key: 'publishedAt',
      sorter: true,
      render: (date: string | undefined) =>
        date ? new Date(date).toLocaleDateString() : '-',
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: true,
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ];

  return (
    <div>
      <Title level={4} style={{ marginBottom: 16 }}>
        Demand Management
      </Title>

      <Space style={{ marginBottom: 16 }} wrap>
        <Input.Search
          placeholder="Search by title or description"
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

      <Table<Demand>
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

export default DemandList;