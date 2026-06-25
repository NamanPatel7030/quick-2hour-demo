'use client';

import * as React from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { forgotPasswordAction, type ForgotState } from '@/app/actions/auth';

export default function ForgotPasswordPage() {
  const [state, setState] = React.useState<ForgotState | undefined>();
  const [pending, startTransition] = React.useTransition();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await forgotPasswordAction(state, formData);
      setState(result);
    });
  };

  if (state?.ok) {
    return (
      <div className="flex flex-col items-center text-center gap-6">
        <div className="flex size-16 items-center justify-center rounded-full bg-success-lighter">
          <Check className="size-8 text-success-dark" strokeWidth={3} />
        </div>
        <div className="flex flex-col gap-1.5">
          <h1 className="text-title-h3 font-semibold tracking-tight">Check your inbox</h1>
          <p className="text-paragraph-md text-text-sub-600 max-w-sm">
            {state.message} The link expires in 30 minutes.
          </p>
        </div>
        <div className="flex flex-col gap-2 w-full">
          <Button variant="primary" size="lg" className="w-full">
            Open email app
          </Button>
          <Button variant="ghost" size="md" className="w-full">
            Resend email
          </Button>
        </div>
        <Link
          href="/auth/sign-in"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-primary-base hover:underline"
        >
          <ArrowLeft className="size-3" />
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-7">
      <Link
        href="/auth/sign-in"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-text-sub-600 hover:text-text-strong-950"
      >
        <ArrowLeft className="size-3" />
        Back to sign in
      </Link>

      <div className="flex flex-col gap-1.5">
        <h1 className="text-title-h3 font-semibold tracking-tight">Forgot your password?</h1>
        <p className="text-paragraph-md text-text-sub-600">
          Enter the email associated with your account. We&apos;ll send you a reset link.
        </p>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@firm.com"
            leftIcon={<Mail />}
            autoComplete="email"
            required
            invalid={Boolean(state?.errors?.email)}
          />
          {state?.errors?.email && (
            <p className="text-xs text-error-base">{state.errors.email[0]}</p>
          )}
        </div>

        <Button type="submit" variant="primary" size="lg" disabled={pending} className="w-full">
          {pending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Sending...
            </>
          ) : (
            'Send reset link'
          )}
        </Button>
      </form>
    </div>
  );
}