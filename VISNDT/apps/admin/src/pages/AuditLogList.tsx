import { useEffect, useState, useCallback } from 'react';
import { Table, Spin, Alert, Button, Tag, Typography, Card, Space } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { ReloadOutlined } from '@ant-design/icons';
import { auditLogService } from '../api';
import type { AuditLog, AuditAction } from '../types';
import { AdvancedFilterPanel, ExportButton } from '../components/operation';
import { RoleCapabilityCard } from '../components/permission';
import type { ExportColumn } from '../utils/export';

const { Title } = Typography;

const ACTION_LABEL_MAP: Record<string, string> = {
  CREATE: '创建',
  UPDATE: '更新',
  DELETE: '删除',
  STATUS_CHANGE: '状态变更',
  LOGIN: '登录',
};

const ACTION_COLOR: Record<string, string> = {
  CREATE: 'green',
  UPDATE: 'blue',
  DELETE: 'red',
  STATUS_CHANGE: 'orange',
  LOGIN: 'purple',
};

const ACTION_OPTIONS = [
  { label: '全部', value: '' },
  { label: '创建', value: 'CREATE' },
  { label: '更新', value: 'UPDATE' },
  { label: '删除', value: 'DELETE' },
  { label: '状态变更', value: 'STATUS_CHANGE' },
  { label: '登录', value: 'LOGIN' },
];

const ENTITY_TYPE_OPTIONS = [
  { label: '全部', value: '' },
  { label: 'Product', value: 'Product' },
  { label: 'Content', value: 'Content' },
  { label: 'User', value: 'User' },
  { label: 'Organization', value: 'Organization' },
  { label: 'Demand', value: 'Demand' },
  { label: 'Inquiry', value: 'Inquiry' },
  { label: 'RFQ', value: 'RFQ' },
  { label: 'Offer', value: 'Offer' },
];

const AUDIT_EXPORT_COLUMNS: ExportColumn<AuditLog>[] = [
  { key: 'createdAt', title: '时间', render: (item) => new Date(item.createdAt).toLocaleString() },
  { key: 'action', title: '操作类型', render: (item) => ACTION_LABEL_MAP[item.action] || item.action },
  { key: 'entityType', title: '实体类型' },
  { key: 'entityId', title: '实体编号' },
  { key: 'operator', title: '操作者', render: (item) => item.operator?.name || item.operator?.email || '' },
  { key: 'oldValue', title: '变更前', render: (item) => (item.oldValue ? JSON.stringify(item.oldValue) : '') },
  { key: 'newValue', title: '变更后', render: (item) => (item.newValue ? JSON.stringify(item.newValue) : '') },
];

type PageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'empty' }
  | { status: 'success'; data: AuditLog[]; total: number };

interface QueryParams {
  keyword: string;
  action: string;
  entityType: string;
  page: number;
  pageSize: number;
}

function AuditLogList() {
  const [pageState, setPageState] = useState<PageState>({ status: 'loading' });
  const [query, setQuery] = useState<QueryParams>({
    keyword: '',
    action: '',
    entityType: '',
    page: 1,
    pageSize: 20,
  });

  const fetchAuditLogs = useCallback(async () => {
    setPageState({ status: 'loading' });
    try {
      const params: {
        page: number;
        pageSize: number;
        action?: string;
        entityType?: string;
        keyword?: string;
      } = {
        page: query.page,
        pageSize: query.pageSize,
      };
      if (query.action) params.action = query.action;
      if (query.entityType) params.entityType = query.entityType;
      if (query.keyword) params.keyword = query.keyword;

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
        err instanceof Error ? err.message : '加载审计日志失败';
      setPageState({ status: 'error', message });
    }
  }, [query]);

  useEffect(() => {
    fetchAuditLogs();
  }, [fetchAuditLogs]);

  const handleReset = useCallback(() => {
    setQuery({ keyword: '', action: '', entityType: '', page: 1, pageSize: 20 });
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

  const handleRefresh = () => {
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
        message="加载审计日志失败"
        description={pageState.message}
        showIcon
        action={
          <Button size="small" onClick={fetchAuditLogs}>
            重试
          </Button>
        }
      />
    );
  }

  const columns: ColumnsType<AuditLog> = [
    {
      title: '时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: '操作类型',
      dataIndex: 'action',
      key: 'action',
      width: 120,
      render: (action: AuditAction) => (
        <Tag color={ACTION_COLOR[action] || 'default'}>{ACTION_LABEL_MAP[action] || action}</Tag>
      ),
    },
    {
      title: '实体类型',
      dataIndex: 'entityType',
      key: 'entityType',
      width: 120,
      render: (type: string) => <Tag>{type}</Tag>,
    },
    {
      title: '实体编号',
      dataIndex: 'entityId',
      key: 'entityId',
      width: 120,
      ellipsis: true,
      render: (id: string) => (
        <span style={{ fontFamily: 'monospace', fontSize: 12 }}>{id.slice(0, 8)}...</span>
      ),
    },
    {
      title: '操作者',
      dataIndex: 'operator',
      key: 'operator',
      width: 200,
      render: (operator: AuditLog['operator']) =>
        operator ? (
          <Space size={4}>
            <span>{operator.name || '-'}</span>
            <span style={{ color: '#999', fontSize: 12 }}>({operator.email})</span>
          </Space>
        ) : (
          '-'
        ),
    },
    {
      title: '变更前',
      dataIndex: 'oldValue',
      key: 'oldValue',
      width: 180,
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
      title: '变更后',
      dataIndex: 'newValue',
      key: 'newValue',
      width: 180,
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
        审计日志
      </Title>

      <RoleCapabilityCard />

      <Card size="small" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
          <AdvancedFilterPanel
            fields={[
              { key: 'keyword', label: '操作者', type: 'keyword', placeholder: '按操作者姓名或邮箱搜索', width: 240 },
              { key: 'action', label: '操作类型', type: 'select', options: ACTION_OPTIONS, width: 140 },
              { key: 'entityType', label: '实体类型', type: 'select', options: ENTITY_TYPE_OPTIONS, width: 140 },
            ]}
            values={{ keyword: query.keyword, action: query.action, entityType: query.entityType }}
            onChange={(values) => {
              setQuery((prev) => ({ ...prev, ...values, page: 1 }));
            }}
            onSearch={fetchAuditLogs}
            onReset={handleReset}
          />
          <Space>
            <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
              刷新
            </Button>
            <ExportButton<AuditLog>
              data={pageState.status === 'success' ? pageState.data : []}
              columns={AUDIT_EXPORT_COLUMNS}
              fileName="审计日志"
              onExportAll={async () => {
                const all = await auditLogService.getList({ page: 1, pageSize: 10000 });
                return all.data;
              }}
            />
          </Space>
        </div>
      </Card>

      {pageState.status === 'empty' ? (
        <Alert
          type="info"
          message="暂无审计日志"
          description="未找到审计日志记录。"
          showIcon
        />
      ) : (
        <Table<AuditLog>
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
          scroll={{ x: 'max-content' }}
        />
      )}
    </div>
  );
}

export default AuditLogList;