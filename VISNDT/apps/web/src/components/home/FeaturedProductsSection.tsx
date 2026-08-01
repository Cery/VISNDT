import Link from 'next/link';
import ProductCard from '@/components/product/ProductCard';

/** Mock product data — display only, no API */
const MOCK_PRODUCTS = [
  { id: 'mock-1', name: 'Industrial Video Endoscope HD-720P', category: { id: 'cat-1', name: 'Electronic Video Endoscope', slug: 'electronic-video-endoscope', parentId: null, createdAt: '', updatedAt: '' }, model: 'HDE-720P', categoryId: 'cat-1', description: null, status: 'ACTIVE', createdAt: '', updatedAt: '' },
  { id: 'mock-2', name: 'Rigid Optical Borescope 6mm', category: { id: 'cat-2', name: 'Optical Endoscope', slug: 'optical-endoscope', parentId: null, createdAt: '', updatedAt: '' }, model: 'ROB-6MM', categoryId: 'cat-2', description: null, status: 'ACTIVE', createdAt: '', updatedAt: '' },
  { id: 'mock-3', name: 'Flexible Fiber Optic Endoscope 4mm', category: { id: 'cat-3', name: 'Fiber Optic Endoscope', slug: 'fiber-optic-endoscope', parentId: null, createdAt: '', updatedAt: '' }, model: 'FFE-4MM', categoryId: 'cat-3', description: null, status: 'ACTIVE', createdAt: '', updatedAt: '' },
  { id: 'mock-4', name: 'Pipeline Crawler Inspection Robot', category: { id: 'cat-4', name: 'Pipeline Inspection Camera', slug: 'pipeline-inspection-camera', parentId: null, createdAt: '', updatedAt: '' }, model: 'PCR-200', categoryId: 'cat-4', description: null, status: 'ACTIVE', createdAt: '', updatedAt: '' },
];

export default function FeaturedProductsSection() {
  return (
    <section className="py-16 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
              Featured Products
            </h2>
            <p className="text-slate-500">
              Explore our selection of industrial inspection equipment
            </p>
          </div>
          <Link
            href="/products"
            className="hidden sm:inline-flex text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
          >
            View All Products →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/products"
            className="inline-flex text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
          >
            View All Products →
          </Link>
        </div>
      </div>
    </section>
  );
}