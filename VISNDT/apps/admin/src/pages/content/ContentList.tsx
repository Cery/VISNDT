import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Space, Spin, Alert, Button, Tag, Typography } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { contentService } from '../../api';
import type { Content, ContentType, ContentStatus } from '../../types';
import { ExportButton, AdvancedFilterPanel } from '../../components/operation';
import type { ExportColumn } from '../../utils/export';

const { Title } = Typography;

type PageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: Content[]; total: number };

interface QueryParams {
  keyword: string;
  type: ContentType | '';
  status: ContentStatus | '';
  page: number;
  pageSize: number;
}

const TYPE_OPTIONS = [
  { value: '', label: '全部类型' },
  { value: 'ARTICLE', label: '文章' },
  { value: 'KNOWLEDGE', label: '知识' },
  { value: 'SOLUTION', label: '解决方案' },
  { value: 'INSIGHT', label: '参数百科（Insight）' },
];

const STATUS_OPTIONS = [
  { value: '', label: '全部状态' },
  { value: 'DRAFT', label: '草稿' },
  { value: 'REVIEW', label: '审核中' },
  { value: 'PUBLISHED', label: '已发布' },
  { value: 'ARCHIVED', label: '已归档' },
];

const STATUS_COLOR_MAP: Record<string, string> = {
  DRAFT: 'default',
  REVIEW: 'orange',
  PUBLISHED: 'green',
  ARCHIVED: 'red',
};

const STATUS_LABEL_MAP: Record<string, string> = {
  DRAFT: '草稿',
  REVIEW: '审核中',
  PUBLISHED: '已发布',
  ARCHIVED: '已归档',
};

const TYPE_LABEL_MAP: Record<string, string> = {
  ARTICLE: '文章',
  KNOWLEDGE: '知识',
  SOLUTION: '解决方案',
  INSIGHT: '洞察',
};

const CONTENT_EXPORT_COLUMNS: ExportColumn<Content>[] = [
  { key: 'title', title: '标题' },
  { key: 'type', title: '类型', render: (item) => TYPE_LABEL_MAP[item.type] || item.type },
  { key: 'status', title: '状态', render: (item) => STATUS_LABEL_MAP[item.status] || item.status },
  { key: 'createdAt', title: '创建时间', render: (item) => new Date(item.createdAt).toLocaleDateString() },
  { key: 'updatedAt', title: '更新时间', render: (item) => new Date(item.updatedAt).toLocaleDateString() },
];

function ContentList() {
  const navigate = useNavigate();
  const [pageState, setPageState] = useState<PageState>({ status: 'loading' });
  const [query, setQuery] = useState<QueryParams>({
    keyword: '',
    type: '',
    status: '',
    page: 1,
    pageSize: 20,
  });

  const fetchContents = useCallback(async () => {
    setPageState({ status: 'loading' });
    try {
      const result = await contentService.getList({
        page: query.page,
        pageSize: query.pageSize,
        ...(query.keyword ? { keyword: query.keyword } : {}),
        ...(query.type ? { type: query.type } : {}),
        ...(query.status ? { status: query.status } : {}),
      });
      setPageState({
        status: 'success',
        data: result.data,
        total: result.total,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : '加载内容失败';
      setPageState({ status: 'error', message });
    }
  }, [query]);

  useEffect(() => {
    fetchContents();
  }, [fetchContents]);

  const handleReset = useCallback(() => {
    setQuery({ keyword: '', type: '', status: '', page: 1, pageSize: 20 });
  }, []);

  const handleTableChange = useCallback((pagination: TablePaginationConfig) => {
    setQuery((prev) => ({
      ...prev,
      page: pagination.current || 1,
      pageSize: pagination.pageSize || 20,
    }));
  }, []);

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
        message="加载内容失败"
        description={pageState.message}
        showIcon
        action={
          <Button size="small" onClick={fetchContents}>
            重试
          </Button>
        }
      />
    );
  }

  const columns: ColumnsType<Content> = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      render: (title: string) => <span style={{ fontWeight: 500 }}>{title}</span>,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type: ContentType) => (
        <Tag color="blue">{TYPE_LABEL_MAP[type] || type}</Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: ContentStatus) => (
        <Tag color={STATUS_COLOR_MAP[status] || 'default'}>
          {STATUS_LABEL_MAP[status] || status}
        </Tag>
      ),
    },
    {
      title: '作者',
      key: 'author',
      width: 140,
      render: (_: unknown, record: Content) => {
        const name = record.author?.name || record.author?.email;
        return name || '-';
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 160,
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: '操作',
      key: 'actions',
      width: 120,
      fixed: 'right' as const,
      render: (_: unknown, record: Content) => (
        <Button type="link" onClick={() => navigate(`/content/${record.id}`)}>
          编辑
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Title level={4} style={{ marginBottom: 4 }}>
        内容管理
      </Title>
      <Typography.Text type="secondary" style={{ display: 'block', marginBottom: 16, fontSize: 13 }}>
        管理知识、文章与解决方案内容
      </Typography.Text>

      <Space style={{ marginBottom: 16 }} wrap>
        <Button type="primary" onClick={() => navigate('/content/create')}>
          创建内容
        </Button>
        <AdvancedFilterPanel
          fields={[
            { key: 'keyword', label: '内容', type: 'keyword', placeholder: '按标题搜索', width: 240 },
            { key: 'type', label: '类型', type: 'select', options: TYPE_OPTIONS, width: 160 },
            { key: 'status', label: '状态', type: 'select', options: STATUS_OPTIONS, width: 160 },
          ]}
          values={{ keyword: query.keyword, type: query.type, status: query.status }}
          onChange={(values) => {
            setQuery((prev) => ({ ...prev, ...values, page: 1 }));
          }}
          onSearch={fetchContents}
          onReset={handleReset}
        />
        <ExportButton<Content>
          data={pageState.status === 'success' ? pageState.data : []}
          columns={CONTENT_EXPORT_COLUMNS}
          fileName="内容列表"
          onExportAll={async () => {
            const all = await contentService.getList({ page: 1, pageSize: 10000 });
            return all.data;
          }}
        />
      </Space>

      <Table<Content>
        columns={columns}
        dataSource={pageState.data}
        rowKey="id"
        scroll={{ x: 'max-content' }}
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

export default ContentList;