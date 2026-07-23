import { productService } from '../api';
import type { ProductFormData } from '../types';
import { ProductForm } from '../components/product';

export default function ProductCreate() {
  const handleSubmit = async (data: ProductFormData) => {
    await productService.create({
      categoryId: data.categoryId,
      name: data.name,
      model: data.model,
      description: data.description,
    });
  };

  return <ProductForm onSubmit={handleSubmit} submitLabel="Create Product" title="Create Product" />;
}