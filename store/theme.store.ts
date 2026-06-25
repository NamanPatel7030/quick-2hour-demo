'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type ThemeState = {
  theme: 'light' | 'dark' | 'system';
  resolvedTheme: 'light' | 'dark';
  setTheme: (t: 'light' | 'dark' | 'system') => void;
  setResolved: (t: 'light' | 'dark') => void;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'light',
      resolvedTheme: 'light',
      setTheme: (t) => set({ theme: t }),
      setResolved: (t) => set({ resolvedTheme: t }),
    }),
    {
      name: 'mediflow2_theme',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);