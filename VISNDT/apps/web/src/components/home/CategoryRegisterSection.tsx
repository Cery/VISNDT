'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getCategories } from '@/services/category.service';
import { getProducts } from '@/services/product.service';
import type { ProductCategory } from '@/types/category';
import BlueprintContainer from '@/components/common/BlueprintContainer';

/**
 * 工业蓝图设计语言 — 能力分类注册表（表格行，非卡片）。
 * 对齐 visndt_home_redesign.html「按检测对象与工况找能力」。
 * 真实数据驱动：
 *   - 分类 → getCategories（取前 6）
 *   - 分类描述无数据模型（ProductCategory 无 description）→ 真实替补：旗下产品数（854-03）
 * 行链接 → `/products?categoryId=<id>`，与全局 /categories 收敛一致。
 */
function slugToPath(cat: ProductCategory): string {
  // 有 slug 走语义化路由；缺 slug 回退 id 过滤
  return cat.slug ? `/categories/${cat.slug}` : `/categories`;
}

export default function CategoryRegisterSection() {
  const { data: catRes, isLoading } = useQuery({
    queryKey: ['home-category-register'],
    queryFn: () => getCategories(1, 100),
    staleTime: 60_000,
  });

  const cats = (catRes?.data ?? []).slice(0, 6);

  // 并发取每分类产品数（真实替补描述，非伪造）
  const { data: counts } = useQuery({
    queryKey: ['home-category-counts', cats.map((c) => c.id).join(',')],
    queryFn: async () => {
      const entries = await Promise.all(
        cats.map(async (c) => {
          try {
            const res = await getProducts({ categoryId: c.id, status: 'ACTIVE', page: 1, pageSize: 1 });
            return [c.id, res.total] as const;
          } catch {
            return [c.id, 0] as const;
          }
        }),
      );
      return Object.fromEntries(entries) as Record<string, number>;
    },
    enabled: cats.length > 0,
    staleTime: 60_000,
  });

  return (
    <section className="py-[76px] bg-blueprint-paper text-blueprint-ink">
      <BlueprintContainer>
        <div className="flex justify-between items-end gap-6 flex-wrap mb-[42px]">
          <div>
            <h2 className="text-[27px] font-bold tracking-[-0.005em] max-w-[16em]">按检测对象与工况找能力</h2>
            <p className="text-sm text-blueprint-ink-soft max-w-[30em] mt-2">
              六类检测能力索引，覆盖从设备选型到应用场景的检索路径。
            </p>
          </div>
          <Link href="/categories" className="text-[13.5px] font-semibold text-blueprint-ink pb-1 border-b border-blueprint-ink shrink-0">
            查看完整分类 →
          </Link>
        </div>

        <div className="border-t border-blueprint-line-dark">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="grid grid-cols-[88px_1.1fr_1.6fr_30px] items-center gap-5 py-[18px] border-b border-blueprint-line animate-pulse">
                <div className="h-3 bg-blueprint-line rounded-sm" />
                <div className="h-4 bg-blueprint-line rounded-sm w-2/3" />
                <div className="h-3 bg-blueprint-line rounded-sm" />
              </div>
            ))
          ) : cats.length === 0 ? (
            <div className="text-center py-12 text-blueprint-ink-soft text-sm border-b border-blueprint-line">
              暂无能力分类数据
            </div>
          ) : (
            cats.map((cat, idx) => {
              const count = counts?.[cat.id] ?? 0;
              const href = cat.slug ? `/products?categoryId=${cat.id}` : slugToPath(cat);
              return (
                <Link
                  key={cat.id}
                  href={href}
                  className="group grid grid-cols-[88px_1.1fr_1.6fr_30px] items-center gap-5 py-[18px] px-1 border-b border-blueprint-line transition-colors hover:bg-[#E4DFD1]"
                >
                  <span className="font-mono text-[13px] font-semibold text-blueprint-verdigris">
                    {`CAT.${String(idx + 1).padStart(2, '0')}`}
                  </span>
                  <span className="text-base font-semibold">{cat.name}</span>
                  <span className="text-[13.5px] text-blueprint-ink-soft">
                    {count > 0 ? `${count} 款检测产品` : '暂无关联产品'}
                  </span>
                  <span className="text-base text-blueprint-ink-soft text-right transition-transform group-hover:translate-x-[3px] group-hover:text-blueprint-ink">
                    →
                  </span>
                </Link>
              );
            })
          )}
        </div>
      </BlueprintContainer>
    </section>
  );
}