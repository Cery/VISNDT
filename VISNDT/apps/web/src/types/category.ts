/** Product category */
export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
  children?: ProductCategory[];
  products?: unknown[];
}