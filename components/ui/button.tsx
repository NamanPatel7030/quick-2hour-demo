'use client';

import * as React from 'react';
import { tv } from '@/utils/tv';
import { cn } from '@/utils/cn';

export const buttonVariants = tv({
  base: [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium',
    'transition-all duration-150 ease-out',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base focus-visible:ring-offset-2 focus-visible:ring-offset-bg-white-0',
    'disabled:pointer-events-none disabled:opacity-50',
    '[&_svg]:size-4 [&_svg]:shrink-0',
  ],
  variants: {
    variant: {
      primary:
        'bg-primary-base text-text-white-0 shadow-[0_1px_2px_rgba(0,0,0,0.06),inset_0_0_0_1px_rgba(255,255,255,0.08)] hover:bg-primary-dark active:bg-primary-darker',
      secondary:
        'bg-bg-weak-50 text-text-strong-950 shadow-[0_0_0_1px_var(--color-stroke-soft-200)] hover:bg-bg-weak-25',
      outline:
        'bg-transparent text-text-strong-950 shadow-[0_0_0_1px_var(--color-stroke-soft-200)] hover:bg-bg-weak-50',
      ghost:
        'bg-transparent text-text-strong-950 hover:bg-bg-weak-50',
      soft: 'bg-primary-lighter text-primary-base hover:bg-primary-light',
      destructive:
        'bg-error-base text-text-white-0 shadow-[0_1px_2px_rgba(0,0,0,0.06)] hover:bg-error-dark',
      link: 'bg-transparent text-primary-base underline-offset-4 hover:underline shadow-none',
      success:
        'bg-success-base text-text-white-0 shadow-[0_1px_2px_rgba(0,0,0,0.06)] hover:bg-success-dark',
    },
    size: {
      xs: 'h-7 px-2.5 text-xs rounded-md gap-1.5',
      sm: 'h-8 px-3 text-xs gap-1.5',
      md: 'h-9 px-3.5 text-sm gap-2',
      lg: 'h-11 px-5 text-sm gap-2',
      xl: 'h-12 px-6 text-base gap-2 rounded-xl',
      icon: 'h-9 w-9 p-0',
      'icon-sm': 'h-7 w-7 p-0',
      'icon-lg': 'h-11 w-11 p-0',
    },
  },
  defaultVariants: { variant: 'primary', size: 'md' },
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: NonNullable<Parameters<typeof buttonVariants>[0]>['variant'];
  size?: NonNullable<Parameters<typeof buttonVariants>[0]>['size'];
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = 'button', ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';