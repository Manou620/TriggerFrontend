import React from 'react';
import { cn } from '../../utils/format';
import { Loader2 } from 'lucide-react';

/**
 * Extended button props with custom styling and loading support.
 */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style: `primary` (blue bg), `outline` (white bordered), `ghost` (transparent), `danger` (red bg). */
  variant?: 'primary' | 'outline' | 'ghost' | 'danger';
  /** Size: `sm`, `md` (default), or `lg`. */
  size?: 'sm' | 'md' | 'lg';
  /** When `true`, shows a spinner and disables the button. */
  isLoading?: boolean;
}

/**
 * Reusable button component with variant styling and loading state.
 *
 * **Important:** The default `type` is set to `"button"` (not `"submit"`)
 * to prevent accidental form submissions when used inside `<form>` tags.
 * Use `type="submit"` explicitly on buttons that should submit forms.
 *
 * @example
 * <Button variant="danger" isLoading={isDeleting} onClick={handleDelete}>
 *   Delete
 * </Button>
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading,
  disabled,
  ...props
}) => {
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm',
    outline: 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      type={props.type || 'button'}
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
};
