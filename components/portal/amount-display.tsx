import { cn } from '@/utils/cn';
import { formatCurrency } from '@/lib/format';

interface AmountDisplayProps {
  cents: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  signed?: boolean;
  tone?: 'default' | 'positive' | 'negative' | 'muted';
}

export function AmountDisplay({
  cents,
  size = 'md',
  className,
  signed,
  tone = 'default',
}: AmountDisplayProps) {
  return (
    <span
      className={cn(
        'tabular-nums font-medium',
        size === 'sm' && 'text-xs',
        size === 'md' && 'text-sm',
        size === 'lg' && 'text-base',
        tone === 'positive' && 'text-success-base',
        tone === 'negative' && 'text-error-base',
        tone === 'muted' && 'text-text-soft-400',
        tone === 'default' && 'text-text-strong-950',
        className,
      )}
    >
      {formatCurrency(cents, { sign: signed })}
    </span>
  );
}