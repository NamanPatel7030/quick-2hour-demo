'use client';

import { create } from 'zustand';
import { notifications as seedNotifications } from '@/data/notifications';
import type { Notification } from '@/types';

type NotificationState = {
  items: Notification[];
  markRead: (id: string) => void;
  markAllRead: () => void;
  unreadCount: () => number;
};

export const useNotificationStore = create<NotificationState>()((set, get) => ({
  items: seedNotifications,
  markRead: (id) =>
    set((s) => ({
      items: s.items.map((n) => (n.id === id ? { ...n, read: true } : n)),
    })),
  markAllRead: () =>
    set((s) => ({
      items: s.items.map((n) => ({ ...n, read: true })),
    })),
  unreadCount: () => get().items.filter((n) => !n.read).length,
}));