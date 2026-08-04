import { useEffect, useState, useCallback } from 'react';
import { Form, Input, Select, Button, Space, Spin, Alert, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { categoriesService } from '../../api';
import type { ProductFormData } from '../../types';

const { TextArea } = Input;

interface ProductCategory {
  id: string;
  name: string;
  slug: string;
}

interface ProductFormProps {
  initialValues?: Partial<ProductFormData>;
  onSubmit: (data: ProductFormData) => Promise<void>;
  submitLabel: string;
  title: string;
}

type FormState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; categories: ProductCategory[] };

export default function ProductForm({ initialValues, onSubmit, submitLabel, title }: ProductFormProps) {
  const navigate = useNavigate();
  const [form] = Form.useForm<ProductFormData>();
  const [formState, setFormState] = useState<FormState>({ status: 'loading' });
  const [submitting, setSubmitting] = useState(false);

  const loadCategories = useCallback(async () => {
    setFormState({ status: 'loading' });
    try {
      const categories = await categoriesService.getList();
      setFormState({ status: 'ready', categories });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '加载分类失败';
      setFormState({ status: 'error', message: errorMessage });
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues, form]);

  const handleSubmit = async (values: ProductFormData) => {
    setSubmitting(true);
    try {
      await onSubmit(values);
      message.success(submitLabel === 'Create Product' ? '产品创建成功' : '产品更新成功');
      navigate('/products');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '保存产品失败';
      message.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (formState.status === 'loading') {
    return (
      <div style={{ textAlign: 'center', padding: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (formState.status === 'error') {
    return (
      <Alert
        type="error"
        message="加载表单数据失败"
        description={formState.message}
        showIcon
        action={
          <Space>
            <Button onClick={loadCategories}>重试</Button>
            <Button onClick={() => navigate('/products')} icon={<ArrowLeftOutlined />}>
              返回列表
            </Button>
          </Space>
        }
      />
    );
  }

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/products')}>
          返回列表
        </Button>
      </Space>
      <h2>{title}</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ status: 'DRAFT' }}
        style={{ maxWidth: 600 }}
      >
        <Form.Item
          label="名称"
          name="name"
          rules={[{ required: true, message: '请输入产品名称' }]}
        >
          <Input placeholder="请输入产品名称" />
        </Form.Item>

        <Form.Item label="型号" name="model">
          <Input placeholder="请输入型号" />
        </Form.Item>

        <Form.Item
          label="分类"
          name="categoryId"
          rules={[{ required: true, message: '请选择分类' }]}
        >
          <Select
            placeholder="请选择分类"
            options={formState.categories.map((c) => ({
              value: c.id,
              label: c.name,
            }))}
          />
        </Form.Item>

        <Form.Item label="状态" name="status">
          <Select
            options={[
              { value: 'DRAFT', label: '草稿' },
              { value: 'ACTIVE', label: '激活' },
              { value: 'INACTIVE', label: '未激活' },
            ]}
          />
        </Form.Item>

        <Form.Item label="描述" name="description">
          <TextArea rows={4} placeholder="请输入产品描述" />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={submitting}>
              {submitLabel}
            </Button>
            <Button onClick={() => navigate('/products')}>取消</Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
}