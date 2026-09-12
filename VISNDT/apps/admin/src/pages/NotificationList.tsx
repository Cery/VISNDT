import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Select, Space, Spin, Alert, Button, message, Input } from 'antd';
import { ReloadOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { notificationService } from '../api';
import type { Notification, NotificationQueryParams } from '../types';
import { BatchActionBar } from '../components/operation';
import { StatusTag } from '../components/design-system';
import { PageHeader } from '../components/common';

type PageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: Notification[]; total: number };

interface QueryParams {
  keyword: string;
  status: string;
  type: string;
  page: number;
  pageSize: number;
}

const STATUS_OPTIONS = [
  { value: '', label: '全部状态' },
  { value: 'UNREAD', label: '未读' },
  { value: 'READ', label: '已读' },
];

const TYPE_OPTIONS = [
  { value: '', label: '全部类型' },
  { value: 'SYSTEM', label: '系统' },
  { value: 'DEMAND_UPDATE', label: '需求更新' },
  { value: 'RFQ_UPDATE', label: '询价更新' },
  { value: 'RESPONSE_UPDATE', label: '响应更新' },
];

const STATUS_LABEL_MAP: Record<string, string> = {
  UNREAD: '未读',
  READ: '已读',
};

function NotificationList() {
  const navigate = useNavigate();
  const [pageState, setPageState] = useState<PageState>({ status: 'loading' });
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [batchLoading, setBatchLoading] = useState(false);
  const [query, setQuery] = useState<QueryParams>({
    keyword: '',
    status: '',
    type: '',
    page: 1,
    pageSize: 20,
  });

  const fetchNotifications = useCallback(async () => {
    setPageState({ status: 'loading' });
    try {
      const params: NotificationQueryParams = {
        page: query.page,
        pageSize: query.pageSize,
      };
      if (query.keyword) {
        params.keyword = query.keyword;
      }
      if (query.status) {
        params.status = query.status as NotificationQueryParams['status'];
      }
      if (query.type) {
        params.type = query.type as NotificationQueryParams['type'];
      }

      const result = await notificationService.getList(params);
      setPageState({
        status: 'success',
        data: result.data,
        total: result.total,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : '加载通知列表失败';
      setPageState({ status: 'error', message });
    }
  }, [query]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleSearch = useCallback((value: string) => {
    setQuery((prev) => ({ ...prev, keyword: value, page: 1 }));
  }, []);

  const handleStatusChange = useCallback((value: string) => {
    setQuery((prev) => ({ ...prev, status: value, page: 1 }));
  }, []);

  const handleTypeChange = useCallback((value: string) => {
    setQuery((prev) => ({ ...prev, type: value, page: 1 }));
  }, []);

  const handleReset = useCallback(() => {
    setQuery({
      keyword: '',
      status: '',
      type: '',
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

  const handleBatchDelete = useCallback(async (ids: string[]) => {
    setBatchLoading(true);
    const hideLoading = message.loading('正在删除...');
    try {
      await notificationService.batchDelete(ids);
      hideLoading();
      message.success(`成功删除 ${ids.length} 条通知`);
      setSelectedRowKeys([]);
      fetchNotifications();
    } catch (err) {
      hideLoading();
      message.error(err instanceof Error ? err.message : '批量删除失败');
    } finally {
      setBatchLoading(false);
    }
  }, [fetchNotifications]);

  const handleBatchMarkRead = useCallback(async () => {
    setBatchLoading(true);
    const hideLoading = message.loading('正在标记已读...');
    try {
      await notificationService.markAllRead();
      hideLoading();
      message.success('已全部标记为已读');
      setSelectedRowKeys([]);
      fetchNotifications();
    } catch (err) {
      hideLoading();
      message.error(err instanceof Error ? err.message : '标记已读失败');
    } finally {
      setBatchLoading(false);
    }
  }, [fetchNotifications]);

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
        message="加载通知列表失败"
        description={pageState.message}
        showIcon
        action={
          <Button size="small" onClick={fetchNotifications}>
            重试
          </Button>
        }
      />
    );
  }

  const columns: ColumnsType<Notification> = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      render: (title: string) => (
        <span style={{ fontWeight: 500 }}>{title}</span>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 150,
      render: (type: string) => (
        <StatusTag status={type} />
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <StatusTag status={status} label={STATUS_LABEL_MAP[status] || '未知状态'} />
      ),
    },
    {
      title: '消息',
      dataIndex: 'message',
      key: 'message',
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      fixed: 'right' as const,
      render: (_: unknown, record: Notification) => (
        <Button
          type="text"
          icon={<EyeOutlined />}
          onClick={() => navigate(`/notifications/${record.id}`)}
        >
          查看
        </Button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="通知管理"
        subtitle="管理平台通知、发送状态与模板"
      />

      <Space style={{ marginBottom: 16 }} wrap>
        <Input.Search
          placeholder="搜索通知标题..."
          allowClear
          onSearch={handleSearch}
          style={{ width: 240 }}
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
        <Select
          placeholder="按类型筛选"
          allowClear
          value={query.type || undefined}
          onChange={handleTypeChange}
          options={TYPE_OPTIONS}
          style={{ width: 180 }}
        />
        <Button icon={<ReloadOutlined />} onClick={handleReset}>
          重置
        </Button>
      </Space>

      <Space style={{ marginBottom: 16 }}>
        <Button onClick={handleBatchMarkRead} loading={batchLoading}>
          标记全部已读
        </Button>
      </Space>

      <BatchActionBar
        selectedRowKeys={selectedRowKeys}
        actions={[
          { key: 'delete', label: '批量删除', danger: true, icon: undefined, confirmTitle: '确认删除', confirmContent: `确定要删除选中的 ${selectedRowKeys.length} 条通知吗？此操作不可撤销。` },
        ]}
        onAction={async (actionKey, ids) => {
          if (actionKey === 'delete') {
            await handleBatchDelete(ids);
          }
        }}
        loading={batchLoading}
      />

      <Table<Notification>
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
          showTotal: (total, range) => `${range[0]}-${range[1]} / ${total}`,
        }}
      />
    </div>
  );
}

export default NotificationList;