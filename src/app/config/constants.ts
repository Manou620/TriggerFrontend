export const APP_NAME = 'StockPro';

/**
 * Application route path constants.
 * Used in `Sidebar` nav items and the `AppRouter` route definitions.
 * Always reference these constants instead of hardcoding path strings.
 */
export const ROUTES = {
  DASHBOARD: '/',
  VENTES: '/ventes',
  PRODUITS: '/produits',
  CLIENTS: '/clients',
  AUDIT: '/audit',
  SETTINGS: '/settings',
  LOGIN: '/login',
};

/**
 * Tailwind CSS class mappings for sale status badges.
 *
 * Maps each status key to background + text color classes.
 * Used in `VentesPage` to render color-coded status pills.
 */
export const STATUS_COLORS = {
  COMPLETED: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  PENDING: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  CANCELLED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export const OPERATION_TYPES = {
  INSERT: 'AJOUT',
  UPDATE: 'MODIFICATION',
  DELETE: 'SUPPRESSION',
};
