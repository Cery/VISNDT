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
            err instanceof Error ? err.message : '加载分类失败';
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
      message.success('分类创建成功');
      navigate('/product-categories');
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : '创建分类失败';
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
        message="加载表单数据失败"
        description={pageState.message}
        showIcon
        action={
          <Button onClick={() => navigate('/product-categories')}>
            返回列表
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
        创建分类
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
            label="名称"
            name="name"
            rules={[{ required: true, message: '请输入名称' }]}
          >
            <Input placeholder="如：电子产品" />
          </Form.Item>

          <Form.Item
            label="标识"
            name="slug"
            rules={[{ required: true, message: '请输入标识' }]}
          >
            <Input placeholder="如：electronics" />
          </Form.Item>

          <Form.Item label="父级分类" name="parentId">
            <Select placeholder="请选择父级分类（可选）" allowClear>
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
              创建分类
            </Button>
            <Button
              style={{ marginLeft: 8 }}
              onClick={() => navigate('/product-categories')}
            >
              取消
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default ProductCategoryCreate;