import { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Input, Select, Space, Spin, Alert, Button, Tag, Typography } from 'antd';
import { SearchOutlined, ReloadOutlined, EyeOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { userService } from '../api';
import type { User, SearchUserParams } from '../types';

const { Title } = Typography;

type PageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: User[]; total: number };

interface QueryParams {
  keyword: string;
  status: string;
  page: number;
  pageSize: number;
}

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
  { value: 'SUSPENDED', label: 'Suspended' },
];

const STATUS_COLOR_MAP: Record<string, string> = {
  ACTIVE: 'green',
  INACTIVE: 'orange',
  SUSPENDED: 'red',
};

function UserList() {
  const navigate = useNavigate();
  const [pageState, setPageState] = useState<PageState>({ status: 'loading' });
  const [query, setQuery] = useState<QueryParams>({
    keyword: '',
    status: '',
    page: 1,
    pageSize: 20,
  });

  const fetchUsers = useCallback(async () => {
    setPageState({ status: 'loading' });
    try {
      const params: SearchUserParams = {
        page: query.page,
        pageSize: query.pageSize,
      };

      const result = await userService.getList(params);
      setPageState({
        status: 'success',
        data: result.data,
        total: result.total,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to load users';
      setPageState({ status: 'error', message });
    }
  }, [query]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredData = useMemo(() => {
    if (pageState.status !== 'success') return [];
    let list = pageState.data;
    if (query.keyword.trim()) {
      const kw = query.keyword.trim().toLowerCase();
      list = list.filter(
        (u) =>
          u.email.toLowerCase().includes(kw) ||
          (u.name && u.name.toLowerCase().includes(kw)),
      );
    }
    if (query.status) {
      list = list.filter((u) => u.status === query.status);
    }
    return list;
  }, [pageState, query.keyword, query.status]);

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
      page: 1,
      pageSize: 20,
    });
  }, []);

  const handleTableChange = useCallback(
    (pagination: TablePaginationConfig) => {
      setQuery((prev) => ({
        ...prev,
        page: pagination.current || 1,
        pageSize: pagination.pageSize || 20,
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
        message="Failed to load users"
        description={pageState.message}
        showIcon
        action={
          <Button size="small" onClick={fetchUsers}>
            Retry
          </Button>
        }
      />
    );
  }

  const columns: ColumnsType<User> = [
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email: string) => (
        <span style={{ fontWeight: 500 }}>{email}</span>
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string | undefined) => name || '-',
    },
    {
      title: 'Organization ID',
      dataIndex: 'organizationId',
      key: 'organizationId',
      render: (id: string | undefined) => id || '-',
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
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Action',
      key: 'action',
      width: 140,
      render: (_: unknown, record: User) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/users/${record.id}`)}
          >
            View
          </Button>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => navigate(`/users/${record.id}/edit`)}
          >
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={4} style={{ marginBottom: 16 }}>
        User Management
      </Title>

      <Space style={{ marginBottom: 16 }} wrap>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/users/create')}
        >
          Create User
        </Button>
        <Input.Search
          placeholder="Search by email or name"
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

      <Table<User>
        columns={columns}
        dataSource={filteredData}
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

export default UserList;