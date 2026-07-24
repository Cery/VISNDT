import { useState } from 'react';
import { Form, Input, Select, Button, Space, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import type { OrganizationFormData } from '../../types';

interface OrganizationFormProps {
  mode: 'create' | 'edit';
  initialValues?: Partial<OrganizationFormData>;
  onSubmit: (data: OrganizationFormData) => Promise<void>;
}

const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
  { value: 'SUSPENDED', label: 'Suspended' },
];

export default function OrganizationForm({
  mode,
  initialValues,
  onSubmit,
}: OrganizationFormProps) {
  const navigate = useNavigate();
  const [form] = Form.useForm<OrganizationFormData>();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values: OrganizationFormData) => {
    setSubmitting(true);
    try {
      await onSubmit(values);
      message.success(
        mode === 'create'
          ? 'Organization created successfully'
          : 'Organization updated successfully',
      );
      if (mode === 'create') {
        navigate('/organizations');
      } else {
        navigate(-1);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to save organization';
      message.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const title =
    mode === 'create' ? 'Create Organization' : 'Edit Organization';
  const submitLabel =
    mode === 'create' ? 'Create Organization' : 'Update Organization';

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
          Back
        </Button>
      </Space>
      <h2>{title}</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={initialValues}
        style={{ maxWidth: 600 }}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please enter organization name' }]}
        >
          <Input placeholder="Enter organization name" />
        </Form.Item>

        <Form.Item
          label="Type"
          name="type"
          rules={[{ required: true, message: 'Please enter organization type' }]}
        >
          <Input placeholder="Enter organization type (e.g. supplier, buyer)" />
        </Form.Item>

        {mode === 'edit' && (
          <Form.Item label="Status" name="status">
            <Select
              placeholder="Select status"
              allowClear
              options={STATUS_OPTIONS}
            />
          </Form.Item>
        )}

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={submitting}>
              {submitLabel}
            </Button>
            <Button onClick={() => navigate(-1)}>Cancel</Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
}