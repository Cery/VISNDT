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
  { value: 'ACTIVE', label: '激活' },
  { value: 'INACTIVE', label: '未激活' },
  { value: 'SUSPENDED', label: '已停用' },
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
        mode === 'create' ? '用户创建成功' : '用户更新成功',
      );
      if (mode === 'create') {
        navigate('/users');
      } else {
        navigate(-1);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '保存用户失败';
      message.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const title = mode === 'create' ? '创建用户' : '编辑用户';
  const submitLabel = mode === 'create' ? '创建用户' : '更新用户';

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
          返回
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
          label="邮箱"
          name="email"
          rules={[
            { required: true, message: '请输入邮箱' },
            { type: 'email', message: '请输入有效的邮箱地址' },
          ]}
        >
          <Input placeholder="请输入邮箱地址" />
        </Form.Item>

        <Form.Item
          label="密码"
          name="passwordHash"
          rules={[
            ...(mode === 'create'
              ? [{ required: true, message: '请输入密码' }]
              : []),
            { min: 6, message: '密码至少需要6个字符' },
          ]}
        >
          <Input.Password placeholder={mode === 'create' ? '请输入密码' : '留空以保持当前密码'} />
        </Form.Item>

        {mode === 'edit' && (
          <Form.Item label="状态" name="status">
            <Select
              placeholder="请选择状态"
              allowClear
              options={STATUS_OPTIONS}
            />
          </Form.Item>
        )}

        <Form.Item label="组织ID" name="organizationId">
          <Input placeholder="请输入组织ID（可选）" />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={submitting}>
              {submitLabel}
            </Button>
            <Button onClick={() => navigate(-1)}>取消</Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
}