'use client';

import { Toaster as SonnerToaster } from 'sonner';

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      duration={4000}
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-bg-white-0 group-[.toaster]:text-text-strong-950 group-[.toaster]:border-stroke-soft-200 group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-text-sub-600',
          actionButton:
            'group-[.toast]:bg-primary-base group-[.toast]:text-text-white-0',
          cancelButton:
            'group-[.toast]:bg-bg-weak-50 group-[.toast]:text-text-strong-950',
        },
      }}
    />
  );
}