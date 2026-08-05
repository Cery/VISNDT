'use client';

import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '@/services/product.service';
import { getCategories } from '@/services/category.service';
import SearchBar from '@/components/products/SearchBar';
import ProductFilter from '@/components/products/ProductFilter';
import ProductGrid from '@/components/products/ProductGrid';
import Pagination from '@/components/common/Pagination';
import ErrorState from '@/components/common/ErrorState';

export default function ProductsPage() {
  const [keyword, setKeyword] = useState('');
  const [categoryId, setCategoryId] = useState<string | undefined>();
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories(1, 100),
  });

  const {
    data: productsData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['products', keyword, categoryId, sortBy, sortOrder, page],
    queryFn: () =>
      getProducts({
        keyword: keyword || undefined,
        categoryId,
        sortBy: sortBy as 'createdAt' | 'updatedAt' | 'name',
        sortOrder: sortOrder as 'asc' | 'desc',
        page,
        pageSize: 12,
        status: 'ACTIVE',
      }),
  });

  const handleSearch = useCallback((kw: string) => {
    setKeyword(kw);
    setPage(1);
  }, []);

  const handleCategoryChange = useCallback((catId: string | undefined) => {
    setCategoryId(catId);
    setPage(1);
  }, []);

  const handleSortChange = useCallback((field: string, order: string) => {
    setSortBy(field);
    setSortOrder(order);
    setPage(1);
  }, []);

  const categories = categoriesData?.data ?? [];

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-foreground">产品</h1>
        <p className="text-muted-foreground mt-1">
          浏览工业检测设备
        </p>
      </div>

      {/* Search */}
      <div className="mb-6 max-w-lg">
        <SearchBar onSearch={handleSearch} />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filter */}
        <aside className="lg:w-64 flex-shrink-0">
          <ProductFilter
            categories={categories}
            selectedCategoryId={categoryId}
            onCategoryChange={handleCategoryChange}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={handleSortChange}
          />
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {isError ? (
            <ErrorState
              message={error instanceof Error ? error.message : '加载产品失败'}
            />
          ) : (
            <>
              <ProductGrid
                products={productsData?.data ?? []}
                isLoading={isLoading}
              />
              <Pagination
                currentPage={page}
                totalPages={productsData?.totalPages ?? 1}
                onPageChange={setPage}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}