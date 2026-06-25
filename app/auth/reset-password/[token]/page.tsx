'use client';

import * as React from 'react';
import Link from 'next/link';
import { Lock, ArrowLeft, Loader2, Check, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useParams, useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
  const params = useParams<{ token: string }>();
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();
  const [done, setDone] = React.useState(false);
  const [showPw, setShowPw] = React.useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const pw = String(fd.get('password') ?? '');
    const conf = String(fd.get('confirm') ?? '');
    if (pw.length < 8) {
      toast.error('Password must be at least 8 characters.');
      return;
    }
    if (pw !== conf) {
      toast.error('Passwords do not match.');
      return;
    }
    startTransition(async () => {
      await new Promise((r) => setTimeout(r, 600));
      setDone(true);
      toast.success('Password reset successfully');
      setTimeout(() => router.push('/auth/sign-in'), 1200);
    });
  };

  if (done) {
    return (
      <div className="flex flex-col items-center text-center gap-6">
        <div className="flex size-16 items-center justify-center rounded-full bg-success-lighter">
          <Check className="size-8 text-success-dark" strokeWidth={3} />
        </div>
        <div className="flex flex-col gap-1.5">
          <h1 className="text-title-h3 font-semibold tracking-tight">Password reset</h1>
          <p className="text-paragraph-md text-text-sub-600 max-w-sm">
            Your password has been reset. Redirecting to sign in...
          </p>
        </div>
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
        <h1 className="text-title-h3 font-semibold tracking-tight">Choose a new password</h1>
        <p className="text-paragraph-md text-text-sub-600">
          Your reset token <span className="font-mono text-xs bg-bg-weak-50 px-1.5 py-0.5 rounded">{params.token}</span> is valid for 30 minutes.
        </p>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">New password</Label>
          <Input
            id="password"
            name="password"
            type={showPw ? 'text' : 'password'}
            placeholder="At least 8 characters"
            leftIcon={<Lock />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                className="pointer-events-auto text-text-soft-400 hover:text-text-strong-950"
                aria-label={showPw ? 'Hide password' : 'Show password'}
              >
                {showPw ? <EyeOff /> : <Eye />}
              </button>
            }
            required
          />
          <PasswordStrength />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="confirm">Confirm password</Label>
          <Input
            id="confirm"
            name="confirm"
            type={showPw ? 'text' : 'password'}
            placeholder="Re-enter password"
            leftIcon={<Lock />}
            required
          />
        </div>

        <Button type="submit" variant="primary" size="lg" disabled={pending} className="w-full">
          {pending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Resetting...
            </>
          ) : (
            'Reset password'
          )}
        </Button>
      </form>
    </div>
  );
}

function PasswordStrength() {
  // Simple visual strength meter
  return (
    <div className="mt-1 flex items-center gap-2">
      <div className="flex flex-1 gap-1">
        <div className="h-1 flex-1 rounded-full bg-success-base" />
        <div className="h-1 flex-1 rounded-full bg-success-base" />
        <div className="h-1 flex-1 rounded-full bg-bg-soft-200" />
        <div className="h-1 flex-1 rounded-full bg-bg-soft-200" />
      </div>
      <span className="text-[10px] font-semibold uppercase tracking-wider text-success-dark">
        Good
      </span>
    </div>
  );
}