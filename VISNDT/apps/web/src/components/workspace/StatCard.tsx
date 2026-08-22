import UiIcon from '@/lib/ui-icon';
import type { UiIconName } from '@/lib/ui-icon';

interface StatCardProps {
  label: string;
  value: string | number;
  description?: string;
  icon?: UiIconName;
}

export default function StatCard({ label, value, description, icon }: StatCardProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 hover:border-slate-300 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
          {label}
        </span>
        {icon && <UiIcon name={icon} size={20} color="#94a3b8" />}
      </div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      {description && (
        <p className="text-xs text-slate-400 mt-1">{description}</p>
      )}
    </div>
  );
}