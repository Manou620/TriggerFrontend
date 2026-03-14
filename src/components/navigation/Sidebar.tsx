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

const navItems = [
  { label: 'Tableau de bord', path: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { label: 'Ventes', path: ROUTES.VENTES, icon: ShoppingCart },
  { label: 'Produits', path: ROUTES.PRODUITS, icon: Package },
  { label: 'Clients', path: ROUTES.CLIENTS, icon: Users },
  { label: 'Audit', path: ROUTES.AUDIT, icon: History },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      <aside className={cn(
        "fixed top-0 left-0 h-full w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-50 transition-transform duration-300 transform lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Package className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">StockPro</span>
            </div>
            <button onClick={onClose} className="lg:hidden text-slate-500">
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
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

          <div className="p-4 border-t border-slate-200 dark:border-slate-800">
            <Link
              to={ROUTES.SETTINGS}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Settings className="w-5 h-5" />
              Paramètres
            </Link>
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
