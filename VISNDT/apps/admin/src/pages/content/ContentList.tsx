import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Space, Spin, Alert, Button, Tag, Tabs, Typography, Card, Row, Col, Statistic, Tooltip } from 'antd';
import { FileTextOutlined, CheckCircleOutlined, EditOutlined, ClockCircleOutlined, StopOutlined, EyeOutlined } from '@ant-design/icons';
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
  sort: 'createdAt' | 'updatedAt' | 'publishedAt' | 'title';
  order: 'asc' | 'desc';
  page: number;
  pageSize: number;
}

interface GovernanceStats {
  total: number;
  published: number;
  draft: number;
  review: number;
  archived: number;
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

/** SEO 完整度等级（非阻断提示）。 */
type SeoLevel = 'complete' | 'partial' | 'missing';
function getSeoLevel(content: Content): SeoLevel {
  const hasTitle = !!content.seoTitle;
  const hasDesc = !!content.seoDescription;
  const hasKeywords = !!content.seoKeywords;
  if (hasTitle && hasDesc && hasKeywords) return 'complete';
  if (hasTitle || hasDesc || hasKeywords) return 'partial';
  return 'missing';
}
const SEO_LEVEL_CONFIG: Record<SeoLevel, { color: string; label: string }> = {
  complete: { color: 'green', label: '完整' },
  partial: { color: 'orange', label: '部分' },
  missing: { color: 'default', label: '未设置' },
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
  const [governanceStats, setGovernanceStats] = useState<GovernanceStats>({ total: 0, published: 0, draft: 0, review: 0, archived: 0 });
  const [query, setQuery] = useState<QueryParams>({
    keyword: '',
    type: '',
    status: '',
    sort: 'createdAt',
    order: 'desc',
    page: 1,
    pageSize: 20,
  });

  const fetchContents = useCallback(async () => {
    setPageState({ status: 'loading' });
    try {
      const result = await contentService.getList({
        page: query.page,
        pageSize: query.pageSize,
        sort: query.sort,
        order: query.order,
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

  // Load governance statistics on mount
  useEffect(() => {
    const loadGovernanceData = async () => {
      try {
        const allContent = await contentService.getList({ page: 1, pageSize: 1 });
        const total = allContent.total;
        const [publishedRes, draftRes, reviewRes, archivedRes] = await Promise.all([
          contentService.getList({ page: 1, pageSize: 1, status: 'PUBLISHED' }),
          contentService.getList({ page: 1, pageSize: 1, status: 'DRAFT' }),
          contentService.getList({ page: 1, pageSize: 1, status: 'REVIEW' }),
          contentService.getList({ page: 1, pageSize: 1, status: 'ARCHIVED' }),
        ]);
        setGovernanceStats({
          total,
          published: publishedRes.total,
          draft: draftRes.total,
          review: reviewRes.total,
          archived: archivedRes.total,
        });
      } catch {
        // Stats load failure is non-critical
      }
    };
    loadGovernanceData();
  }, []);

  const handleReset = useCallback(() => {
    setQuery({ keyword: '', type: '', status: '', sort: 'createdAt', order: 'desc', page: 1, pageSize: 20 });
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
      title: 'SEO',
      key: 'seo',
      width: 100,
      render: (_: unknown, record: Content) => {
        const level = getSeoLevel(record);
        const cfg = SEO_LEVEL_CONFIG[level];
        return <Tag color={cfg.color}>{cfg.label}</Tag>;
      },
    },
    {
      title: '标签',
      key: 'tags',
      width: 200,
      render: (_: unknown, record: Content) => {
        const tags = record.tags;
        if (!tags || tags.length === 0) return <Typography.Text type="secondary">-</Typography.Text>;
        return (
          <Space size={[0, 4]} wrap>
            {tags.slice(0, 3).map((t) => (
              <Tag key={t.tag.id} color="geekblue" style={{ margin: 0 }}>
                {t.tag.name}
              </Tag>
            ))}
            {tags.length > 3 && (
              <Tooltip title={tags.slice(3).map((t) => t.tag.name).join(', ')}>
                <Tag style={{ margin: 0 }}>+{tags.length - 3}</Tag>
              </Tooltip>
            )}
          </Space>
        );
      },
    },
    {
      title: '阅读',
      key: 'estimatedReadTime',
      width: 80,
      align: 'center',
      render: (_: unknown, record: Content) => {
        if (!record.estimatedReadTime) return <Typography.Text type="secondary">-</Typography.Text>;
        return (
          <Tooltip title={`预计阅读时间 ${record.estimatedReadTime} 分钟`}>
            <EyeOutlined style={{ marginRight: 4 }} />
            {record.estimatedReadTime} 分钟
          </Tooltip>
        );
      },
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
      title: '发布时间',
      dataIndex: 'publishedAt',
      key: 'publishedAt',
      width: 160,
      render: (date: string | null) =>
        date ? new Date(date).toLocaleString() : <Typography.Text type="secondary">未发布</Typography.Text>,
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <div style={{ width: 4, height: 20, borderRadius: 2, background: '#52c41a' }} />
        <Title level={4} style={{ margin: 0 }}>
          内容管理
        </Title>
      </div>
      <Typography.Text type="secondary" style={{ display: 'block', marginBottom: 16, marginLeft: 12, fontSize: 13 }}>
        管理知识、文章与解决方案内容
      </Typography.Text>

      {/* Governance Statistics Dashboard */}
      {(governanceStats.total > 0) && (
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col xs={12} sm={6} md={4}>
            <Card size="small">
              <Statistic title="内容总数" value={governanceStats.total} prefix={<FileTextOutlined />} />
            </Card>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Card size="small">
              <Statistic title="已发布" value={governanceStats.published} valueStyle={{ color: '#52c41a' }} prefix={<CheckCircleOutlined />} />
            </Card>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Card size="small">
              <Statistic title="草稿" value={governanceStats.draft} valueStyle={{ color: '#faad14' }} prefix={<EditOutlined />} />
            </Card>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Card size="small">
              <Statistic title="审核中" value={governanceStats.review} valueStyle={{ color: '#fa8c16' }} prefix={<ClockCircleOutlined />} />
            </Card>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Card size="small">
              <Statistic title="已归档" value={governanceStats.archived} valueStyle={{ color: '#ff4d4f' }} prefix={<StopOutlined />} />
            </Card>
          </Col>
        </Row>
      )}

      <Space style={{ marginBottom: 16 }} wrap>
        <Button type="primary" onClick={() => navigate('/content/create')}>
          创建内容
        </Button>

        {/* Content Type Tabs */}
        <Tabs
          activeKey={query.type || 'ALL'}
          onChange={(key) => {
            setQuery((prev) => ({ ...prev, type: key === 'ALL' ? '' : (key as ContentType), page: 1 }));
          }}
          items={[
            { key: 'ALL', label: '全部' },
            { key: 'ARTICLE', label: '文章' },
            { key: 'KNOWLEDGE', label: '知识' },
            { key: 'SOLUTION', label: '解决方案' },
            { key: 'INSIGHT', label: '参数百科' },
          ]}
          style={{ marginBottom: 0 }}
        />
      </Space>

      <Space style={{ marginBottom: 16 }} wrap>
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