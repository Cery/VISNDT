import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Input, Select, Space, Spin, Alert, Button, Tag, Typography, message, Modal } from 'antd';
import { SearchOutlined, ReloadOutlined, EyeOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { organizationService } from '../api';
import type { Organization, SearchOrganizationParams } from '../types';
import BatchOperations from '../components/BatchOperations';

const { Title } = Typography;

type PageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: Organization[]; total: number };

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

const BATCH_STATUS_OPTIONS = [
  { label: '启用', value: 'ACTIVE' },
  { label: '停用', value: 'INACTIVE' },
  { label: '冻结', value: 'SUSPENDED' },
];

const STATUS_COLOR_MAP: Record<string, string> = {
  ACTIVE: 'green',
  INACTIVE: 'orange',
  SUSPENDED: 'red',
};

const STATUS_LABEL_MAP: Record<string, string> = {
  ACTIVE: '活跃',
  INACTIVE: '未激活',
  SUSPENDED: '已停用',
};

function OrganizationList() {
  const navigate = useNavigate();
  const [pageState, setPageState] = useState<PageState>({ status: 'loading' });
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [batchLoading, setBatchLoading] = useState(false);
  const [query, setQuery] = useState<QueryParams>({
    keyword: '',
    status: '',
    page: 1,
    pageSize: 20,
  });

  const fetchOrganizations = useCallback(async () => {
    setPageState({ status: 'loading' });
    try {
      const params: SearchOrganizationParams = {
        page: query.page,
        pageSize: query.pageSize,
      };
      if (query.keyword.trim()) {
        params.keyword = query.keyword.trim();
      }
      if (query.status) {
        params.status = query.status;
      }

      const result = await organizationService.getList(params);
      setPageState({
        status: 'success',
        data: result.data,
        total: result.total,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : '加载组织失败';
      setPageState({ status: 'error', message });
    }
  }, [query]);

  useEffect(() => {
    fetchOrganizations();
  }, [fetchOrganizations]);

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

  const handleDelete = useCallback((id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除此组织吗？此操作不可撤销。',
      okText: '确认删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          await organizationService.remove(id);
          message.success('组织已删除');
          fetchOrganizations();
        } catch (err) {
          message.error(err instanceof Error ? err.message : '删除失败');
        }
      },
    });
  }, [fetchOrganizations]);

  const handleBatchDelete = useCallback(async (ids: string[]) => {
    setBatchLoading(true);
    const hideLoading = message.loading('正在删除...');
    try {
      await organizationService.batchDelete(ids);
      hideLoading();
      message.success(`成功删除 ${ids.length} 个组织`);
      setSelectedRowKeys([]);
      fetchOrganizations();
    } catch (err) {
      hideLoading();
      message.error(err instanceof Error ? err.message : '批量删除失败');
    } finally {
      setBatchLoading(false);
    }
  }, [fetchOrganizations]);

  const handleBatchStatus = useCallback(async (ids: string[], status: string) => {
    setBatchLoading(true);
    const hideLoading = message.loading('正在更新状态...');
    try {
      await organizationService.batchStatus(ids, status);
      hideLoading();
      message.success(`成功更新 ${ids.length} 个组织状态`);
      setSelectedRowKeys([]);
      fetchOrganizations();
    } catch (err) {
      hideLoading();
      message.error(err instanceof Error ? err.message : '批量更新状态失败');
    } finally {
      setBatchLoading(false);
    }
  }, [fetchOrganizations]);

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
        message="加载组织失败"
        description={pageState.message}
        showIcon
        action={
          <Button size="small" onClick={fetchOrganizations}>
            重试
          </Button>
        }
      />
    );
  }

  const columns: ColumnsType<Organization> = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => (
        <span style={{ fontWeight: 500 }}>{name}</span>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => type || '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => (
        <Tag color={STATUS_COLOR_MAP[status] || 'default'}>{STATUS_LABEL_MAP[status] || status}</Tag>
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
      width: 160,
      render: (_: unknown, record: Organization) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/organizations/${record.id}`)}
            >
              查看
            </Button>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => navigate(`/organizations/${record.id}/edit`)}
            >
              编辑
            </Button>
          <Button
            type="text"
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>
          组织管理
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/organizations/create')}
        >
          创建组织
        </Button>
      </div>

      <Space style={{ marginBottom: 16 }} wrap>
        <Input.Search
          placeholder="按名称或类型搜索"
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

      <BatchOperations
        selectedRowKeys={selectedRowKeys}
        onBatchDelete={handleBatchDelete}
        onBatchStatus={handleBatchStatus}
        statusOptions={BATCH_STATUS_OPTIONS}
        loading={batchLoading}
      />

      <Table<Organization>
        columns={columns}
        dataSource={pageState.status === 'success' ? pageState.data : []}
        rowKey="id"
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

export default OrganizationList;