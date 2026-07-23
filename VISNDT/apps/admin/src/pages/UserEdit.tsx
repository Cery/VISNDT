import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spin, Alert, Button, Space } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { userService } from '../api';
import { UserForm } from '../components/user';
import type { User, UserFormData } from '../types';

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
      const message = err instanceof Error ? err.message : 'Failed to load user';
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
        message="Failed to Load User"
        description={pageState.message}
        showIcon
        action={
          <Space>
            <Button onClick={loadUser}>Retry</Button>
            <Button onClick={() => navigate('/users')} icon={<ArrowLeftOutlined />}>
              Back to List
            </Button>
          </Space>
        }
      />
    );
  }

  const initialValues: Partial<UserFormData> = {
    email: pageState.data.email,
    status: pageState.data.status,
    organizationId: pageState.data.organizationId || undefined,
  };

  return (
    <UserForm
      mode="edit"
      initialValues={initialValues}
      onSubmit={handleSubmit}
    />
  );
}