import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, InputNumber, Select, Button, Typography, Card, message, Space } from 'antd';
import { knowledgeService, type KnowledgeDomain } from '../../api/knowledge.service';

const { Title } = Typography;

export default function KnowledgeCategoryCreate() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [domains, setDomains] = useState<KnowledgeDomain[]>([]);

  useEffect(() => {
    knowledgeService.getDomains().then(setDomains).catch(() => message.error('加载领域列表失败'));
  }, []);

  const onFinish = async (values: { domainId: string; name: string; slug: string; description?: string; sortOrder?: number }) => {
    setLoading(true);
    try {
      await knowledgeService.createCategory(values);
      message.success('知识分类已创建');
      navigate('/knowledge/categories');
    } catch (e: any) {
      message.error(e?.response?.data?.message || '创建知识分类失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600 }}>
      <Title level={4}>新建知识分类</Title>
      <Card>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item label="所属领域" name="domainId" rules={[{ required: true, message: '请选择所属领域' }]}>
            <Select placeholder="选择知识领域" options={domains.map((d) => ({ label: d.name, value: d.id }))} />
          </Form.Item>
          <Form.Item label="名称" name="name" rules={[{ required: true, message: '请输入分类名称' }]}>
            <Input placeholder="例如：超声检测" />
          </Form.Item>
          <Form.Item
            label="Slug"
            name="slug"
            rules={[
              { required: true, message: '请输入 Slug' },
              { pattern: /^[a-z0-9-]+$/, message: 'Slug 只能包含小写字母、数字和连字符' },
            ]}
          >
            <Input placeholder="例如：ultrasonic-testing" />
          </Form.Item>
          <Form.Item label="描述" name="description">
            <Input.TextArea rows={3} placeholder="分类描述（可选）" />
          </Form.Item>
          <Form.Item label="排序权重" name="sortOrder" initialValue={0}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>创建</Button>
              <Button onClick={() => navigate('/knowledge/categories')}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}