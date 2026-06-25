import * as React from 'react';
import { cn } from '@/utils/cn';

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  initials: string;
  color?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  src?: string;
  ring?: boolean;
}

const sizeMap = {
  xs: 'size-6 text-[9px]',
  sm: 'size-8 text-[11px]',
  md: 'size-10 text-xs',
  lg: 'size-12 text-sm',
  xl: 'size-14 text-base',
  '2xl': 'size-16 text-lg',
};

export const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(
  ({ initials, color = '#3D5AFE', size = 'md', className, ring, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-full font-semibold text-white shrink-0',
          sizeMap[size],
          ring && 'ring-2 ring-bg-white-0 ring-offset-0',
          className,
        )}
        style={{ backgroundColor: color }}
        {...props}
      >
        {initials.slice(0, 2).toUpperCase()}
      </span>
    );
  },
);
Avatar.displayName = 'Avatar';

export interface AvatarStackProps {
  people: { initials: string; color?: string; name?: string }[];
  size?: 'xs' | 'sm' | 'md';
  max?: number;
}

export function AvatarStack({ people, size = 'sm', max = 4 }: AvatarStackProps) {
  const visible = people.slice(0, max);
  const overflow = people.length - visible.length;
  return (
    <div className="flex -space-x-2">
      {visible.map((p, i) => (
        <Avatar
          key={`${p.initials}-${i}`}
          initials={p.initials}
          color={p.color}
          size={size}
          ring
          title={p.name}
        />
      ))}
      {overflow > 0 && (
        <span
          className={cn(
            'inline-flex items-center justify-center rounded-full bg-bg-weak-50 text-text-sub-600 font-semibold ring-2 ring-bg-white-0',
            size === 'xs' && 'size-6 text-[9px]',
            size === 'sm' && 'size-8 text-[11px]',
            size === 'md' && 'size-10 text-xs',
          )}
        >
          +{overflow}
        </span>
      )}
    </div>
  );
}