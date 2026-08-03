import { useEffect, useState, useCallback } from 'react';
import { Table, Spin, Alert, Button, Tag, Typography, Space, Select, Input, Card } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { auditLogService } from '../api';
import type { AuditLog, AuditAction } from '../types';

const { Title } = Typography;

const ACTION_COLOR: Record<string, string> = {
  CREATE: 'green',
  UPDATE: 'blue',
  DELETE: 'red',
  STATUS_CHANGE: 'orange',
  LOGIN: 'purple',
};

const ACTION_OPTIONS: { label: string; value: string }[] = [
  { label: 'All', value: '' },
  { label: 'CREATE', value: 'CREATE' },
  { label: 'UPDATE', value: 'UPDATE' },
  { label: 'DELETE', value: 'DELETE' },
  { label: 'STATUS_CHANGE', value: 'STATUS_CHANGE' },
  { label: 'LOGIN', value: 'LOGIN' },
];

type PageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'empty' }
  | { status: 'success'; data: AuditLog[]; total: number };

function AuditLogList() {
  const [pageState, setPageState] = useState<PageState>({ status: 'loading' });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [actionFilter, setActionFilter] = useState<string>('');
  const [entityTypeFilter, setEntityTypeFilter] = useState<string>('');

  const fetchAuditLogs = useCallback(async () => {
    setPageState({ status: 'loading' });
    try {
      const params: { page: number; pageSize: number; action?: string; entityType?: string } = {
        page,
        pageSize,
      };
      if (actionFilter) params.action = actionFilter;
      if (entityTypeFilter) params.entityType = entityTypeFilter;

      const result = await auditLogService.getList(params);
      if (result.data.length === 0) {
        setPageState({ status: 'empty' });
      } else {
        setPageState({
          status: 'success',
          data: result.data,
          total: result.total,
        });
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to load audit logs';
      setPageState({ status: 'error', message });
    }
  }, [page, pageSize, actionFilter, entityTypeFilter]);

  useEffect(() => {
    fetchAuditLogs();
  }, [fetchAuditLogs]);

  const handleTableChange = useCallback(
    (pagination: TablePaginationConfig) => {
      setPage(pagination.current || 1);
      setPageSize(pagination.pageSize || 20);
    },
    [],
  );

  const handleRefresh = () => {
    setPage(1);
    fetchAuditLogs();
  };

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
        message="Failed to load audit logs"
        description={pageState.message}
        showIcon
        action={
          <Button size="small" onClick={fetchAuditLogs}>
            Retry
          </Button>
        }
      />
    );
  }

  const columns: ColumnsType<AuditLog> = [
    {
      title: 'Time',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      width: 140,
      render: (action: AuditAction) => (
        <Tag color={ACTION_COLOR[action] || 'default'}>{action}</Tag>
      ),
    },
    {
      title: 'Entity Type',
      dataIndex: 'entityType',
      key: 'entityType',
      width: 140,
      render: (type: string) => <Tag>{type}</Tag>,
    },
    {
      title: 'Entity ID',
      dataIndex: 'entityId',
      key: 'entityId',
      width: 120,
      ellipsis: true,
      render: (id: string) => (
        <span style={{ fontFamily: 'monospace', fontSize: 12 }}>{id.slice(0, 8)}...</span>
      ),
    },
    {
      title: 'Operator',
      dataIndex: 'operator',
      key: 'operator',
      width: 180,
      render: (operator: AuditLog['operator']) =>
        operator ? operator.name || operator.email : '-',
    },
    {
      title: 'Old Value',
      dataIndex: 'oldValue',
      key: 'oldValue',
      width: 200,
      ellipsis: true,
      render: (val: AuditLog['oldValue']) =>
        val ? (
          <span style={{ fontFamily: 'monospace', fontSize: 12 }}>
            {JSON.stringify(val).slice(0, 60)}
          </span>
        ) : (
          '-'
        ),
    },
    {
      title: 'New Value',
      dataIndex: 'newValue',
      key: 'newValue',
      width: 200,
      ellipsis: true,
      render: (val: AuditLog['newValue']) =>
        val ? (
          <span style={{ fontFamily: 'monospace', fontSize: 12 }}>
            {JSON.stringify(val).slice(0, 60)}
          </span>
        ) : (
          '-'
        ),
    },
  ];

  return (
    <div>
      <Title level={4} style={{ marginBottom: 16 }}>
        Audit Log
      </Title>

      <Card size="small" style={{ marginBottom: 16 }}>
        <Space wrap>
          <span>Action:</span>
          <Select
            value={actionFilter}
            onChange={(v) => {
              setActionFilter(v);
              setPage(1);
            }}
            options={ACTION_OPTIONS}
            style={{ width: 160 }}
          />
          <span>Entity Type:</span>
          <Input
            placeholder="e.g. DEMAND, OFFER"
            value={entityTypeFilter}
            onChange={(e) => {
              setEntityTypeFilter(e.target.value);
              setPage(1);
            }}
            style={{ width: 180 }}
            prefix={<SearchOutlined />}
            allowClear
          />
          <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
            Refresh
          </Button>
        </Space>
      </Card>

      {pageState.status === 'empty' ? (
        <Alert
          type="info"
          message="No audit logs"
          description="No audit log entries found."
          showIcon
        />
      ) : (
        <Table<AuditLog>
          columns={columns}
          dataSource={pageState.data}
          rowKey="id"
          onChange={handleTableChange}
          pagination={{
            current: page,
            pageSize,
            total: pageState.total,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
          }}
          scroll={{ x: 1200 }}
        />
      )}
    </div>
  );
}

export default AuditLogList;