import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, InputNumber, Select, Button, Typography, Card, message, Space, Spin } from 'antd';
import { knowledgeService, type KnowledgeDomain } from '../../api/knowledge.service';

const { Title } = Typography;

export default function KnowledgeDomainEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [domains, setDomains] = useState<KnowledgeDomain[]>([]);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      knowledgeService.getDomain(id),
      knowledgeService.getDomains(),
    ])
      .then(([domain, allDomains]) => {
        setDomains(allDomains.filter((d) => d.id !== id));
        form.setFieldsValue({
          name: domain.name,
          slug: domain.slug,
          description: domain.description || '',
          parentId: domain.parentId || undefined,
          sortOrder: domain.sortOrder,
        });
      })
      .catch(() => message.error('加载领域信息失败'))
      .finally(() => setFetching(false));
  }, [id, form]);

  const onFinish = async (values: { name: string; slug: string; description?: string; parentId?: string | null; sortOrder?: number }) => {
    if (!id) return;
    setLoading(true);
    try {
      await knowledgeService.updateDomain(id, values);
      message.success('知识领域已更新');
      navigate('/knowledge/domains');
    } catch (e: any) {
      message.error(e?.response?.data?.message || '更新知识领域失败');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <Spin style={{ display: 'block', margin: '40px auto' }} />;

  return (
    <div style={{ maxWidth: 600 }}>
      <Title level={4}>编辑知识领域</Title>
      <Card>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item label="名称" name="name" rules={[{ required: true, message: '请输入领域名称' }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="Slug"
            name="slug"
            rules={[
              { required: true, message: '请输入 Slug' },
              { pattern: /^[a-z0-9-]+$/, message: 'Slug 只能包含小写字母、数字和连字符' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="描述" name="description">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item label="父领域" name="parentId">
            <Select allowClear placeholder="选择父领域（可选）" options={domains.map((d) => ({ label: d.name, value: d.id }))} />
          </Form.Item>
          <Form.Item label="排序权重" name="sortOrder">
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>保存</Button>
              <Button onClick={() => navigate('/knowledge/domains')}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}