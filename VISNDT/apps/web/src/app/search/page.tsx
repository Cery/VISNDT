import { Suspense } from 'react';
import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/seo';
import SearchPageContent from './SearchPageContent';

export const metadata: Metadata = {
  title: '搜索',
  description: '搜索工业检测设备、技术知识、解决方案和供应商能力',
  // 797: 补全统一检索 Authority 的 canonical，闭合机器可读规范地址
  alternates: { canonical: `${SITE_URL}/search` },
};

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50/50">
          <div className="bg-white border-b border-slate-200">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-4 sm:py-6">
              <div className="max-w-2xl mx-auto">
                <div className="h-9 bg-slate-100 rounded-lg animate-pulse" />
              </div>
            </div>
          </div>
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-slate-100 rounded-xl animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}