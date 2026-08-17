import { useEffect, useState } from 'react';
import { Form, Input, Select, Button, Space, Card, message, Typography, Upload, Image } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined, UploadOutlined, EyeOutlined } from '@ant-design/icons';
import type { ContentFormData } from '../../types';
import { fileAssetService } from '../../api/file-asset.service';
import MarkdownEditor from './MarkdownEditor';

const { TextArea } = Input;
const { Text } = Typography;

interface ContentFormProps {
  initialValues?: Partial<ContentFormData>;
  onSubmit: (data: ContentFormData) => Promise<{ id: string } | void>;
  submitLabel: string;
  title: string;
}

export default function ContentForm({
  initialValues,
  onSubmit,
  submitLabel,
  title,
}: ContentFormProps) {
  const navigate = useNavigate();
  const [form] = Form.useForm<ContentFormData>();
  const [submitting, setSubmitting] = useState(false);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
      if (initialValues.coverImageId) {
        fileAssetService
          .getSignedUrl(initialValues.coverImageId)
          .then(setCoverUrl)
          .catch(() => setCoverUrl(null));
      }
    }
  }, [initialValues, form]);

  const handleSubmit = async (values: ContentFormData) => {
    setSubmitting(true);
    try {
      await onSubmit(values);
      message.success(submitLabel === '创建内容' ? '内容已创建' : '内容已保存');
      navigate('/content');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '保存内容失败';
      message.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  /** Estimated read time from content body (live preview). */
  const contentBody: string = Form.useWatch('content', form) || '';
  const estimatedReadTime: number = contentBody
    ? Math.max(1, Math.ceil((contentBody.replace(/\s/g, '').length + contentBody.split(/\s+/).filter(Boolean).length) / 500))
    : 0;

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/content')}>
          返回列表
        </Button>
      </Space>
      <h2>{title}</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ type: 'KNOWLEDGE' }}
        style={{ maxWidth: 800 }}
      >
        <Card title="基本信息" style={{ marginBottom: 16 }}>
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: '请输入内容标题' }]}
          >
            <Input placeholder="请输入内容标题" />
          </Form.Item>

          <Form.Item
            label="Slug"
            name="slug"
            rules={[{ required: true, message: '请输入 slug（用于 URL 与 SEO）' }]}
          >
            <Input placeholder="例如：industrial-ultrasonic-testing-guide" />
          </Form.Item>

          <Form.Item
            label="类型"
            name="type"
            rules={[{ required: true, message: '请选择类型' }]}
          >
            <Select
              options={[
                { value: 'ARTICLE', label: '文章' },
                { value: 'KNOWLEDGE', label: '知识' },
                { value: 'SOLUTION', label: '解决方案' },
                { value: 'INSIGHT', label: '参数百科（Insight）' },
              ]}
            />
          </Form.Item>

          <Form.Item label="摘要" name="summary">
            <TextArea rows={2} placeholder="请输入摘要" />
          </Form.Item>

          <Form.Item label="封面图" name="coverImageId">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Upload
                accept="image/*"
                showUploadList={false}
                customRequest={async ({ file, onSuccess, onError }) => {
                  try {
                    const uploaded = await fileAssetService.upload(file as File);
                    form.setFieldValue('coverImageId', uploaded.id);
                    const url = await fileAssetService.getSignedUrl(uploaded.id);
                    setCoverUrl(url);
                    (onSuccess as (body: unknown) => void)?.(uploaded);
                  } catch (err) {
                    (onError as (err: Error) => void)?.(err instanceof Error ? err : new Error('上传失败'));
                  }
                }}
              >
                <Button icon={<UploadOutlined />}>上传封面图</Button>
              </Upload>
              {coverUrl && (
                <Image
                  src={coverUrl}
                  alt="封面图预览"
                  width={200}
                  style={{ objectFit: 'cover', borderRadius: 4 }}
                  preview={false}
                />
              )}
            </Space>
          </Form.Item>

          <Form.Item
            label="正文"
            name="content"
            rules={[{ required: true, message: '请输入内容正文' }]}
          >
            <MarkdownEditor rows={10} />
          </Form.Item>

          {estimatedReadTime > 0 && (
            <div style={{ marginBottom: 16 }}>
              <Space>
                <EyeOutlined />
                <Text type="secondary">
                  预计阅读时间：<Text strong>{estimatedReadTime}</Text> 分钟
                </Text>
              </Space>
            </div>
          )}
        </Card>

        <Card title="SEO" style={{ marginBottom: 16 }}>
          <Form.Item label="SEO 标题" name="seoTitle">
            <Input placeholder="SEO 标题" />
          </Form.Item>
          <Form.Item label="SEO 描述" name="seoDescription">
            <TextArea rows={2} placeholder="SEO 描述" />
          </Form.Item>
          <Form.Item label="SEO 关键词" name="seoKeywords">
            <Input placeholder="SEO 关键词（逗号分隔）" />
          </Form.Item>
        </Card>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={submitting}>
              {submitLabel}
            </Button>
            <Button onClick={() => navigate('/content')}>取消</Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
}