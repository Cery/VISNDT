import { Typography } from 'antd';
import { productService } from '../api';
import type { ProductFormData } from '../types';
import { ProductForm } from '../components/product';
import { VISNDT_COLORS } from '../components/design-system/tokens';
import { PageHeader } from '../components/common';

const { Text } = Typography;

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
      <PageHeader
        title="注册新能力"
        subtitle="添加新的工业检测能力到能力目录"
      />
      <ProductForm onSubmit={handleSubmit} submitLabel="创建能力" title="创建能力" />
    </div>
  );
}