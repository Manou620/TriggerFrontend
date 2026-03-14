import React from 'react';
import { X, Bell, CheckCircle, AlertCircle, Info, Trash2 } from 'lucide-react';
import { useNotificationStore } from '@/src/app/store/notification.store';
import { cn, formatDate } from '@/src/utils/format';
import { motion, AnimatePresence } from 'motion/react';

/**
 * Slide-in drawer panel for viewing in-app notifications.
 *
 * **Controlled by Zustand** (`useNotificationStore`):
 * - `isOpen` drives visibility via `AnimatePresence`.
 * - `notifications` are listed with type-based icons (success/error/info).
 * - Footer actions: "Mark all as read" and "Clear all".
 *
 * **Animations:** Uses Framer Motion for smooth slide-in (from right)
 * and a backdrop blur overlay.
 */
export const NotificationDrawer: React.FC = () => {
  const { notifications, isOpen, closeDrawer, clearNotifications, markAllAsRead } = useNotificationStore();

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay — blurred dark layer behind the drawer, click to close */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
            className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[100]"
          />

          {/* Drawer panel — slides in from the right, 80% width on mobile, 40% on desktop */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full bg-white dark:bg-slate-900 shadow-2xl z-[101] w-[80%] md:w-[40%] flex flex-col border-l border-slate-200 dark:border-slate-800"
          >
            {/* Drawer header — bell icon + "Notifications" title on left, X close button on right */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Bell icon with unread count badge */}
                <div className="relative">
                  <Bell className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Notifications</h2>
              </div>
              {/* Close drawer button — top right of the drawer */}
              <button
                onClick={closeDrawer}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Notification list — scrollable area, shows empty state or notification cards */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {notifications.length === 0 ? (
                /* Empty state — centered bell icon + "Aucune notification" text */
                <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-2">
                  <Bell className="w-12 h-12 opacity-20" />
                  <p>Aucune notification</p>
                </div>
              ) : (
                notifications.map((n) => (
                  /* Single notification card — highlighted border if unread */
                  <div
                    key={n.id}
                    className={cn(
                      "p-4 rounded-xl border transition-all",
                      n.read 
                        ? "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800" 
                        : "bg-primary/5 border-primary/20 shadow-sm"
                    )}
                  >
                    <div className="flex gap-3">
                      {/* Type icon — colored circle: green (success), red (error), blue (info) */}
                      <div className={cn(
                        "mt-1 p-2 rounded-lg shrink-0",
                        n.type === 'success' && "bg-green-100 text-green-600",
                        n.type === 'error' && "bg-red-100 text-red-600",
                        n.type === 'info' && "bg-blue-100 text-blue-600"
                      )}>
                        {n.type === 'success' && <CheckCircle className="w-4 h-4" />}
                        {n.type === 'error' && <AlertCircle className="w-4 h-4" />}
                        {n.type === 'info' && <Info className="w-4 h-4" />}
                      </div>
                      {/* Notification content — title, message, and timestamp */}
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{n.title}</p>
                        <p className="text-sm text-slate-500 mt-0.5">{n.message}</p>
                        <p className="text-[10px] text-slate-400 mt-2 uppercase tracking-wider font-medium">
                          {formatDate(n.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Drawer footer — "Mark all as read" + "Clear all" action buttons */}
            {notifications.length > 0 && (
              <div className="p-4 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-3">
                {/* Mark all as read button — left side of footer */}
                <button
                  onClick={markAllAsRead}
                  className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  Tout marquer comme lu
                </button>
                {/* Clear all button — right side of footer, red text with trash icon */}
                <button
                  onClick={clearNotifications}
                  className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Tout effacer
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
