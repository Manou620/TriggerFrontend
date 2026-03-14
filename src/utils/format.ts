import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind CSS class names, resolving conflicts intelligently.
 *
 * Combines `clsx` (conditional class joining) with `tailwind-merge`
 * (deduplication of conflicting Tailwind utilities like `px-2 px-4`).
 *
 * @example
 * cn("px-2 py-1", isActive && "bg-blue-500", className)
 *
 * @param inputs - Any number of class values (strings, arrays, objects, booleans).
 * @returns A single merged class string safe for Tailwind.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number as a French locale currency string (EUR).
 *
 * @example
 * formatCurrency(1200)  // → "1 200,00 €"
 *
 * @param amount - The numeric value to format.
 * @returns A formatted currency string in `fr-FR` locale.
 */
export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}

/**
 * Formats an ISO 8601 date string into a human-readable French date + time.
 *
 * @example
 * formatDate("2024-03-10T10:30:00Z")  // → "10/03/2024, 13:30"
 *
 * @param dateString - An ISO 8601 date string (e.g. from `new Date().toISOString()`).
 * @returns A formatted date string: "DD/MM/YYYY, HH:MM".
 */
export function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
