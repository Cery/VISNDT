import { useEffect, useMemo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  Spin,
  Alert,
  Space,
  Typography,
  message,
} from 'antd';
import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons';
import { productService, organizationService, supplierProductService } from '../api';
import type { Organization } from '../types';
import type { Product } from '../types/product.types';
import { VISNDT_COLORS } from '../components/design-system/tokens';

const { Title, Text } = Typography;

/**
 * 816 — Admin create SupplierProduct under a selected Supplier Organization.
 *
 * Ownership assignment scope: the Admin selects a SUPPLIER Organization (WHO)
 * and an existing Platform Product (WHAT); server-side validates org ACTIVE +
 * SUPPLIER type. This is NOT a supplier self-service surface.
 */
const SUPPLIER_ORG_LABEL: Record<string, string> = {
  SUPPLIER: '供应商',
  MANUFACTURER: '制造商',
  DISTRIBUTOR: '经销商',
};

function isSupplierOrgType(type: string | undefined): boolean {
  if (!type) return false;
  const t = type.trim();
  return (
    ['SUPPLIER', 'MANUFACTURER', 'DISTRIBUTOR'].includes(t.toUpperCase()) ||
    ['供应商', '制造商', '经销商', '生产商'].includes(t)
  );
}

type PageLoadState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready' };

export default function SupplierProductCreate() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loadState, setLoadState] = useState<PageLoadState>({ status: 'loading' });
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const fetchOptions = useCallback(async () => {
    setLoadState({ status: 'loading' });
    try {
      const [orgRes, productRes] = await Promise.all([
        organizationService.getList({ page: 1, pageSize: 200 }),
        productService.getList({ page: 1, pageSize: 200 }),
      ]);
      const supplierOrgs = (orgRes.data ?? []).filter((o) => isSupplierOrgType(o.type));
      setOrgs(supplierOrgs);
      setProducts(productRes.data ?? []);
      setLoadState({ status: 'ready' });
    } catch (err) {
      const msg = err instanceof Error ? err.message : '加载选项失败';
      setLoadState({ status: 'error', message: msg });
    }
  }, []);

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  const orgOptions = useMemo(
    () =>
      orgs.map((o) => ({
        value: o.id,
        label: `${o.name}（${SUPPLIER_ORG_LABEL[o.type.toUpperCase()] ?? o.type}${o.status === 'ACTIVE' ? '' : ' · 非ACTIVE'}）`,
        disabled: o.status !== 'ACTIVE',
      })),
    [orgs],
  );

  const productOptions = useMemo(
    () =>
      products.map((p) => ({
        value: p.id,
        label: p.name,
      })),
    [products],
  );

  const handleSubmit = async (values: {
    organizationId: string;
    platformProductId: string;
    brand: string;
    series?: string;
    modelNumber: string;
    slug?: string;
    description?: string;
    technicalDescription?: string;
    applicationInfo?: string;
  }) => {
    setSubmitting(true);
    try {
      const created = await supplierProductService.create({
        organizationId: values.organizationId,
        platformProductId: values.platformProductId,
        brand: values.brand.trim(),
        series: values.series?.trim() || null,
        modelNumber: values.modelNumber.trim(),
        slug: values.slug?.trim() || null,
        description: values.description?.trim() || null,
        technicalDescription: values.technicalDescription?.trim() || null,
        applicationInfo: values.applicationInfo?.trim() || null,
      });
      message.success('能力型号已创建（草稿）');
      navigate(`/supplier-products/${created.id}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : '创建失败';
      message.error(msg);
      setSubmitting(false);
    }
  };

  if (loadState.status === 'loading') {
    return (
      <div style={{ textAlign: 'center', padding: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (loadState.status === 'error') {
    return (
      <Alert
        type="error"
        message="加载选项失败"
        description={loadState.message}
        showIcon
        action={
          <Space>
            <Button onClick={fetchOptions}>重试</Button>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/supplier-products')}>
              返回列表
            </Button>
          </Space>
        }
      />
    );
  }

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/supplier-products')}>
          返回列表
        </Button>
      </Space>

      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 4, height: 20, borderRadius: 2, background: VISNDT_COLORS.primary, flexShrink: 0 }} />
          <Title level={4} style={{ margin: 0 }}>新建能力型号（Supplier Product）</Title>
        </div>
        <Text type="secondary" style={{ fontSize: 12, marginLeft: 12, display: 'block', marginTop: 4 }}>
          平台治理 — 选择供应商组织（WHO）与平台能力（WHAT），创建归属该组织的型号草稿
        </Text>
      </div>

      <Card title="所有权分配（Ownership Assignment）" style={{ marginBottom: 16 }}>
        <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark>
          <Form.Item
            name="organizationId"
            label="供应商组织（Supplier Organization）"
            rules={[{ required: true, message: '请选择供应商组织' }]}
            extra="仅显示运行语义上的供应商组织（SUPPLIER/MANUFACTURER/DISTRIBUTOR 及中文等价）；非 ACTIVE 组织不可选。"
          >
            <Select
              showSearch
              placeholder="选择要归属的供应商组织"
              optionFilterProp="label"
              options={orgOptions}
            />
          </Form.Item>

          <Form.Item
            name="platformProductId"
            label="平台能力 / 平台产品（Platform Product）"
            rules={[{ required: true, message: '请选择平台能力' }]}
            extra="仅绑定已存在的平台能力节点；创建不会修改平台产品。"
          >
            <Select
              showSearch
              placeholder="选择平台能力"
              optionFilterProp="label"
              options={productOptions}
            />
          </Form.Item>

          <Form.Item
            name="brand"
            label="品牌（Brand）"
            rules={[{ required: true, message: '请输入品牌' }]}
          >
            <Input placeholder="例如：Acme Inspection" maxLength={255} />
          </Form.Item>

          <Form.Item name="series" label="系列（Series）">
            <Input placeholder="例如：X9" maxLength={255} />
          </Form.Item>

          <Form.Item
            name="modelNumber"
            label="型号（Model Number）"
            rules={[{ required: true, message: '请输入型号' }]}
          >
            <Input placeholder="例如：X9-200" maxLength={255} />
          </Form.Item>

          <Form.Item name="slug" label="Slug（可选）" tooltip="唯一标识；留空则由系统处理。">
            <Input placeholder="例如：acme-x9-200" maxLength={255} />
          </Form.Item>

          <Form.Item name="description" label="描述（Description）">
            <Input.TextArea rows={3} placeholder="供应商产品描述" maxLength={2000} showCount />
          </Form.Item>

          <Form.Item name="technicalDescription" label="技术描述（Technical Description）">
            <Input.TextArea rows={3} placeholder="技术描述" maxLength={2000} showCount />
          </Form.Item>

          <Form.Item name="applicationInfo" label="应用信息（Application Info）">
            <Input.TextArea rows={3} placeholder="应用信息" maxLength={2000} showCount />
          </Form.Item>

          <Space>
            <Button type="primary" htmlType="submit" icon={<PlusOutlined />} loading={submitting}>
              创建草稿
            </Button>
            <Button onClick={() => navigate('/supplier-products')}>取消</Button>
          </Space>
        </Form>
      </Card>
    </div>
  );
}