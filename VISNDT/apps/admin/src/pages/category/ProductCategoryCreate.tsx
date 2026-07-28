import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Select, Spin, Alert, Typography, message } from 'antd';
import { categoryService } from '../../api/category.service';
import type { CreateProductCategoryDto, ProductCategory } from '../../types/category.types';

const { Title } = Typography;
const { Option } = Select;

type PageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; categories: ProductCategory[] }
  | { status: 'submitting' };

function ProductCategoryCreate() {
  const navigate = useNavigate();
  const [form] = Form.useForm<CreateProductCategoryDto>();
  const [pageState, setPageState] = useState<PageState>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;
    const loadCategories = async () => {
      try {
        const result = await categoryService.list({ page: 1, pageSize: 100 });
        if (!cancelled) {
          setPageState({ status: 'ready', categories: result.data });
        }
      } catch (err) {
        if (!cancelled) {
          const errorMessage =
            err instanceof Error ? err.message : 'Failed to load categories';
          setPageState({ status: 'error', message: errorMessage });
        }
      }
    };
    loadCategories();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async (values: CreateProductCategoryDto) => {
    setPageState((prev) =>
      prev.status === 'ready'
        ? ({ ...prev, status: 'submitting' } as PageState)
        : prev,
    );
    try {
      const payload: CreateProductCategoryDto = {
        name: values.name,
        slug: values.slug,
        parentId: values.parentId || undefined,
      };
      await categoryService.create(payload);
      message.success('Category created successfully');
      navigate('/product-categories');
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to create category';
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
        message="Failed to load form data"
        description={pageState.message}
        showIcon
        action={
          <Button onClick={() => navigate('/product-categories')}>
            Back to List
          </Button>
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
        Create Category
      </Title>

      <Card>
        <Form<CreateProductCategoryDto>
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            name: '',
            slug: '',
          }}
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
              Create Category
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

export default ProductCategoryCreate;