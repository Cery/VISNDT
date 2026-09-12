import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spin, Alert, Button, Space, Typography } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { productService } from '../api';
import type { ProductDetail, ProductFormData } from '../types';
import { ProductForm } from '../components/product';
import { VISNDT_COLORS } from '../components/design-system/tokens';
import { PageHeader } from '../components/common';

const { Text } = Typography;

type PageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; data: ProductDetail };

export default function ProductEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pageState, setPageState] = useState<PageState>({ status: 'loading' });

  const loadProduct = useCallback(async () => {
    if (!id) return;
    setPageState({ status: 'loading' });
    try {
      const data = await productService.getById(id);
      setPageState({ status: 'ready', data });
    } catch (err) {
      const message = err instanceof Error ? err.message : '加载能力失败';
      setPageState({ status: 'error', message });
    }
  }, [id]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  const handleSubmit = async (formData: ProductFormData) => {
    if (!id) return;
    await productService.update(id, {
      categoryId: formData.categoryId,
      name: formData.name,
      model: formData.model,
      description: formData.description,
      status: formData.status,
    });
    return { id };
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
        message="加载能力失败"
        description={pageState.message}
        showIcon
        action={
          <Space>
            <Button onClick={loadProduct}>重试</Button>
            <Button onClick={() => navigate('/products')} icon={<ArrowLeftOutlined />}>
              返回列表
            </Button>
          </Space>
        }
      />
    );
  }

  const initialValues: Partial<ProductFormData> = {
    name: pageState.data.name,
    model: pageState.data.model,
    description: pageState.data.description,
    categoryId: pageState.data.categoryId,
    status: pageState.data.status as 'DRAFT' | 'ACTIVE' | 'INACTIVE',
  };

  return (
    <div>
      <PageHeader
        title="编辑能力"
        subtitle="更新能力信息与参数"
      />
      <ProductForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        submitLabel="更新能力"
        title="编辑能力"
        productId={id}
      />
    </div>
  );
}