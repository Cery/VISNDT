import { useEffect, useState, useCallback } from 'react';
import { Form, Input, Select, Button, Space, Spin, Alert, message, Upload, Card, Divider, InputNumber } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined, UploadOutlined } from '@ant-design/icons';
import { categoriesService, parameterDefinitionService, productParameterService, productMediaService } from '../../api';
import type { ProductFormData } from '../../types';
import type { ParameterDefinition } from '../../types/parameter-definition.types';
import type { UploadFile } from 'antd/es/upload/interface';

const { TextArea } = Input;
const { Dragger } = Upload;

interface ProductCategory {
  id: string;
  name: string;
  slug: string;
}

interface ProductFormProps {
  initialValues?: Partial<ProductFormData>;
  onSubmit: (data: ProductFormData) => Promise<{ id: string } | void>;
  submitLabel: string;
  title: string;
  productId?: string;
}

type FormState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; categories: ProductCategory[]; parameterDefinitions: ParameterDefinition[] };

export default function ProductForm({ initialValues, onSubmit, submitLabel, title, productId }: ProductFormProps) {
  const navigate = useNavigate();
  const [form] = Form.useForm<ProductFormData>();
  const [formState, setFormState] = useState<FormState>({ status: 'loading' });
  const [submitting, setSubmitting] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [parameterValues, setParameterValues] = useState<Record<string, { value: string; valueNumber?: number }>>({});

  const loadFormData = useCallback(async () => {
    setFormState({ status: 'loading' });
    try {
      const [categories, paramDefs] = await Promise.all([
        categoriesService.getList(),
        parameterDefinitionService.getList({ pageSize: 100 }),
      ]);
      setFormState({ status: 'ready', categories, parameterDefinitions: paramDefs.data });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '加载表单数据失败';
      setFormState({ status: 'error', message: errorMessage });
    }
  }, []);

  useEffect(() => {
    loadFormData();
  }, [loadFormData]);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues, form]);

  const handleParameterChange = (defId: string, value: string, dataType: string) => {
    const numValue = dataType === 'NUMBER' ? parseFloat(value) : undefined;
    setParameterValues((prev) => ({
      ...prev,
      [defId]: { value, valueNumber: isNaN(numValue as number) ? undefined : numValue },
    }));
  };

  const handleSubmit = async (values: ProductFormData) => {
    setSubmitting(true);
    try {
      const createdProduct = await onSubmit(values);

      // If there are parameter values and we have a product (created or edit), save them
      const targetProductId = productId || (createdProduct as any)?.id;
      if (targetProductId) {
        const paramEntries = Object.entries(parameterValues).filter(([_, v]) => v.value.trim());
        await Promise.all(
          paramEntries.map(([defId, v]) =>
            productParameterService.set(targetProductId, {
              parameterDefinitionId: defId,
              value: v.value,
              valueNumber: v.valueNumber,
            }),
          ),
        );
      }

      // Upload media files
      if (targetProductId && fileList.length > 0) {
        const uploadPromises = fileList
          .filter((f) => f.originFileObj)
          .map((f) =>
            productMediaService.createWithUpload(targetProductId, f.originFileObj as File, {
              mediaType: 'IMAGE' as any,
              title: f.name,
            }),
          );
        await Promise.all(uploadPromises);
      }

      message.success(submitLabel === '创建产品' ? '产品创建成功' : '产品更新成功');
      navigate('/products');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '保存产品失败';
      message.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (formState.status === 'loading') {
    return (
      <div style={{ textAlign: 'center', padding: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (formState.status === 'error') {
    return (
      <Alert
        type="error"
        message="加载表单数据失败"
        description={formState.message}
        showIcon
        action={
          <Space>
            <Button onClick={loadFormData}>重试</Button>
            <Button onClick={() => navigate('/products')} icon={<ArrowLeftOutlined />}>
              返回列表
            </Button>
          </Space>
        }
      />
    );
  }

  // Group parameter definitions by their group name
  const groupedParams = formState.parameterDefinitions.reduce<Record<string, ParameterDefinition[]>>(
    (acc, def) => {
      const groupName = def.group?.name || '其他参数';
      if (!acc[groupName]) acc[groupName] = [];
      acc[groupName].push(def);
      return acc;
    },
    {},
  );

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/products')}>
          返回列表
        </Button>
      </Space>
      <h2>{title}</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ status: 'DRAFT' }}
        style={{ maxWidth: 800 }}
      >
        <Card title="基本信息" style={{ marginBottom: 16 }}>
          <Form.Item
            label="名称"
            name="name"
            rules={[{ required: true, message: '请输入产品名称' }]}
          >
            <Input placeholder="请输入产品名称" />
          </Form.Item>

          <Form.Item label="型号" name="model">
            <Input placeholder="请输入型号" />
          </Form.Item>

          <Form.Item
            label="分类"
            name="categoryId"
            rules={[{ required: true, message: '请选择分类' }]}
          >
            <Select
              placeholder="请选择分类"
              options={formState.categories.map((c) => ({
                value: c.id,
                label: c.name,
              }))}
            />
          </Form.Item>

          <Form.Item label="状态" name="status">
            <Select
              options={[
                { value: 'DRAFT', label: '草稿' },
                { value: 'ACTIVE', label: '已上架' },
                { value: 'INACTIVE', label: '已下架' },
              ]}
            />
          </Form.Item>

          <Form.Item label="描述" name="description">
            <TextArea rows={4} placeholder="请输入产品描述" />
          </Form.Item>
        </Card>

        {Object.entries(groupedParams).length > 0 && (
          <Card title="参数配置" style={{ marginBottom: 16 }}>
            {Object.entries(groupedParams).map(([groupName, defs]) => (
              <div key={groupName} style={{ marginBottom: 16 }}>
                <Divider orientation="left" style={{ fontSize: 13 }}>{groupName}</Divider>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                  {defs.map((def) => (
                    <div key={def.id} style={{ flex: '1 1 200px', minWidth: 200 }}>
                      <Form.Item
                        label={`${def.name}${def.unit ? ` (${def.unit})` : ''}${def.required ? ' *' : ''}`}
                      >
                        {def.dataType === 'BOOLEAN' ? (
                          <Select
                            placeholder="请选择"
                            allowClear
                            onChange={(val) => handleParameterChange(def.id, val || '', def.dataType)}
                            options={[
                              { value: 'true', label: '是' },
                              { value: 'false', label: '否' },
                            ]}
                          />
                        ) : def.dataType === 'ENUM' && def.options && def.options.length > 0 ? (
                          <Select
                            placeholder="请选择"
                            allowClear
                            onChange={(val) => handleParameterChange(def.id, val || '', def.dataType)}
                            options={def.options.map((o) => ({ value: o.value, label: o.label }))}
                          />
                        ) : def.dataType === 'NUMBER' ? (
                          <InputNumber
                            style={{ width: '100%' }}
                            placeholder="请输入数值"
                            onChange={(val) => handleParameterChange(def.id, val?.toString() || '', def.dataType)}
                          />
                        ) : (
                          <Input
                            placeholder="请输入"
                            onChange={(e) => handleParameterChange(def.id, e.target.value, def.dataType)}
                          />
                        )}
                      </Form.Item>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </Card>
        )}

        <Card title="媒体资源" style={{ marginBottom: 16 }}>
          <Dragger
            multiple
            fileList={fileList}
            beforeUpload={(file) => {
              setFileList((prev) => [...prev, file]);
              return false;
            }}
            onRemove={(file) => {
              setFileList((prev) => prev.filter((f) => f.uid !== file.uid));
            }}
            accept="image/*"
          >
            <p className="ant-upload-drag-icon">
              <UploadOutlined />
            </p>
            <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
            <p className="ant-upload-hint">支持 PNG、JPG、JPEG 等图片格式</p>
          </Dragger>
        </Card>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={submitting}>
              {submitLabel}
            </Button>
            <Button onClick={() => navigate('/products')}>取消</Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
}