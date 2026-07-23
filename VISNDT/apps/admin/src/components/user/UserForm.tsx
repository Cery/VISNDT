import { useState } from 'react';
import { Form, Input, Select, Button, Space, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import type { UserFormData } from '../../types';

interface UserFormProps {
  mode: 'create' | 'edit';
  initialValues?: Partial<UserFormData>;
  onSubmit: (data: UserFormData) => Promise<void>;
}

const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
  { value: 'SUSPENDED', label: 'Suspended' },
];

export default function UserForm({ mode, initialValues, onSubmit }: UserFormProps) {
  const navigate = useNavigate();
  const [form] = Form.useForm<UserFormData>();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values: UserFormData) => {
    setSubmitting(true);
    try {
      await onSubmit(values);
      message.success(
        mode === 'create' ? 'User created successfully' : 'User updated successfully',
      );
      if (mode === 'create') {
        navigate('/users');
      } else {
        navigate(-1);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save user';
      message.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const title = mode === 'create' ? 'Create User' : 'Edit User';
  const submitLabel = mode === 'create' ? 'Create User' : 'Update User';

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
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Please enter email' },
            { type: 'email', message: 'Please enter a valid email' },
          ]}
        >
          <Input placeholder="Enter email address" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="passwordHash"
          rules={[
            ...(mode === 'create'
              ? [{ required: true, message: 'Please enter password' }]
              : []),
            { min: 6, message: 'Password must be at least 6 characters' },
          ]}
        >
          <Input.Password placeholder={mode === 'create' ? 'Enter password' : 'Leave blank to keep current'} />
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

        <Form.Item label="Organization ID" name="organizationId">
          <Input placeholder="Enter organization ID (optional)" />
        </Form.Item>

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