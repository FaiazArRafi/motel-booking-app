import React, { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  color?: 'amber' | 'emerald' | 'blue' | 'purple' | 'rose';
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color = 'amber'
}) => {
  const colorMap = {
    amber: 'bg-amber-50 text-amber-800 border-amber-100',
    emerald: 'bg-emerald-50 text-emerald-800 border-emerald-100',
    blue: 'bg-blue-50 text-blue-800 border-blue-100',
    purple: 'bg-purple-50 text-purple-800 border-purple-100',
    rose: 'bg-rose-50 text-rose-800 border-rose-100'
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm hover:shadow-md transition">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">{title}</span>
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${colorMap[color]}`}>
          {icon}
        </div>
      </div>
      <div className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">{value}</div>
      {subtitle && <p className="text-xs text-stone-400 mt-1 font-medium">{subtitle}</p>}
    </div>
  );
};
