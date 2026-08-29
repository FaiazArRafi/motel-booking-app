import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  label,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-7 h-7',
    lg: 'w-10 h-10'
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-3 py-6 text-stone-600 ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin text-amber-700`} />
      {label && <p className="text-sm font-medium text-stone-500 animate-pulse">{label}</p>}
    </div>
  );
};
