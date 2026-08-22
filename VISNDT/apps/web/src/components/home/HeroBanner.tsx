import Link from 'next/link';
import { ROUTES } from '@/lib/constants';

export default function HeroBanner() {
  return (
    <section className="relative bg-gradient-to-br from-primary/10 via-background to-primary/5 py-20 md:py-28">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          工业检测设备平台
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          发现高质量工业检测设备，对比技术规格，连接专业制造商。
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={ROUTES.PRODUCTS}
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90 transition-opacity"
          >
            浏览产品
          </Link>
          <Link
            href={ROUTES.CATEGORIES}
            className="inline-flex items-center justify-center px-6 py-3 border rounded-md font-medium hover:bg-muted transition-colors"
          >
            查看分类
          </Link>
        </div>
      </div>
    </section>
  );
}