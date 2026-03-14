import React from 'react';
import { cn } from '../../utils/format';

interface SkeletonProps {
  className?: string;
}

/**
 * Base skeleton loader — a single pulsating gray rectangle.
 * Use custom `className` to set width/height (e.g. `"h-4 w-24"`).
 */
export const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div className={cn("animate-pulse bg-slate-200 dark:bg-slate-800 rounded", className)} />
  );
};

/**
 * Table-shaped skeleton: mimics a search bar + table header + N rows.
 * Shown while data is loading on table-based pages (Produits, Audit, Ventes).
 *
 * @param rows - Number of placeholder rows to display (default: 5).
 */
export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="space-y-4">
      <div className="flex gap-4 mb-4">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-24" />
      </div>
      <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
        <div className="bg-slate-50 dark:bg-slate-900 h-12 border-b border-slate-200 dark:border-slate-800" />
        {[...Array(rows)].map((_, i) => (
          <div key={i} className="h-16 border-b border-slate-100 dark:border-slate-800 px-4 flex items-center gap-4">
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Card-shaped skeleton: mimics a stat card with title + value + icon.
 * Used on the Dashboard and Clients pages during initial load.
 */
export const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
      <div className="flex justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-16" />
        </div>
        <Skeleton className="h-12 w-12 rounded-xl" />
      </div>
      <Skeleton className="h-4 w-32" />
    </div>
  );
};
