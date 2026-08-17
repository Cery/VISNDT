import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Select, Button, Space, Typography, Card, message, Spin } from 'antd';
import { knowledgeService, type KnowledgeDomain, type KnowledgeCategory } from '../../api/knowledge.service';

const { Title } = Typography;
const { TextArea } = Input;

type PageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; domains: KnowledgeDomain[]; categories: KnowledgeCategory[] };

export default function KnowledgeEntryCreate() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [state, setState] = useState<PageState>({ status: 'loading' });
  const [submitting, setSubmitting] = useState(false);
  const [selectedDomainId, setSelectedDomainId] = useState<string | undefined>();

  useEffect(() => {
    const loadData = async () => {
      try {
        const domains = await knowledgeService.getDomains();
        setState({ status: 'ready', domains, categories: [] });
      } catch {
        setState({ status: 'error', message: '加载数据失败' });
      }
    };
    loadData();
  }, []);

  const handleDomainChange = async (domainId: string) => {
    setSelectedDomainId(domainId);
    form.setFieldValue('categoryId', undefined);
    if (state.status === 'ready') {
      try {
        const categories = await knowledgeService.getCategories(domainId);
        setState({ ...state, categories });
      } catch {
        // ignore
      }
    }
  };

  const handleSubmit = async (values: any) => {
    setSubmitting(true);
    try {
      await knowledgeService.createEntry({
        domainId: values.domainId,
        categoryId: values.categoryId,
        title: values.title,
        slug: values.slug,
        summary: values.summary,
        structuredBody: values.structuredBody ? JSON.parse(values.structuredBody) : {},
        authorId: values.authorId,
        seoTitle: values.seoTitle,
        seoDescription: values.seoDescription,
        seoKeywords: values.seoKeywords,
      });
      message.success('知识条目已创建');
      navigate('/knowledge/entries');
    } catch (err: any) {
      message.error(err?.response?.data?.message || '创建失败');
    } finally {
      setSubmitting(false);
    }
  };

  if (state.status === 'loading') return <div className="p-6 flex justify-center"><Spin size="large" /></div>;
  if (state.status === 'error') return <div className="p-6 text-red-500">{state.message}</div>;

  return (
    <div className="p-6 max-w-3xl">
      <Title level={4}>新建知识条目</Title>
      <Card>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="知识领域" name="domainId" rules={[{ required: true, message: '请选择知识领域' }]}>
            <Select
              placeholder="选择知识领域"
              onChange={handleDomainChange}
              options={state.domains.map((d) => ({ label: d.name, value: d.id }))}
            />
          </Form.Item>

          <Form.Item label="知识分类" name="categoryId" rules={[{ required: true, message: '请选择知识分类' }]}>
            <Select
              placeholder="选择知识分类"
              disabled={!selectedDomainId}
              options={state.categories.map((c) => ({ label: c.name, value: c.id }))}
            />
          </Form.Item>

          <Form.Item label="标题" name="title" rules={[{ required: true, message: '请输入标题' }]}>
            <Input placeholder="知识条目标题" />
          </Form.Item>

          <Form.Item label="Slug" name="slug" rules={[{ required: true, message: '请输入 Slug' }]}>
            <Input placeholder="unique-slug-identifier" />
          </Form.Item>

          <Form.Item label="摘要" name="summary">
            <TextArea rows={2} placeholder="简要描述" />
          </Form.Item>

          <Form.Item label="结构化内容 (JSON)" name="structuredBody">
            <TextArea rows={6} placeholder='{"sections": [{"title": "...", "content": "..."}]}' />
          </Form.Item>

          <Form.Item label="作者 ID" name="authorId" rules={[{ required: true, message: '请输入作者 ID' }]}>
            <Input placeholder="User UUID" />
          </Form.Item>

          <Form.Item label="SEO 标题" name="seoTitle">
            <Input placeholder="SEO Title" />
          </Form.Item>

          <Form.Item label="SEO 描述" name="seoDescription">
            <TextArea rows={2} placeholder="SEO Description" />
          </Form.Item>

          <Form.Item label="SEO 关键词" name="seoKeywords">
            <Input placeholder="keyword1, keyword2, keyword3" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={submitting}>创建</Button>
              <Button onClick={() => navigate('/knowledge/entries')}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}