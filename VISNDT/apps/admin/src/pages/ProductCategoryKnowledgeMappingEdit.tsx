import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, InputNumber, Button, Card, Spin, Alert, Typography, message, Switch, Descriptions } from 'antd';
import { productCategoryKnowledgeMappingService, extractErrorMessage } from '../api';
import type { ProductCategoryKnowledgeMapping } from '../api/product-category-knowledge-mapping.service';
import { PageHeader } from '../components/common';

type PageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; mapping: ProductCategoryKnowledgeMapping }
  | { status: 'submitting' };

function ProductCategoryKnowledgeMappingEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const [pageState, setPageState] = useState<PageState>({ status: 'loading' });

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    const loadData = async () => {
      try {
        const mapping = await productCategoryKnowledgeMappingService.getById(id);
        if (!cancelled) {
          form.setFieldsValue({
            sortOrder: mapping.sortOrder,
            isActive: mapping.isActive,
          });
          setPageState({ status: 'ready', mapping });
        }
      } catch (err) {
        if (!cancelled) {
          setPageState({ status: 'error', message: extractErrorMessage(err, '加载映射失败') });
        }
      }
    };
    loadData();
    return () => {
      cancelled = true;
    };
  }, [id, form]);

  const handleSubmit = async (values: { sortOrder: number; isActive: boolean }) => {
    if (!id) return;
    setPageState((prev) => {
      if (prev.status === 'ready') {
        return { status: 'submitting' } as PageState;
      }
      return prev;
    });
    try {
      await productCategoryKnowledgeMappingService.update(id, values);
      message.success('映射已更新');
      navigate('/product-category-knowledge-mappings');
    } catch (err) {
      message.error(extractErrorMessage(err, '更新失败'));
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

  if (pageState.status !== 'ready' && pageState.status !== 'submitting') {
    return null;
  }

  const { mapping } = pageState as { status: 'ready' | 'submitting'; mapping: ProductCategoryKnowledgeMapping };

  return (
    <div style={{ maxWidth: 600 }}>
      <PageHeader
        title="编辑产品-知识分类映射"
        subtitle="更新映射排序和状态"
      />

      <Card style={{ marginBottom: 16 }}>
        <Descriptions title="映射信息" column={1} size="small">
          <Descriptions.Item label="映射 ID">
            <Typography.Text code>{mapping.id}</Typography.Text>
          </Descriptions.Item>
          <Descriptions.Item label="产品分类">
            {mapping.productCategory.name} ({mapping.productCategory.slug})
          </Descriptions.Item>
          <Descriptions.Item label="知识分类">
            {mapping.knowledgeCategory.name} ({mapping.knowledgeCategory.slug})
          </Descriptions.Item>
          <Descriptions.Item label="知识领域">
            {mapping.knowledgeCategory.domain.name}
          </Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {new Date(mapping.createdAt).toLocaleString()}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="编辑">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item label="排序" name="sortOrder">
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label="启用状态" name="isActive" valuePropName="checked">
            <Switch checkedChildren="启用" unCheckedChildren="停用" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={pageState.status === 'submitting'}>
              保存
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

export default ProductCategoryKnowledgeMappingEdit;