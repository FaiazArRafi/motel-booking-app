import React, { ReactNode } from 'react';
import { BedDouble } from 'lucide-react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = ''
}) => {
  return (
    <div className={`text-center py-12 px-4 rounded-2xl border-2 border-dashed border-stone-200 bg-stone-50/50 flex flex-col items-center justify-center max-w-lg mx-auto ${className}`}>
      <div className="w-14 h-14 rounded-2xl bg-amber-100/80 text-amber-800 flex items-center justify-center mb-4">
        {icon || <BedDouble className="w-7 h-7" />}
      </div>
      <h3 className="text-lg font-bold text-stone-900 mb-1">{title}</h3>
      <p className="text-sm text-stone-500 max-w-sm mb-5 leading-relaxed">{description}</p>
      {action}
    </div>
  );
};
