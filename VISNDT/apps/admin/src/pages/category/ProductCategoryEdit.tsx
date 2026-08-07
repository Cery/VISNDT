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
        categoryService.getList({ page: 1, pageSize: 100 }),
      ]);
      form.setFieldsValue({
        name: category.name,
        slug: category.slug,
        parentId: category.parentId ?? undefined,
      });
      setPageState({ status: 'ready', categories: listResult.data });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : '加载分类失败';
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
      message.success('分类更新成功');
      navigate('/product-categories');
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : '更新分类失败';
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
        message="加载分类失败"
        description={pageState.message}
        showIcon
        action={
          <Space>
            <Button onClick={loadData}>重试</Button>
            <Button
              onClick={() => navigate('/product-categories')}
              icon={<ArrowLeftOutlined />}
            >
              返回列表
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
        编辑分类
      </Title>

      <Card>
        <Form<UpdateProductCategoryDto>
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
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
              更新分类
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

export default ProductCategoryEdit;