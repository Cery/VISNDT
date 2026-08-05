import { useEffect, useState, useCallback } from 'react';
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
  { value: '', label: '全部状态' },
  { value: 'ACTIVE', label: '活跃' },
  { value: 'INACTIVE', label: '未激活' },
  { value: 'SUSPENDED', label: '已停用' },
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
        keyword: query.keyword.trim() || undefined,
        status: query.status || undefined,
      };

      const result = await userService.getList(params);
      setPageState({
        status: 'success',
        data: result.data,
        total: result.total,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : '加载用户失败';
      setPageState({ status: 'error', message });
    }
  }, [query]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

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
        message="加载用户失败"
        description={pageState.message}
        showIcon
        action={
          <Button size="small" onClick={fetchUsers}>
            重试
          </Button>
        }
      />
    );
  }

  const columns: ColumnsType<User> = [
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      render: (email: string) => (
        <span style={{ fontWeight: 500 }}>{email}</span>
      ),
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      render: (name: string | undefined) => name || '-',
    },
    {
      title: '组织ID',
      dataIndex: 'organizationId',
      key: 'organizationId',
      render: (id: string | undefined) => id || '-',
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
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: '操作',
      key: 'action',
      width: 140,
      render: (_: unknown, record: User) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/users/${record.id}`)}
          >
            查看
          </Button>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => navigate(`/users/${record.id}/edit`)}
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
        用户管理
      </Title>

      <Space style={{ marginBottom: 16 }} wrap>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/users/create')}
        >
          创建用户
        </Button>
        <Input.Search
          placeholder="按邮箱或姓名搜索"
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

      <Table<User>
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

export default UserList;