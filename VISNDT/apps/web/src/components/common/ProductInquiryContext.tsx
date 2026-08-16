'use client';

interface ProductInquiryContextProps {
  productName: string;
  model?: string | null;
  category?: string | null;
}

export default function ProductInquiryContext({
  productName,
  model,
  category,
}: ProductInquiryContextProps) {
  return (
    <div className="rounded-lg border border-primary/20 bg-gradient-to-r from-primary/5 to-primary/[0.02] p-4 mb-4">
      <p className="text-sm font-medium text-primary mb-1">您正在咨询：</p>
      <p className="text-base font-semibold text-foreground">{productName}</p>
      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5">
        {model && (
          <p className="text-sm text-slate-500">
            <span className="text-slate-400">型号：</span>
            <span className="font-mono">{model}</span>
          </p>
        )}
        {category && (
          <p className="text-sm text-slate-500">
            <span className="text-slate-400">分类：</span>
            {category}
          </p>
        )}
      </div>
      <p className="text-xs text-slate-400 mt-2">
        我们将根据该设备信息帮助您匹配检测需求。
      </p>
    </div>
  );
}