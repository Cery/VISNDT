import { Typography } from 'antd';
import { productService } from '../api';
import type { ProductFormData } from '../types';
import { ProductForm } from '../components/product';
import { VISNDT_COLORS } from '../components/design-system/tokens';

const { Title, Text } = Typography;

export default function ProductCreate() {
  const handleSubmit = async (data: ProductFormData) => {
    const created = await productService.create({
      categoryId: data.categoryId,
      name: data.name,
      model: data.model,
      description: data.description,
      status: data.status,
    });
    return created;
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 4, height: 20, borderRadius: 2, background: VISNDT_COLORS.primary, flexShrink: 0 }} />
          <Title level={4} style={{ margin: 0 }}>Register New Capability</Title>
        </div>
        <Text type="secondary" style={{ fontSize: 12, marginLeft: 12, display: 'block', marginTop: 4 }}>
          Add a new industrial inspection product to the capability catalog
        </Text>
      </div>
      <ProductForm onSubmit={handleSubmit} submitLabel="创建产品" title="创建产品" />
    </div>
  );
}