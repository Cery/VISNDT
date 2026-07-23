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
      const errorMessage = err instanceof Error ? err.message : 'Failed to load categories';
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
      message.success(submitLabel === 'Create Product' ? 'Product created successfully' : 'Product updated successfully');
      navigate('/products');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save product';
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
        message="Failed to Load Form Data"
        description={formState.message}
        showIcon
        action={
          <Space>
            <Button onClick={loadCategories}>Retry</Button>
            <Button onClick={() => navigate('/products')} icon={<ArrowLeftOutlined />}>
              Back to List
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
          Back to List
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
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please enter product name' }]}
        >
          <Input placeholder="Enter product name" />
        </Form.Item>

        <Form.Item label="Model" name="model">
          <Input placeholder="Enter model number" />
        </Form.Item>

        <Form.Item
          label="Category"
          name="categoryId"
          rules={[{ required: true, message: 'Please select a category' }]}
        >
          <Select
            placeholder="Select a category"
            options={formState.categories.map((c) => ({
              value: c.id,
              label: c.name,
            }))}
          />
        </Form.Item>

        <Form.Item label="Status" name="status">
          <Select
            options={[
              { value: 'DRAFT', label: 'Draft' },
              { value: 'ACTIVE', label: 'Active' },
              { value: 'INACTIVE', label: 'Inactive' },
            ]}
          />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <TextArea rows={4} placeholder="Enter product description" />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={submitting}>
              {submitLabel}
            </Button>
            <Button onClick={() => navigate('/products')}>Cancel</Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
}