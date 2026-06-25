import * as React from 'react';
import { cn } from '@/utils/cn';
import type { StatusTone } from '@/lib/constants/status';

type BadgeVariant = 'soft' | 'solid' | 'outline';

const variantStyles: Record<StatusTone, Record<BadgeVariant, string>> = {
  info: {
    soft: 'bg-information-lighter text-information-dark',
    solid: 'bg-information-base text-text-white-0',
    outline: 'border border-information-base text-information-dark',
  },
  success: {
    soft: 'bg-success-lighter text-success-dark',
    solid: 'bg-success-base text-text-white-0',
    outline: 'border border-success-base text-success-dark',
  },
  warning: {
    soft: 'bg-warning-lighter text-warning-dark',
    solid: 'bg-warning-base text-text-white-0',
    outline: 'border border-warning-base text-warning-dark',
  },
  error: {
    soft: 'bg-error-lighter text-error-dark',
    solid: 'bg-error-base text-text-white-0',
    outline: 'border border-error-base text-error-dark',
  },
  pending: {
    soft: 'bg-away-lighter text-away-dark',
    solid: 'bg-away-base text-text-white-0',
    outline: 'border border-away-base text-away-dark',
  },
  neutral: {
    soft: 'bg-bg-weak-50 text-text-sub-600',
    solid: 'bg-neutral-700 text-text-white-0',
    outline: 'border border-stroke-soft-200 text-text-sub-600',
  },
  primary: {
    soft: 'bg-primary-lighter text-primary-base',
    solid: 'bg-primary-base text-text-white-0',
    outline: 'border border-primary-base text-primary-base',
  },
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: StatusTone;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  dot?: boolean;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, tone = 'neutral', variant = 'soft', size = 'md', dot, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full font-medium whitespace-nowrap',
          size === 'sm' ? 'h-5 px-2 text-[10px]' : 'h-6 px-2.5 text-xs',
          variantStyles[tone][variant],
          className,
        )}
        {...props}
      >
        {dot && (
          <span
            className={cn(
              'inline-block size-1.5 rounded-full',
              tone === 'info' && 'bg-information-base',
              tone === 'success' && 'bg-success-base',
              tone === 'warning' && 'bg-warning-base',
              tone === 'error' && 'bg-error-base',
              tone === 'pending' && 'bg-away-base',
              tone === 'neutral' && 'bg-text-soft-400',
              tone === 'primary' && 'bg-primary-base',
            )}
          />
        )}
        {children}
      </span>
    );
  },
);
Badge.displayName = 'Badge';

export interface StatusBadgeProps {
  status: string;
  tone?: StatusTone;
  variant?: BadgeVariant;
  dot?: boolean;
  className?: string;
}

export function StatusBadge({ status, tone, variant = 'soft', dot = true, className }: StatusBadgeProps) {
  return (
    <Badge tone={tone} variant={variant} dot={dot} className={className}>
      {status}
    </Badge>
  );
}