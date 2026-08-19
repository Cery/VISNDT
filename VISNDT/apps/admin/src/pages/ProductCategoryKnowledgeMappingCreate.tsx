import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, InputNumber, Button, Card, Select, Spin, Alert, Typography, message, Switch } from 'antd';
import { productCategoryKnowledgeMappingService, extractErrorMessage, categoryService } from '../api';
import type { ProductCategory } from '../types/category.types';
import { apiClient } from '../api/client';

const { Title } = Typography;

interface KnowledgeCategoryOption {
  id: string;
  name: string;
  slug: string;
  domain: { id: string; name: string };
}

type PageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; productCategories: ProductCategory[]; knowledgeCategories: KnowledgeCategoryOption[] }
  | { status: 'submitting' };

function ProductCategoryKnowledgeMappingCreate() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [pageState, setPageState] = useState<PageState>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;
    const loadData = async () => {
      try {
        const [pcResult, kcResult] = await Promise.all([
          categoryService.getList({ pageSize: 100 }),
          apiClient.get('/knowledge/categories').then((r) => r.data.data),
        ]);
        if (!cancelled) {
          setPageState({
            status: 'ready',
            productCategories: pcResult.data,
            knowledgeCategories: kcResult,
          });
        }
      } catch (err) {
        if (!cancelled) {
          setPageState({ status: 'error', message: extractErrorMessage(err, '加载数据失败') });
        }
      }
    };
    loadData();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async (values: { productCategoryId: string; knowledgeCategoryId: string; sortOrder: number; isActive: boolean }) => {
    setPageState({ status: 'submitting' } as PageState);
    try {
      await productCategoryKnowledgeMappingService.create(values);
      message.success('映射已创建');
      navigate('/product-category-knowledge-mappings');
    } catch (err) {
      message.error(extractErrorMessage(err, '创建失败'));
      setPageState((prev) => {
        if (prev.status === 'submitting') {
          return { status: 'error', message: '' } as PageState;
        }
        return prev;
      });
    }
  };

  if (pageState.status === 'loading') {
    return (
      <div style={{ textAlign: 'center', padding: '120px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (pageState.status === 'error' && !pageState.message) {
    return null;
  }

  if (pageState.status === 'error') {
    return (
      <Alert
        type="error"
        message="加载失败"
        description={pageState.message}
        showIcon
        action={
          <Button onClick={() => navigate('/product-category-knowledge-mappings')}>返回</Button>
        }
      />
    );
  }

  if (pageState.status !== 'ready') {
    return null;
  }

  return (
    <div style={{ maxWidth: 600 }}>
      <Title level={4}>创建产品-知识分类映射</Title>
      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ sortOrder: 0, isActive: true }}
        >
          <Form.Item
            label="产品分类"
            name="productCategoryId"
            rules={[{ required: true, message: '请选择产品分类' }]}
          >
            <Select
              showSearch
              placeholder="选择产品分类"
              filterOption={(input, option) =>
                (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
              }
              options={pageState.productCategories.map((pc) => ({
                value: pc.id,
                label: `${pc.name} (${pc.slug})`,
              }))}
            />
          </Form.Item>

          <Form.Item
            label="知识分类"
            name="knowledgeCategoryId"
            rules={[{ required: true, message: '请选择知识分类' }]}
          >
            <Select
              showSearch
              placeholder="选择知识分类"
              filterOption={(input, option) =>
                (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
              }
              options={pageState.knowledgeCategories.map((kc) => ({
                value: kc.id,
                label: `${kc.name} (${kc.domain.name})`,
              }))}
            />
          </Form.Item>

          <Form.Item label="排序" name="sortOrder">
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label="启用状态" name="isActive" valuePropName="checked">
            <Switch checkedChildren="启用" unCheckedChildren="停用" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={false}>
              创建映射
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={() => navigate('/product-category-knowledge-mappings')}>
              取消
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default ProductCategoryKnowledgeMappingCreate;