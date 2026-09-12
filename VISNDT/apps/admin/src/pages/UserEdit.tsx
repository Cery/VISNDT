import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spin, Alert, Button, Space, Typography } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { userService } from '../api';
import { UserForm } from '../components/user';
import type { User, UserFormData } from '../types';
import { VISNDT_COLORS } from '../components/design-system/tokens';
import { PageHeader } from '../components/common';

const { Text } = Typography;

type PageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; data: User };

export default function UserEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pageState, setPageState] = useState<PageState>({ status: 'loading' });

  const loadUser = useCallback(async () => {
    if (!id) return;
    setPageState({ status: 'loading' });
    try {
      const data = await userService.getById(id);
      setPageState({ status: 'ready', data });
    } catch (err) {
      const message = err instanceof Error ? err.message : '加载用户失败';
      setPageState({ status: 'error', message });
    }
  }, [id]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const handleSubmit = async (formData: UserFormData) => {
    if (!id) return;
    await userService.update(id, {
      email: formData.email,
      passwordHash: formData.passwordHash || undefined,
      status: formData.status,
      organizationId: formData.organizationId || undefined,
    });
  };

  if (pageState.status === 'loading') {
    return (
      <div style={{ textAlign: 'center', padding: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (pageState.status === 'error') {
    return (
      <Alert
        type="error"
        message="加载用户失败"
        description={pageState.message}
        showIcon
        action={
          <Space>
            <Button onClick={loadUser}>重试</Button>
            <Button onClick={() => navigate('/users')} icon={<ArrowLeftOutlined />}>
              返回列表
            </Button>
          </Space>
        }
      />
    );
  }

  const initialValues: Partial<UserFormData> = {
    email: pageState.data.email,
    name: pageState.data.name,
    status: pageState.data.status,
    organizationId: pageState.data.organizationId || undefined,
  };

  return (
    <div>
      <PageHeader
        title="编辑用户"
        subtitle="更新用户信息与角色配置"
      />
      <UserForm
        mode="edit"
        initialValues={initialValues}
        onSubmit={handleSubmit}
      />
    </div>
  );
}