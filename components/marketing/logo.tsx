import { cn } from '@/utils/cn';

export function Logo({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-lg text-white font-bold shrink-0',
        'shadow-[0_0_0_1px_rgba(255,255,255,0.08)]',
        className,
      )}
      style={{
        width: size,
        height: size,
        background: 'linear-gradient(135deg,#3D5AFE,#7C3AED)',
        fontSize: size * 0.42,
      }}
    >
      M
    </span>
  );
}