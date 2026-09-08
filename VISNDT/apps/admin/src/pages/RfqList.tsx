import { useEffect, useState, useCallback } from 'react';
import { Table, Select, Space, Spin, Alert, Button, Typography, Input, message, Modal } from 'antd';
import { ReloadOutlined, PlusOutlined } from '@ant-design/icons';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import { rfqService, organizationService } from '../api';
import type { Rfq } from '../types';
import { BatchActionBar } from '../components/operation';
import { VISNDT_COLORS } from '../components/design-system/tokens';
import { StatusTag } from '../components/design-system';
import { BusinessIdentityBadge } from '@visndt/design-system';

const { Title, Text } = Typography;

type PageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'empty' }
  | { status: 'success'; data: Rfq[]; total: number };

const STATUS_OPTIONS = [
  { value: '', label: '全部状态' },
  { value: 'DRAFT', label: '草稿' },
  { value: 'OPEN', label: '开放' },
  { value: 'RESPONDING', label: '响应中' },
  { value: 'CLOSED', label: '已关闭' },
  { value: 'CANCELLED', label: '已取消' },
];

const BATCH_STATUS_OPTIONS = [
  { label: '草稿', value: 'DRAFT' },
  { label: '开放', value: 'OPEN' },
  { label: '已关闭', value: 'CLOSED' },
];

const RFQ_STATUS_LABEL_MAP: Record<string, string> = {
  DRAFT: '草稿',
  OPEN: '开放',
  RESPONDING: '响应中',
  CLOSED: '已关闭',
  CANCELLED: '已取消',
};

interface QueryParams {
  page: number;
  pageSize: number;
  keyword: string;
  status: string;
}

function RfqList() {
  const navigate = useNavigate();
  const [pageState, setPageState] = useState<PageState>({ status: 'loading' });
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [batchLoading, setBatchLoading] = useState(false);
  const [orgNameMap, setOrgNameMap] = useState<Map<string, string>>(new Map());
  const [query, setQuery] = useState<QueryParams>({
    page: 1,
    pageSize: 20,
    keyword: '',
    status: '',
  });

  // Load organization name mapping for targetOrganization display (reuse existing API)
  useEffect(() => {
    const loadOrgNames = async () => {
      try {
        const result = await organizationService.getList({ page: 1, pageSize: 10000 });
        const map = new Map<string, string>();
        for (const org of result.data) {
          if (org.id && org.name) {
            map.set(org.id, org.name);
          }
        }
        setOrgNameMap(map);
      } catch {
        // Non-critical
      }
    };
    loadOrgNames();
  }, []);

  const fetchRfqs = useCallback(async () => {
    setPageState({ status: 'loading' });
    try {
      const result = await rfqService.getList(
        query.page,
        query.pageSize,
        query.keyword || undefined,
        query.status || undefined,
      );
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
        err instanceof Error ? err.message : '加载 RFQ 失败';
      setPageState({ status: 'error', message });
    }
  }, [query]);

  useEffect(() => {
    fetchRfqs();
  }, [fetchRfqs]);

  const handleSearch = useCallback((value: string) => {
    setQuery((prev) => ({ ...prev, keyword: value, page: 1 }));
  }, []);

  const handleStatusChange = useCallback((value: string) => {
    setQuery((prev) => ({ ...prev, status: value, page: 1 }));
  }, []);

  const handleReset = useCallback(() => {
    setQuery({ page: 1, pageSize: 20, keyword: '', status: '' });
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
      content: '确定要删除此询价吗？此操作不可撤销。',
      okText: '确认删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          await rfqService.remove(id);
          message.success('询价已删除');
          fetchRfqs();
        } catch (err) {
          message.error(err instanceof Error ? err.message : '删除失败');
        }
      },
    });
  }, [fetchRfqs]);

  const handleBatchDelete = useCallback(async (ids: string[]) => {
    setBatchLoading(true);
    const hideLoading = message.loading('正在删除...');
    try {
      await rfqService.batchDelete(ids);
      hideLoading();
      message.success(`成功删除 ${ids.length} 个询价`);
      setSelectedRowKeys([]);
      fetchRfqs();
    } catch (err) {
      hideLoading();
      message.error(err instanceof Error ? err.message : '批量删除失败');
    } finally {
      setBatchLoading(false);
    }
  }, [fetchRfqs]);

  const handleBatchStatus = useCallback(async (ids: string[], status: string) => {
    setBatchLoading(true);
    const hideLoading = message.loading('正在更新状态...');
    try {
      await rfqService.batchStatus(ids, status);
      hideLoading();
      message.success(`成功更新 ${ids.length} 个询价状态`);
      setSelectedRowKeys([]);
      fetchRfqs();
    } catch (err) {
      hideLoading();
      message.error(err instanceof Error ? err.message : '批量更新状态失败');
    } finally {
      setBatchLoading(false);
    }
  }, [fetchRfqs]);

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
        message="加载询价失败"
        description={pageState.message}
        showIcon
        action={
          <Button size="small" onClick={fetchRfqs}>
            重试
          </Button>
        }
      />
    );
  }

  // Group RFQs by demand.id for UI aggregation (sort + rowSpan)
  const groupedData: Rfq[] = pageState.status === 'success'
    ? [...pageState.data].sort((a, b) => {
        const da = a.demand?.id ?? '';
        const db = b.demand?.id ?? '';
        if (da === db) return 0;
        return da < db ? -1 : 1;
      })
    : [];

  // Compute rowSpan map for demand column (first row of each demand group gets count, others get 0)
  const demandRowSpanMap = new Map<string, number>();
  if (groupedData.length > 0) {
    const demandCounts = new Map<string, number>();
    for (const rfq of groupedData) {
      const demandId = rfq.demand?.id ?? rfq.demandId ?? '';
      demandCounts.set(demandId, (demandCounts.get(demandId) ?? 0) + 1);
    }
    let prevDemandId: string | null = null;
    for (const rfq of groupedData) {
      const demandId = rfq.demand?.id ?? rfq.demandId ?? '';
      const rfqKey = rfq.id;
      if (demandId !== prevDemandId) {
        demandRowSpanMap.set(rfqKey, demandCounts.get(demandId) ?? 1);
        prevDemandId = demandId;
      } else {
        demandRowSpanMap.set(rfqKey, 0);
      }
    }
  }

  const columns: ColumnsType<Rfq> = [
    {
      title: 'RFQ 编号',
      dataIndex: 'id',
      key: 'id',
      width: 180,
      render: (_: unknown, record: Rfq) => (
        <BusinessIdentityBadge type="RFQ" id={record.id} createdAt={record.createdAt} variant="plain" />
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => (
        <StatusTag status={status} label={RFQ_STATUS_LABEL_MAP[status] || '未知状态'} />
      ),
    },
    {
      title: '需求',
      dataIndex: 'demand',
      key: 'demand',
      onCell: (record: Rfq) => ({ rowSpan: demandRowSpanMap.get(record.id) ?? 1 }),
      render: (demand: Rfq['demand'], record: Rfq) => {
        const demandId = demand?.id ?? record.demandId;
        return (
          <div>
            <div style={{ fontWeight: 500 }}>{demand?.title || '-'}</div>
            {demandId && (
              <div style={{ marginTop: 4 }}>
                <BusinessIdentityBadge type="DEMAND" id={demandId} variant="plain" />
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: '目标供应商',
      key: 'targetOrganization',
      width: 160,
      render: (_: unknown, record: Rfq) => {
        if (!record.targetOrganizationId) {
          return <span style={{ color: VISNDT_COLORS.neutral }}>公开</span>;
        }
        const orgName = orgNameMap.get(record.targetOrganizationId);
        return orgName || record.targetOrganizationId.slice(0, 8) + '...';
      },
    },
    {
      title: '创建者',
      dataIndex: 'createdByUser',
      key: 'creator',
      render: (user: Rfq['createdByUser']) => user?.name || user?.email || '-',
    },
    {
      title: '发布时间',
      dataIndex: 'publishedAt',
      key: 'publishedAt',
      render: (date: string | undefined) =>
        date ? new Date(date).toLocaleDateString() : '-',
    },
    {
      title: '关闭时间',
      dataIndex: 'closedAt',
      key: 'closedAt',
      render: (date: string | undefined) =>
        date ? new Date(date).toLocaleDateString() : '-',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: '操作',
      key: 'actions',
      width: 100,
      fixed: 'right' as const,
      render: (_: unknown, record: Rfq) => (
        <Space>
          <Button
            type="link"
            onClick={() => navigate(`/rfqs/${record.id}`)}
          >
            查看
          </Button>
          <Button
            type="link"
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
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 4, height: 20, borderRadius: 2, background: VISNDT_COLORS.primary, flexShrink: 0 }} />
          <Title level={4} style={{ margin: 0 }}>RFQ 管理</Title>
        </div>
        <Text type="secondary" style={{ fontSize: 12, marginLeft: 12, display: 'block', marginTop: 4 }}>
          管理 RFQ 生命周期、状态与供应商响应
        </Text>
      </div>

      <Space style={{ marginBottom: 16 }} wrap>
        <Input.Search
          placeholder="搜索需求标题..."
          allowClear
          onSearch={handleSearch}
          style={{ width: 240 }}
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
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/rfqs/create')}
        >
          创建 RFQ
        </Button>
      </Space>

      <BatchActionBar
        selectedRowKeys={selectedRowKeys}
        actions={[
          ...BATCH_STATUS_OPTIONS.map((opt) => ({
            key: `status:${opt.value}`,
            label: opt.label,
            confirmTitle: '确认状态变更',
            confirmContent: `确定要将选中的 ${selectedRowKeys.length} 项状态变更为「${opt.label}」吗？`,
          })),
          { key: 'delete', label: '批量删除', danger: true, icon: undefined, confirmTitle: '确认删除', confirmContent: `确定要删除选中的 ${selectedRowKeys.length} 个 RFQ 吗？此操作不可撤销。` },
        ]}
        onAction={async (actionKey, ids) => {
          if (actionKey === 'delete') {
            await handleBatchDelete(ids);
          } else if (actionKey.startsWith('status:')) {
            const status = actionKey.replace('status:', '');
            await handleBatchStatus(ids, status);
          }
        }}
        loading={batchLoading}
      />

      {pageState.status === 'empty' ? (
        <Alert
          type="info"
          message="暂无 RFQ"
          showIcon
        />
      ) : (
        <Table<Rfq>
          columns={columns}
          dataSource={groupedData}
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
      )}
    </div>
  );
}

export default RfqList;