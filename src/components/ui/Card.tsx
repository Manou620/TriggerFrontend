import React from 'react';
import { cn } from '../../utils/format';

/**
 * Props for the Card container component.
 */
interface CardProps {
  children: React.ReactNode;
  /** Additional Tailwind classes to merge with the default card styles. */
  className?: string;
  /** If provided, renders a header bar at the top of the card with this title. */
  title?: string;
  /** Secondary text below the title (only rendered if `title` is also set). */
  subtitle?: string;
  /** Optional React node placed on the right side of the header (e.g. a button). */
  action?: React.ReactNode;
}

/**
 * Generic card container used across all pages.
 *
 * Provides consistent styling: white background, rounded corners, subtle border,
 * and an optional header section with title/subtitle/action.
 *
 * @example
 * <Card title="Recent Sales" subtitle="Last 5 entries" action={<Button>Export</Button>}>
 *   {children}
 * </Card>
 */
export const Card: React.FC<CardProps> = ({ children, className, title, subtitle, action }) => {
  return (
    <div className={cn("bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden", className)}>
      {(title || action) && (
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            {title && <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>}
            {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};
