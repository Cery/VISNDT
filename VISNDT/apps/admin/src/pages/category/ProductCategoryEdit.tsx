import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Select, Spin, Alert, Typography, message, Space } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { categoryService } from '../../api/category.service';
import type { UpdateProductCategoryDto, ProductCategory } from '../../types/category.types';

const { Title } = Typography;
const { Option } = Select;

type PageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; categories: ProductCategory[] }
  | { status: 'submitting' };

function ProductCategoryEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm<UpdateProductCategoryDto>();
  const [pageState, setPageState] = useState<PageState>({ status: 'loading' });

  const loadData = useCallback(async () => {
    if (!id) return;
    setPageState({ status: 'loading' });
    try {
      const [category, listResult] = await Promise.all([
        categoryService.getById(id),
        categoryService.list({ page: 1, pageSize: 100 }),
      ]);
      form.setFieldsValue({
        name: category.name,
        slug: category.slug,
        parentId: category.parentId ?? undefined,
      });
      setPageState({ status: 'ready', categories: listResult.data });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load category';
      setPageState({ status: 'error', message: errorMessage });
    }
  }, [id, form]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSubmit = async (values: UpdateProductCategoryDto) => {
    if (!id) return;
    setPageState((prev) =>
      prev.status === 'ready'
        ? ({ ...prev, status: 'submitting' } as PageState)
        : prev,
    );
    try {
      const payload: UpdateProductCategoryDto = {
        name: values.name,
        slug: values.slug,
        parentId: values.parentId || undefined,
      };
      await categoryService.update(id, payload);
      message.success('Category updated successfully');
      navigate('/product-categories');
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to update category';
      setPageState((prev) =>
        prev.status === 'ready'
          ? ({ ...prev, status: 'ready' } as PageState)
          : prev,
      );
      message.error(errorMessage);
    }
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
        message="Failed to Load Category"
        description={pageState.message}
        showIcon
        action={
          <Space>
            <Button onClick={loadData}>Retry</Button>
            <Button
              onClick={() => navigate('/product-categories')}
              icon={<ArrowLeftOutlined />}
            >
              Back to List
            </Button>
          </Space>
        }
      />
    );
  }

  const categories: ProductCategory[] =
    'categories' in pageState
      ? (pageState as { status: 'ready'; categories: ProductCategory[] }).categories
      : [];

  return (
    <div style={{ maxWidth: 600 }}>
      <Title level={4} style={{ marginBottom: 24 }}>
        Edit Category
      </Title>

      <Card>
        <Form<UpdateProductCategoryDto>
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please enter a name' }]}
          >
            <Input placeholder="e.g. Electronics" />
          </Form.Item>

          <Form.Item
            label="Slug"
            name="slug"
            rules={[{ required: true, message: 'Please enter a slug' }]}
          >
            <Input placeholder="e.g. electronics" />
          </Form.Item>

          <Form.Item label="Parent Category" name="parentId">
            <Select placeholder="Select a parent category (optional)" allowClear>
              {categories.map((c: ProductCategory) => (
                <Option key={c.id} value={c.id}>
                  {c.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={pageState.status === 'submitting'}
            >
              Update Category
            </Button>
            <Button
              style={{ marginLeft: 8 }}
              onClick={() => navigate('/product-categories')}
            >
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default ProductCategoryEdit;