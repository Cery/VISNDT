import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Tag, Space, Typography, Popconfirm, message, Select, Input } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { knowledgeService, knowledgeLabels, type KnowledgeEntry, type KnowledgeDomain, type KnowledgeCategory } from '../../api/knowledge.service';

const { Title } = Typography;

const STATUS_COLORS: Record<string, string> = {
  DRAFT: 'default',
  REVIEW: 'processing',
  PUBLISHED: 'success',
  ARCHIVED: 'warning',
};

type PageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; entries: KnowledgeEntry[]; domains: KnowledgeDomain[]; categories: KnowledgeCategory[] };

export default function KnowledgeEntryList() {
  const navigate = useNavigate();
  const [state, setState] = useState<PageState>({ status: 'loading' });
  const [filterDomainId, setFilterDomainId] = useState<string | undefined>();
  const [filterCategoryId, setFilterCategoryId] = useState<string | undefined>();
  const [filterStatus, setFilterStatus] = useState<string | undefined>();
  const [searchText, setSearchText] = useState('');

  const fetchData = async () => {
    setState({ status: 'loading' });
    try {
      const [entries, domains, categories] = await Promise.all([
        knowledgeService.getEntries({ domainId: filterDomainId, categoryId: filterCategoryId, status: filterStatus, search: searchText || undefined }),
        knowledgeService.getDomains(),
        knowledgeService.getCategories(filterDomainId),
      ]);
      setState({ status: 'success', entries, domains, categories });
    } catch {
      setState({ status: 'error', message: '加载知识条目列表失败' });
    }
  };

  useEffect(() => {
    fetchData();
  }, [filterDomainId, filterCategoryId, filterStatus]);

  const handleDelete = async (id: string) => {
    try {
      await knowledgeService.deleteEntry(id);
      message.success('知识条目已删除');
      fetchData();
    } catch {
      message.error('删除知识条目失败');
    }
  };

  const columns: ColumnsType<KnowledgeEntry> = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: 280,
      ellipsis: true,
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
      width: 180,
      render: (slug: string) => <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">{slug}</code>,
    },
    {
      title: '领域',
      key: 'domain',
      width: 120,
      render: (_, record) => record.domain?.name ?? '-',
    },
    {
      title: '分类',
      key: 'category',
      width: 120,
      render: (_, record) => record.category?.name ?? '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={STATUS_COLORS[status] ?? 'default'}>
          {knowledgeLabels.status[status as keyof typeof knowledgeLabels.status] ?? '未知状态'}
        </Tag>
      ),
    },
    {
      title: '引用',
      key: 'refs',
      width: 80,
      render: (_, record) => record._count?.contentRefs ?? 0,
    },
    {
      title: '更新',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 160,
      render: (v: string) => new Date(v).toLocaleString('zh-CN'),
    },
    {
      title: '操作',
      key: 'actions',
      width: 200,
      fixed: 'right' as const,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => navigate(`/knowledge/entries/${record.id}/edit`)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除此知识条目？"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (state.status === 'loading') return <div className="p-6">加载中...</div>;
  if (state.status === 'error') return <div className="p-6 text-red-500">{state.message}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <Title level={4} className="!mb-0">知识条目管理</Title>
          <Typography.Text type="secondary" style={{ fontSize: 13 }}>
            知识条目是知识体系的最小单元，每条知识归属于一个领域和一个分类，可被内容引用，用于前台知识库展示和智能匹配
          </Typography.Text>
        </div>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={fetchData}>刷新</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/knowledge/entries/create')}>
            新建条目
          </Button>
        </Space>
      </div>

      <div className="mb-4 flex gap-2 flex-wrap">
        <Select
          allowClear
          placeholder="按领域筛选"
          style={{ width: 180 }}
          value={filterDomainId}
          onChange={(v) => { setFilterDomainId(v); setFilterCategoryId(undefined); }}
          options={state.domains.map((d) => ({ label: d.name, value: d.id }))}
        />
        <Select
          allowClear
          placeholder="按分类筛选"
          style={{ width: 180 }}
          value={filterCategoryId}
          onChange={setFilterCategoryId}
          options={state.categories.map((c) => ({ label: c.name, value: c.id }))}
        />
        <Select
          allowClear
          placeholder="按状态筛选"
          style={{ width: 140 }}
          value={filterStatus}
          onChange={setFilterStatus}
          options={Object.entries(knowledgeLabels.status).map(([k, v]) => ({ label: v, value: k }))}
        />
        <Input.Search
          allowClear
          placeholder="搜索标题/摘要"
          style={{ width: 240 }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onSearch={() => fetchData()}
        />
      </div>

      <Table
        columns={columns}
        dataSource={state.entries}
        rowKey="id"
        scroll={{ x: 1200 }}
        pagination={{ pageSize: 20, showSizeChanger: true }}
      />
    </div>
  );
}