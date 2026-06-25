'use client';

import * as React from 'react';
import { cn } from '@/utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  invalid?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, leftIcon, rightIcon, invalid, type = 'text', ...props }, ref) => {
    return (
      <div
        className={cn(
          'group relative flex items-center w-full',
          leftIcon && 'has-[input:focus-visible]:[&_.input-affix]:text-text-strong-950',
        )}
      >
        {leftIcon && (
          <span className="input-affix pointer-events-none absolute left-3 flex items-center text-text-soft-400 transition-colors [&_svg]:size-4 [&_svg]:shrink-0">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          type={type}
          aria-invalid={invalid || undefined}
          className={cn(
            'flex w-full h-10 rounded-lg border bg-bg-white-0 px-3 py-2 text-sm text-text-strong-950',
            'placeholder:text-text-soft-400',
            'transition-colors duration-150',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base focus-visible:ring-offset-0',
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-bg-weak-50',
            invalid
              ? 'border-error-base focus-visible:ring-error-base'
              : 'border-stroke-soft-200 hover:border-stroke-sub-300',
            leftIcon && 'pl-9',
            rightIcon && 'pr-9',
            className,
          )}
          {...props}
        />
        {rightIcon && (
          <span className="pointer-events-none absolute right-3 flex items-center text-text-soft-400 [&_svg]:size-4 [&_svg]:shrink-0">
            {rightIcon}
          </span>
        )}
      </div>
    );
  },
);
Input.displayName = 'Input';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, invalid, ...props }, ref) => (
    <textarea
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(
        'flex min-h-[80px] w-full rounded-lg border bg-bg-white-0 px-3 py-2 text-sm text-text-strong-950',
        'placeholder:text-text-soft-400 resize-y',
        'transition-colors duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base focus-visible:ring-offset-0',
        'disabled:cursor-not-allowed disabled:opacity-50',
        invalid
          ? 'border-error-base focus-visible:ring-error-base'
          : 'border-stroke-soft-200 hover:border-stroke-sub-300',
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = 'Textarea';