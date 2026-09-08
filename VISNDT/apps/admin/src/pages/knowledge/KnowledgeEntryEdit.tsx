import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Select, Button, Typography, Card, Tabs, Table, Tag, Space, Popconfirm, message, Spin, Modal } from 'antd';
import { PlusOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import {
  knowledgeService,
  knowledgeLabels,
  type KnowledgeEntry,
  type KnowledgeDomain,
  type KnowledgeCategory,
  type KnowledgeContentRef,
  type KnowledgeEntryStatus,
} from '../../api/knowledge.service';

const { Title } = Typography;
const { TextArea } = Input;

const STATUS_COLORS: Record<string, string> = {
  DRAFT: 'default',
  REVIEW: 'processing',
  PUBLISHED: 'success',
  ARCHIVED: 'warning',
};

type PageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; entry: KnowledgeEntry; domains: KnowledgeDomain[]; categories: KnowledgeCategory[] };

export default function KnowledgeEntryEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [state, setState] = useState<PageState>({ status: 'loading' });
  const [submitting, setSubmitting] = useState(false);
  const [selectedDomainId, setSelectedDomainId] = useState<string | undefined>();
  const [addRefModal, setAddRefModal] = useState(false);
  const [addRefForm] = Form.useForm();
  const [addRelationModal, setAddRelationModal] = useState(false);
  const [addRelationForm] = Form.useForm();

  const loadData = useCallback(async () => {
    if (!id) return;
    setState({ status: 'loading' });
    try {
      const [entry, domains] = await Promise.all([
        knowledgeService.getEntry(id),
        knowledgeService.getDomains(),
      ]);
      const categories = await knowledgeService.getCategories(entry.domainId);
      setState({ status: 'ready', entry, domains, categories });
      setSelectedDomainId(entry.domainId);
      form.setFieldsValue({
        domainId: entry.domainId,
        categoryId: entry.categoryId,
        title: entry.title,
        slug: entry.slug,
        summary: entry.summary,
        structuredBody: JSON.stringify(entry.structuredBody, null, 2),
        status: entry.status,
        authorId: entry.authorId,
        seoTitle: entry.seoTitle,
        seoDescription: entry.seoDescription,
        seoKeywords: entry.seoKeywords,
      });
    } catch {
      setState({ status: 'error', message: '加载知识条目失败' });
    }
  }, [id, form]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDomainChange = async (domainId: string) => {
    setSelectedDomainId(domainId);
    form.setFieldValue('categoryId', undefined);
    try {
      const categories = await knowledgeService.getCategories(domainId);
      if (state.status === 'ready') {
        setState({ ...state, categories });
      }
    } catch { /* ignore */ }
  };

  const handleSubmit = async (values: any) => {
    setSubmitting(true);
    try {
      const updateData: any = {
        domainId: values.domainId,
        categoryId: values.categoryId,
        title: values.title,
        slug: values.slug,
        summary: values.summary,
        structuredBody: values.structuredBody ? JSON.parse(values.structuredBody) : undefined,
        status: values.status,
        seoTitle: values.seoTitle,
        seoDescription: values.seoDescription,
        seoKeywords: values.seoKeywords,
      };
      await knowledgeService.updateEntry(id!, updateData);
      message.success('知识条目已更新');
      loadData();
    } catch (err: any) {
      message.error(err?.response?.data?.message || '更新失败');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddContentRef = async (values: any) => {
    try {
      await knowledgeService.createContentRef({
        knowledgeId: id!,
        contentId: values.contentId,
        referenceType: values.referenceType,
        sortOrder: values.sortOrder,
      });
      message.success('内容引用已添加');
      setAddRefModal(false);
      addRefForm.resetFields();
      loadData();
    } catch (err: any) {
      message.error(err?.response?.data?.message || '添加失败');
    }
  };

  const handleDeleteContentRef = async (refId: string) => {
    try {
      await knowledgeService.deleteContentRef(refId);
      message.success('内容引用已删除');
      loadData();
    } catch {
      message.error('删除失败');
    }
  };

  const handleAddRelation = async (values: any) => {
    try {
      await knowledgeService.createRelation({
        sourceId: id!,
        targetId: values.targetId,
        relationType: values.relationType,
        description: values.description,
      });
      message.success('知识关联已添加');
      setAddRelationModal(false);
      addRelationForm.resetFields();
      loadData();
    } catch (err: any) {
      message.error(err?.response?.data?.message || '添加失败');
    }
  };

  const handleDeleteRelation = async (relId: string) => {
    try {
      await knowledgeService.deleteRelation(relId);
      message.success('知识关联已删除');
      loadData();
    } catch {
      message.error('删除失败');
    }
  };

  if (state.status === 'loading') return <div className="p-6 flex justify-center"><Spin size="large" /></div>;
  if (state.status === 'error') return <div className="p-6 text-red-500">{state.message}</div>;

  const { entry, domains, categories } = state;

  const refColumns: ColumnsType<KnowledgeContentRef> = [
    { title: '内容', dataIndex: ['content', 'title'], key: 'content', ellipsis: true },
    { title: '类型', key: 'type', width: 100, render: (_, r) => (
      <Tag>{knowledgeLabels.referenceType[r.referenceType] ?? '未知类型'}</Tag>
    )},
    { title: '排序', dataIndex: 'sortOrder', key: 'sortOrder', width: 80 },
    { title: '操作', key: 'actions', width: 80, render: (_, r) => (
      <Popconfirm title="确定删除此引用？" onConfirm={() => handleDeleteContentRef(r.id)}>
        <Button type="link" size="small" danger icon={<DeleteOutlined />} />
      </Popconfirm>
    )},
  ];

  const allRelations = [
    ...(entry.sourceRelations ?? []).map((r) => ({ ...r, direction: 'out' as const })),
    ...(entry.targetRelations ?? []).map((r) => ({ ...r, direction: 'in' as const })),
  ];

  const relColumns: ColumnsType<any> = [
    { title: '方向', key: 'direction', width: 60, render: (_, r: any) => r.direction === 'out' ? '→' : '←' },
    { title: '关联条目', key: 'entry', ellipsis: true, render: (_, r: any) => {
      const entry = r.direction === 'out' ? r.target : r.source;
      return entry?.title ?? '-';
    }},
    { title: '类型', key: 'type', width: 100, render: (_, r: any) => {
      const type = r.relationType as string;
      return <Tag>{(knowledgeLabels.relationType as Record<string, string>)[type] ?? '未知类型'}</Tag>;
    }},
    { title: '描述', dataIndex: 'description', key: 'description', width: 120, ellipsis: true },
    { title: '操作', key: 'actions', width: 80, render: (_, r: any) => (
      <Popconfirm title="确定删除此关联？" onConfirm={() => handleDeleteRelation(r.id)}>
        <Button type="link" size="small" danger icon={<DeleteOutlined />} />
      </Popconfirm>
    )},
  ];

  const tabItems = [
    {
      key: 'basic',
      label: '基本信息',
      children: (
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="知识领域" name="domainId" rules={[{ required: true }]}>
            <Select onChange={handleDomainChange} options={domains.map((d) => ({ label: d.name, value: d.id }))} />
          </Form.Item>
          <Form.Item label="知识分类" name="categoryId" rules={[{ required: true }]}>
            <Select disabled={!selectedDomainId} options={categories.map((c) => ({ label: c.name, value: c.id }))} />
          </Form.Item>
          <Form.Item label="标题" name="title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Slug" name="slug" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="摘要" name="summary">
            <TextArea rows={2} />
          </Form.Item>
          <Form.Item label="状态" name="status">
            <Select options={Object.entries(knowledgeLabels.status).map(([k, v]) => ({ label: v, value: k }))} />
          </Form.Item>
          <Form.Item label="结构化内容 (JSON)" name="structuredBody">
            <TextArea rows={6} />
          </Form.Item>
          <Form.Item label="SEO 标题" name="seoTitle"><Input /></Form.Item>
          <Form.Item label="SEO 描述" name="seoDescription"><TextArea rows={2} /></Form.Item>
          <Form.Item label="SEO 关键词" name="seoKeywords"><Input /></Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={submitting}>保存</Button>
              <Button onClick={() => navigate('/knowledge/entries')}>返回列表</Button>
            </Space>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: 'refs',
      label: `内容引用 (${(entry.contentRefs ?? []).length})`,
      children: (
        <div>
          <div className="mb-3">
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddRefModal(true)}>添加引用</Button>
          </div>
          <Table columns={refColumns} dataSource={entry.contentRefs ?? []} rowKey="id" pagination={false} size="small" />
        </div>
      ),
    },
    {
      key: 'relations',
      label: `知识关联 (${allRelations.length})`,
      children: (
        <div>
          <div className="mb-3">
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddRelationModal(true)}>添加关联</Button>
          </div>
          <Table columns={relColumns} dataSource={allRelations} rowKey="id" pagination={false} size="small" />
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex justify-between items-center mb-4">
        <Title level={4} className="!mb-0">
          编辑知识条目
          <Tag color={STATUS_COLORS[entry.status] ?? 'default'} className="ml-2">
            {knowledgeLabels.status[entry.status as KnowledgeEntryStatus] ?? '未知状态'}
          </Tag>
        </Title>
        <Button icon={<ReloadOutlined />} onClick={loadData}>刷新</Button>
      </div>

      <Card>
        <Tabs items={tabItems} />
      </Card>

      <Modal
        title="添加内容引用"
        open={addRefModal}
        onCancel={() => setAddRefModal(false)}
        onOk={() => addRefForm.submit()}
      >
        <Form form={addRefForm} layout="vertical" onFinish={handleAddContentRef}>
          <Form.Item label="内容 ID" name="contentId" rules={[{ required: true, message: '请输入 Content UUID' }]}>
            <Input placeholder="Content UUID" />
          </Form.Item>
          <Form.Item label="引用类型" name="referenceType" initialValue="SOURCE">
            <Select options={Object.entries(knowledgeLabels.referenceType).map(([k, v]) => ({ label: v, value: k }))} />
          </Form.Item>
          <Form.Item label="排序" name="sortOrder" initialValue={0}>
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="添加知识关联"
        open={addRelationModal}
        onCancel={() => setAddRelationModal(false)}
        onOk={() => addRelationForm.submit()}
      >
        <Form form={addRelationForm} layout="vertical" onFinish={handleAddRelation}>
          <Form.Item label="目标条目 ID" name="targetId" rules={[{ required: true, message: '请输入 KnowledgeEntry UUID' }]}>
            <Input placeholder="KnowledgeEntry UUID" />
          </Form.Item>
          <Form.Item label="关联类型" name="relationType" rules={[{ required: true, message: '请选择关联类型' }]}>
            <Select options={Object.entries(knowledgeLabels.relationType).map(([k, v]) => ({ label: v, value: k }))} />
          </Form.Item>
          <Form.Item label="描述" name="description">
            <TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}