import React from 'react';
import { Bell, Search, Menu, User } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { useNotificationStore } from '@/src/app/store/notification.store';

interface HeaderProps {
  /** Callback to open the mobile sidebar (hamburger menu click). */
  onMenuClick: () => void;
}

/**
 * Top navigation bar displayed at the top of every page.
 *
 * **Left side:** Hamburger menu button (mobile only) + global search input.
 * **Right side:** Notification bell (with unread badge) + user info (name + role).
 *
 * Reads the current user from the Redux `auth` state and
 * the unread notification count from the Zustand notification store.
 */
export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { notifications, toggleDrawer } = useNotificationStore();
  
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    // Header bar — sticky at the top, spans the full width right of the sidebar
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 px-4 lg:px-8 flex items-center justify-between">
      {/* Left section — hamburger menu + search */}
      <div className="flex items-center gap-4">
        {/* Hamburger button — visible only on mobile, opens the sidebar */}
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
        >
          <Menu className="w-6 h-6" />
        </button>
        
        {/* Global search bar — hidden on small screens, visible on md+ */}
        <div className="hidden md:flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg w-64 lg:w-96 border border-transparent focus-within:border-primary transition-all">
          <Search className="w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Rechercher..." 
            className="bg-transparent border-none outline-none text-sm w-full text-slate-900 dark:text-white placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* Right section — notification bell + user info */}
      <div className="flex items-center gap-2 lg:gap-4">
        {/* Notification bell button — opens the NotificationDrawer on click */}
        <button 
          onClick={toggleDrawer}
          className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg relative"
        >
          <Bell className="w-5 h-5" />
          {/* Red unread count badge — top-right corner of the bell icon */}
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
        
        {/* Vertical divider line — separates bell from user info */}
        <div className="h-8 w-px bg-slate-200 dark:border-slate-800 mx-1"></div>

        {/* User info block — far right of the header */}
        <div className="flex items-center gap-3 pl-2">
          {/* User name + role — text aligned right, hidden on very small screens */}
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-900 dark:text-white leading-none">{user?.name}</p>
            <p className="text-xs text-slate-500 mt-1">{user?.role}</p>
          </div>
          {/* User avatar circle — displays a User icon as placeholder */}
          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700">
            <User className="w-6 h-6 text-slate-500" />
          </div>
        </div>
      </div>
    </header>
  );
};
