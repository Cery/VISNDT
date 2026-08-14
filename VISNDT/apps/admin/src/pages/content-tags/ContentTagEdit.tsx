import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Select, Button, Typography, Card, Spin, message } from 'antd';
import { contentTagService } from '../../api/content-tag.service';
import type { ContentTag, ContentTagType } from '../../types';

const { Title } = Typography;

const TAG_TYPE_OPTIONS: { value: ContentTagType; label: string }[] = [
  { value: 'TOPIC', label: '主题' },
  { value: 'INDUSTRY', label: '行业' },
  { value: 'APPLICATION', label: '应用' },
  { value: 'TECHNOLOGY', label: '技术' },
];

interface FormValues {
  name: string;
  slug: string;
  type: ContentTagType;
  description?: string;
}

export default function ContentTagEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm<FormValues>();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!id) return;
    contentTagService.getList()
      .then((tags) => {
        const tag = tags.find((t: ContentTag) => t.id === id);
        if (tag) {
          form.setFieldsValue({
            name: tag.name,
            slug: tag.slug,
            type: tag.type,
            description: tag.description ?? undefined,
          });
        }
      })
      .catch(() => message.error('加载标签信息失败'))
      .finally(() => setFetching(false));
  }, [id, form]);

  const handleSubmit = async (values: FormValues) => {
    if (!id) return;
    setLoading(true);
    try {
      await contentTagService.update(id, values);
      message.success('标签更新成功');
      navigate('/content/tags');
    } catch {
      message.error('更新标签失败');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <Spin size="large" style={{ display: 'block', margin: '80px auto' }} />;
  }

  return (
    <div style={{ maxWidth: 600 }}>
      <Title level={4}>编辑标签</Title>
      <Card>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="标签名称"
            rules={[{ required: true, message: '请输入标签名称' }]}
          >
            <Input placeholder="例如：超声检测" />
          </Form.Item>

          <Form.Item
            name="slug"
            label="Slug"
            rules={[
              { required: true, message: '请输入 Slug' },
              { pattern: /^[a-z0-9-]+$/, message: 'Slug 只能包含小写字母、数字和连字符' },
            ]}
          >
            <Input placeholder="例如：ultrasonic-testing" />
          </Form.Item>

          <Form.Item
            name="type"
            label="标签分类"
            rules={[{ required: true, message: '请选择标签分类' }]}
          >
            <Select options={TAG_TYPE_OPTIONS} placeholder="选择分类" />
          </Form.Item>

          <Form.Item name="description" label="描述（可选）">
            <Input.TextArea placeholder="标签描述，用于 SEO 标签页面" rows={3} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              保存
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={() => navigate('/content/tags')}>
              取消
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}