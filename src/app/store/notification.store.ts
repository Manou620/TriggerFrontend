import { create } from 'zustand';

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  timestamp: string;
  read: boolean;
}

interface NotificationState {
  notifications: Notification[];
  isOpen: boolean;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  toggleDrawer: () => void;
  closeDrawer: () => void;
}

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
