'use client';

export default function KnowledgeBaseError() {
  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-20 text-center">
      <h1 className="text-2xl font-bold text-foreground mb-4">加载失败</h1>
      <p className="text-slate-500">知识中心内容暂时无法加载，请稍后重试。</p>
    </div>
  );
}