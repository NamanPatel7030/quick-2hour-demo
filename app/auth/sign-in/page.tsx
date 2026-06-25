'use client';

import * as React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { signInAction } from '@/app/actions/auth';
import type { LoginState } from '@/app/actions/auth';
import { cn } from '@/utils/cn';

export default function SignInPage() {
  return (
    <React.Suspense fallback={<SignInFallback />}>
      <SignInForm />
    </React.Suspense>
  );
}

function SignInFallback() {
  return (
    <div className="flex items-center justify-center py-16">
      <Loader2 className="size-5 animate-spin text-text-sub-600" />
    </div>
  );
}

function SignInForm() {
  const searchParams = useSearchParams();
  const nextPath = searchParams.get('next') ?? '/attorney/overview';
  const [state, setState] = React.useState<LoginState | undefined>();
  const [showPassword, setShowPassword] = React.useState(false);
  const [pending, startTransition] = React.useTransition();
  const [rememberMe, setRememberMe] = React.useState(false);
  const formRef = React.useRef<HTMLFormElement>(null);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set('next', nextPath);
    startTransition(async () => {
      const result = await signInAction(state, formData);
      if (result && !result.ok) {
        setState(result);
        const msg = result.errors?._form?.[0] ?? 'Login failed. Please check your credentials.';
        toast.error(msg);
      }
    });
  };

  const fillDemo = () => {
    if (formRef.current) {
      (formRef.current.elements.namedItem('email') as HTMLInputElement).value = 'danny@pathora.ai';
      (formRef.current.elements.namedItem('password') as HTMLInputElement).value = 'abcd123';
    }
  };

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-title-h3 font-semibold tracking-tight">Welcome back</h1>
        <p className="text-paragraph-md text-text-sub-600">
          Sign in to your attorney portal to continue.
        </p>
      </div>

      <button
        type="button"
        onClick={fillDemo}
        className="rounded-lg border border-dashed border-primary-base/40 bg-primary-lighter px-3.5 py-2.5 text-left transition-colors hover:bg-primary-light"
      >
        <span className="block text-[11px] font-semibold uppercase tracking-wider text-primary-base mb-0.5">
          Demo account
        </span>
        <span className="block text-xs text-text-strong-950">
          <span className="font-medium">danny@pathora.ai</span>
          <span className="text-text-sub-600"> · </span>
          <span className="font-mono">abcd123</span>
          <span className="text-text-sub-600"> — click to autofill</span>
        </span>
      </button>

      <form ref={formRef} onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
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

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/auth/forgot-password"
              className="text-xs font-medium text-primary-base hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            leftIcon={<Lock />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="pointer-events-auto text-text-soft-400 hover:text-text-strong-950"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            }
            autoComplete="current-password"
            required
            invalid={Boolean(state?.errors?.password)}
          />
          {state?.errors?.password && (
            <p className="text-xs text-error-base">{state.errors.password[0]}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="remember"
            checked={rememberMe}
            onCheckedChange={(v) => setRememberMe(v === true)}
          />
          <Label htmlFor="remember" className="font-normal text-text-sub-600">
            Remember me on this device
          </Label>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={pending}
          className="w-full"
        >
          {pending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              Sign in
              <ArrowRight className="size-4" />
            </>
          )}
        </Button>
      </form>

      <div className="flex items-center gap-3 text-xs text-text-soft-400">
        <Separator className="flex-1" />
        <span>or</span>
        <Separator className="flex-1" />
      </div>

      <div className="flex flex-col gap-2 text-center text-xs text-text-sub-600">
        <span>
          First time here?{' '}
          <Link href="#" className="font-medium text-primary-base hover:underline">
            Contact your case manager
          </Link>
        </span>
        <div className="flex items-center justify-center gap-3 text-text-soft-400">
          <span>EN</span>
          <span>·</span>
          <span>ES</span>
          <span>·</span>
          <span>FR</span>
          <span>·</span>
          <span>DE</span>
          <span>·</span>
          <span>PT</span>
        </div>
      </div>

      <p className="text-center text-[11px] text-text-soft-400">
        By signing in, you agree to our{' '}
        <Link href="#" className="underline hover:text-text-strong-950">Terms</Link>
        {' '}and{' '}
        <Link href="#" className="underline hover:text-text-strong-950">Privacy Policy</Link>.
      </p>
    </div>
  );
}