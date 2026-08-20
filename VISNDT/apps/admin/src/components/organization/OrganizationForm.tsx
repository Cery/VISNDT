import { useState } from 'react';
import { Form, Input, Select, Button, Space, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import type { OrganizationFormData } from '../../types';
import { VISNDT_COLORS } from '../../components/design-system/tokens';

const { Title, Text } = Typography;

interface OrganizationFormProps {
  mode: 'create' | 'edit';
  initialValues?: Partial<OrganizationFormData>;
  onSubmit: (data: OrganizationFormData) => Promise<void>;
}

const TYPE_OPTIONS = [
  { value: 'BUYER', label: '采购方' },
  { value: 'SUPPLIER', label: '供应商' },
  { value: 'ADMIN', label: '管理员' },
];

const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: '激活' },
  { value: 'INACTIVE', label: '未激活' },
  { value: 'SUSPENDED', label: '已停用' },
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
          ? '组织创建成功'
          : '组织更新成功',
      );
      if (mode === 'create') {
        navigate('/organizations');
      } else {
        navigate(-1);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : '保存组织失败';
      message.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const title =
    mode === 'create' ? 'Register Organization' : 'Edit Organization';
  const submitLabel =
    mode === 'create' ? '创建组织' : '更新组织';

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
          返回
        </Button>
      </Space>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 4, height: 20, borderRadius: 2, background: VISNDT_COLORS.primary, flexShrink: 0 }} />
          <Title level={4} style={{ margin: 0 }}>{title}</Title>
        </div>
        <Text type="secondary" style={{ fontSize: 12, marginLeft: 12, display: 'block', marginTop: 4 }}>
          {mode === 'create' ? 'Add a new organization to the platform' : 'Update organization information and status'}
        </Text>
      </div>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={initialValues}
        style={{ maxWidth: 600 }}
      >
        <Form.Item
          label="名称"
          name="name"
          rules={[{ required: true, message: '请输入组织名称' }]}
        >
          <Input placeholder="请输入组织名称" />
        </Form.Item>

        <Form.Item
          label="类型"
          name="type"
          rules={[{ required: true, message: '请选择组织类型' }]}
        >
          <Select
            placeholder="请选择组织类型"
            options={TYPE_OPTIONS}
          />
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