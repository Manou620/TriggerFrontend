import React from 'react';
import { Bell, Search, Menu, User } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { useNotificationStore } from '@/src/app/store/notification.store';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { notifications, toggleDrawer } = useNotificationStore();
  
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 px-4 lg:px-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
        >
          <Menu className="w-6 h-6" />
        </button>
        
        <div className="hidden md:flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg w-64 lg:w-96 border border-transparent focus-within:border-primary transition-all">
          <Search className="w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Rechercher..." 
            className="bg-transparent border-none outline-none text-sm w-full text-slate-900 dark:text-white placeholder:text-slate-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 lg:gap-4">
        <button 
          onClick={toggleDrawer}
          className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg relative"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
        
        <div className="h-8 w-px bg-slate-200 dark:border-slate-800 mx-1"></div>

        <div className="flex items-center gap-3 pl-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-900 dark:text-white leading-none">{user?.name}</p>
            <p className="text-xs text-slate-500 mt-1">{user?.role}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700">
            <User className="w-6 h-6 text-slate-500" />
          </div>
        </div>
      </div>
    </header>
  );
};
