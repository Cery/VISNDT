import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Select, Space, Spin, Alert, Button, Tag, Typography } from 'antd';
import { ReloadOutlined, EyeOutlined } from '@ant-design/icons';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { notificationService } from '../api';
import type { Notification, NotificationQueryParams } from '../types';

const { Title } = Typography;

type PageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: Notification[]; total: number };

interface QueryParams {
  status: string;
  type: string;
  page: number;
  pageSize: number;
}

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'UNREAD', label: 'Unread' },
  { value: 'READ', label: 'Read' },
];

const TYPE_OPTIONS = [
  { value: '', label: 'All Types' },
  { value: 'SYSTEM', label: 'System' },
  { value: 'DEMAND_UPDATE', label: 'Demand Update' },
  { value: 'RFQ_UPDATE', label: 'RFQ Update' },
  { value: 'RESPONSE_UPDATE', label: 'Response Update' },
];

const TYPE_COLOR_MAP: Record<string, string> = {
  SYSTEM: 'blue',
  DEMAND_UPDATE: 'cyan',
  RFQ_UPDATE: 'geekblue',
  RESPONSE_UPDATE: 'purple',
};

const STATUS_COLOR_MAP: Record<string, string> = {
  UNREAD: 'blue',
  READ: 'default',
};

function NotificationList() {
  const navigate = useNavigate();
  const [pageState, setPageState] = useState<PageState>({ status: 'loading' });
  const [query, setQuery] = useState<QueryParams>({
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
        err instanceof Error ? err.message : 'Failed to load notifications';
      setPageState({ status: 'error', message });
    }
  }, [query]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleStatusChange = useCallback((value: string) => {
    setQuery((prev) => ({ ...prev, status: value, page: 1 }));
  }, []);

  const handleTypeChange = useCallback((value: string) => {
    setQuery((prev) => ({ ...prev, type: value, page: 1 }));
  }, []);

  const handleReset = useCallback(() => {
    setQuery({
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
        message="Failed to load notifications"
        description={pageState.message}
        showIcon
        action={
          <Button size="small" onClick={fetchNotifications}>
            Retry
          </Button>
        }
      />
    );
  }

  const columns: ColumnsType<Notification> = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (title: string) => (
        <span style={{ fontWeight: 500 }}>{title}</span>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 150,
      render: (type: string) => (
        <Tag color={TYPE_COLOR_MAP[type] || 'default'}>{type}</Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={STATUS_COLOR_MAP[status] || 'default'}>{status}</Tag>
      ),
    },
    {
      title: 'Message',
      dataIndex: 'message',
      key: 'message',
      ellipsis: true,
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: 'Action',
      key: 'action',
      width: 80,
      render: (_: unknown, record: Notification) => (
        <Button
          type="text"
          icon={<EyeOutlined />}
          onClick={() => navigate(`/notifications/${record.id}`)}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Title level={4} style={{ marginBottom: 16 }}>
        Notification Center
      </Title>

      <Space style={{ marginBottom: 16 }} wrap>
        <Select
          placeholder="Filter by status"
          allowClear
          value={query.status || undefined}
          onChange={handleStatusChange}
          options={STATUS_OPTIONS}
          style={{ width: 160 }}
        />
        <Select
          placeholder="Filter by type"
          allowClear
          value={query.type || undefined}
          onChange={handleTypeChange}
          options={TYPE_OPTIONS}
          style={{ width: 180 }}
        />
        <Button icon={<ReloadOutlined />} onClick={handleReset}>
          Reset
        </Button>
      </Space>

      <Table<Notification>
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

export default NotificationList;