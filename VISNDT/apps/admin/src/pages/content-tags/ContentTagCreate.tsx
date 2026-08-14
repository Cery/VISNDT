import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Select, Button, Typography, Card, message } from 'antd';
import { contentTagService } from '../../api/content-tag.service';
import type { ContentTagType } from '../../types';

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

export default function ContentTagCreate() {
  const navigate = useNavigate();
  const [form] = Form.useForm<FormValues>();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      await contentTagService.create(values);
      message.success('标签创建成功');
      navigate('/content/tags');
    } catch {
      message.error('创建标签失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600 }}>
      <Title level={4}>新建标签</Title>
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
              创建
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