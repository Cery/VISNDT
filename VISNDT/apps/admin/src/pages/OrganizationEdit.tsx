import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spin, Alert, Button, Space } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { organizationService } from '../api';
import { OrganizationForm } from '../components/organization';
import type { Organization, OrganizationFormData } from '../types';

type PageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; data: Organization };

export default function OrganizationEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pageState, setPageState] = useState<PageState>({ status: 'loading' });

  const loadOrganization = useCallback(async () => {
    if (!id) return;
    setPageState({ status: 'loading' });
    try {
      const data = await organizationService.getById(id);
      setPageState({ status: 'ready', data });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to load organization';
      setPageState({ status: 'error', message });
    }
  }, [id]);

  useEffect(() => {
    loadOrganization();
  }, [loadOrganization]);

  const handleSubmit = async (formData: OrganizationFormData) => {
    if (!id) return;
    await organizationService.update(id, {
      name: formData.name,
      type: formData.type,
      status: formData.status,
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
        message="Failed to Load Organization"
        description={pageState.message}
        showIcon
        action={
          <Space>
            <Button onClick={loadOrganization}>Retry</Button>
            <Button
              onClick={() => navigate('/organizations')}
              icon={<ArrowLeftOutlined />}
            >
              Back to List
            </Button>
          </Space>
        }
      />
    );
  }

  const initialValues: Partial<OrganizationFormData> = {
    name: pageState.data.name,
    type: pageState.data.type,
    status: pageState.data.status,
  };

  return (
    <OrganizationForm
      mode="edit"
      initialValues={initialValues}
      onSubmit={handleSubmit}
    />
  );
}