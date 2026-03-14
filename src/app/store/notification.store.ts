import { create } from 'zustand';

/**
 * A single in-app notification (not browser push notifications).
 * Notifications are pushed by feature hooks after CRUD operations
 * and displayed inside the {@link NotificationDrawer}.
 */
export interface Notification {
  /** Auto-generated ID using `Date.now()`. */
  id: number;
  /** Short headline (e.g. "Produit Ajouté"). */
  title: string;
  /** Longer explanatory text. */
  message: string;
  /** Visual category — determines the icon and color. */
  type: 'success' | 'error' | 'info' | 'warning';
  /** ISO 8601 timestamp of when the notification was created. */
  timestamp: string;
  /** Tracks whether the user has seen it. */
  read: boolean;
}

/**
 * Shape of the Zustand notification store.
 *
 * **Why Zustand instead of Redux?**
 * Notifications are ephemeral UI state (not server data), so a lightweight
 * Zustand store keeps them separate from the RTK Query cache.
 */
interface NotificationState {
  /** List of all notifications (newest first). */
  notifications: Notification[];
  /** Whether the notification drawer panel is currently visible. */
  isOpen: boolean;
  /** Push a new notification to the top of the list. */
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  /** Mark every notification as read. */
  markAllAsRead: () => void;
  /** Remove all notifications from the list. */
  clearNotifications: () => void;
  /** Toggle the drawer open/closed. Called by the bell icon in the Header. */
  toggleDrawer: () => void;
  /** Force-close the drawer. Called by the overlay click or the X button. */
  closeDrawer: () => void;
}

/**
 * Zustand store hook for managing in-app notifications.
 *
 * @example
 * // In a hook or component:
 * const addNotification = useNotificationStore(state => state.addNotification);
 * addNotification({ type: 'success', title: 'Done', message: 'Item saved.' });
 */
export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  isOpen: false,
  addNotification: (notification) => set((state) => ({
    notifications: [
      {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        read: false,
        ...notification
      } as Notification,
      ...state.notifications
    ]
  })),
  markAllAsRead: () => set((state) => ({
    notifications: state.notifications.map(n => ({ ...n, read: true }))
  })),
  clearNotifications: () => set({ notifications: [] }),
  toggleDrawer: () => set((state) => ({ isOpen: !state.isOpen })),
  closeDrawer: () => set({ isOpen: false }),
}));
