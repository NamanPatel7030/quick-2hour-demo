'use client';

import * as React from 'react';
import { useThemeStore } from '@/store/theme.store';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Monitor } from 'lucide-react';
import { cn } from '@/utils/cn';

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useThemeStore();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  // Apply class to <html>
  React.useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    if (resolvedTheme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
  }, [resolvedTheme, mounted]);

  // Resolve system theme
  React.useEffect(() => {
    if (theme !== 'system' || !mounted) return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e: MediaQueryListEvent) => {
      useThemeStore.getState().setResolved(e.matches ? 'dark' : 'light');
    };
    onChange(mq);
    return () => mq.removeEventListener('change', onChange);
  }, [theme, mounted]);

  const cycle = () => {
    const next = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
    setTheme(next);
    if (next === 'system') {
      const sysDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      useThemeStore.getState().setResolved(sysDark ? 'dark' : 'light');
    } else {
      useThemeStore.getState().setResolved(next);
    }
  };

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon-sm" aria-label="Toggle theme">
        <Sun className="size-4" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={cycle}
      aria-label={`Theme: ${theme}`}
      title={`Theme: ${theme}`}
    >
      {theme === 'light' && <Sun className="size-4" />}
      {theme === 'dark' && <Moon className="size-4" />}
      {theme === 'system' && <Monitor className={cn('size-4')} />}
    </Button>
  );
}