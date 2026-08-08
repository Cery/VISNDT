import { productService } from '../api';
import type { ProductFormData } from '../types';
import { ProductForm } from '../components/product';

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

  return <ProductForm onSubmit={handleSubmit} submitLabel="创建产品" title="创建产品" />;
}