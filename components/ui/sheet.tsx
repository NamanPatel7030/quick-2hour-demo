'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cn } from '@/utils/cn';

export const Sheet = DialogPrimitive.Root;
export const SheetTrigger = DialogPrimitive.Trigger;
export const SheetClose = DialogPrimitive.Close;
export const SheetPortal = DialogPrimitive.Portal;

export const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-neutral-950/40 backdrop-blur-sm',
      'data-[state=open]:animate-in data-[state=closed]:animate-out',
      'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className,
    )}
    {...props}
  />
));
SheetOverlay.displayName = DialogPrimitive.Overlay.displayName;

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  side?: 'right' | 'left' | 'top' | 'bottom';
}

export const SheetContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  SheetContentProps
>(({ className, children, side = 'right', ...props }, ref) => {
  const sideClasses =
    side === 'right'
      ? 'inset-y-0 right-0 h-full w-3/4 max-w-md sm:max-w-lg data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right'
      : side === 'left'
      ? 'inset-y-0 left-0 h-full w-3/4 max-w-md sm:max-w-lg data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left'
      : side === 'top'
      ? 'inset-x-0 top-0 w-full max-h-[90vh] data-[state=open]:slide-in-from-top data-[state=closed]:slide-out-to-top'
      : 'inset-x-0 bottom-0 w-full max-h-[90vh] data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom';

  return (
    <SheetPortal>
      <SheetOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          'fixed z-50 gap-4 bg-bg-white-0 shadow-2xl',
          'border border-stroke-soft-200',
          'duration-200',
          sideClasses,
          className,
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close
          className="absolute right-4 top-4 rounded-md p-1 text-text-soft-400 hover:text-text-strong-950 hover:bg-bg-weak-50 transition-colors"
          aria-label="Close"
        >
          <span className="text-lg leading-none">×</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </SheetPortal>
  );
});
SheetContent.displayName = 'SheetContent';

export const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-1.5 p-6 pb-3 text-left', className)} {...props} />
);

export const SheetTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('text-label-lg text-text-strong-950', className)}
    {...props}
  />
));
SheetTitle.displayName = DialogPrimitive.Title.displayName;

export const SheetDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-paragraph-sm text-text-sub-600', className)}
    {...props}
  />
));
SheetDescription.displayName = DialogPrimitive.Description.displayName;