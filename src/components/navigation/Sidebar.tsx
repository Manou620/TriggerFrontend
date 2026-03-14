import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Users, 
  History, 
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { cn } from '../../utils/format';
import { ROUTES } from '../../app/config/constants';

/**
 * Navigation items definition.
 * Each object maps a label, route path, and Lucide icon.
 * Add new pages here to include them in the sidebar menu.
 */
const navItems = [
  { label: 'Tableau de bord', path: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { label: 'Ventes', path: ROUTES.VENTES, icon: ShoppingCart },
  { label: 'Produits', path: ROUTES.PRODUITS, icon: Package },
  { label: 'Clients', path: ROUTES.CLIENTS, icon: Users },
  { label: 'Audit', path: ROUTES.AUDIT, icon: History },
];

interface SidebarProps {
  /** Whether the sidebar is open on mobile. Always visible on `lg+` screens. */
  isOpen: boolean;
  /** Callback to close the sidebar (mobile only). Fires on overlay click, X button, or link click. */
  onClose: () => void;
}

/**
 * Left sidebar navigation panel.
 *
 * **Desktop (`lg+`):** Always visible, fixed on the left (264px wide).
 * **Mobile:** Hidden off-screen (`-translate-x-full`) until `isOpen` is true.
 * A dark overlay covers the rest of the page when the mobile sidebar is open.
 *
 * The active route is highlighted with `bg-primary/10` styling.
 */
export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  return (
    <>
      {/* Dark overlay — covers the page when mobile sidebar is open, click to close */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Sidebar panel — fixed left column, slides in/out on mobile */}
      <aside className={cn(
        "fixed top-0 left-0 h-full w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-50 transition-transform duration-300 transform lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Full-height flex column: logo row → nav links → bottom actions */}
        <div className="flex flex-col h-full">
          {/* Top row — app logo + name on the left, close button (mobile only) on the right */}
          <div className="p-6 flex items-center justify-between">
            {/* Logo + brand name */}
            <div className="flex items-center gap-2">
              {/* Orange square icon with Package logo */}
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Package className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">StockPro</span>
            </div>
            {/* Close button — only visible on mobile, closes the sidebar */}
            <button onClick={onClose} className="lg:hidden text-slate-500">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation links — scrollable list of page links */}
          <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                /* Single nav link — highlighted in orange when active */
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => onClose()}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Bottom section — Settings link + Logout button, separated by a top border */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800">
            {/* Settings link — navigates to /settings */}
            <Link
              to={ROUTES.SETTINGS}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Settings className="w-5 h-5" />
              Paramètres
            </Link>
            {/* Logout button — red text, below the Settings link */}
            <button
              className="w-full flex items-center gap-3 px-3 py-2 mt-1 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10"
            >
              <LogOut className="w-5 h-5" />
              Déconnexion
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
