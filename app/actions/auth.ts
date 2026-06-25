'use server';

import { cookies } from 'next/headers';
import { getIronSession } from 'iron-session';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { sessionOptions } from '@/lib/auth/session';
import { ROUTES } from '@/lib/constants/routes';
import { getAttorneyByEmail } from '@/lib/auth/guards';
import type { SessionData } from '@/types';

// Login validation schema
const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

const MOCK_PASSWORD = 'abcd123';

export type LoginState = {
  ok: boolean;
  errors?: { email?: string[]; password?: string[]; _form?: string[] };
  message?: string;
};

export async function signInAction(
  _prevState: LoginState | undefined,
  formData: FormData,
): Promise<LoginState> {
  const raw = {
    email: String(formData.get('email') ?? '').trim().toLowerCase(),
    password: String(formData.get('password') ?? ''),
  };

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, errors: parsed.error.flatten().fieldErrors };
  }

  const { email, password } = parsed.data;

  // Mock auth: only danny@pathora.ai / abcd123 is accepted
  if (password !== MOCK_PASSWORD) {
    return {
      ok: false,
      errors: { _form: ['Invalid email or password.'] },
    };
  }

  const attorney = getAttorneyByEmail(email);
  if (!attorney) {
    return {
      ok: false,
      errors: { _form: ['No attorney account found for this email.'] },
    };
  }

  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
  session.userId = attorney.id;
  session.email = attorney.email;
  session.fullName = attorney.fullName;
  session.initials = attorney.initials;
  session.role = attorney.role;
  session.firmId = attorney.firmId;
  session.avatarColor = attorney.avatarColor;
  session.loggedInAt = Date.now();
  await session.save();

  const next = String(formData.get('next') ?? ROUTES.overview);
  revalidatePath('/', 'layout');
  redirect(next);
}

export async function signOutAction() {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
  session.destroy();
  revalidatePath('/', 'layout');
  redirect(ROUTES.signIn);
}

// Forgot password — mock only
const forgotSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
});

export type ForgotState = {
  ok: boolean;
  errors?: { email?: string[] };
  message?: string;
};

export async function forgotPasswordAction(
  _prevState: ForgotState | undefined,
  formData: FormData,
): Promise<ForgotState> {
  const parsed = forgotSchema.safeParse({
    email: String(formData.get('email') ?? '').trim().toLowerCase(),
  });
  if (!parsed.success) {
    return { ok: false, errors: parsed.error.flatten().fieldErrors };
  }
  // Don't reveal existence
  await new Promise((r) => setTimeout(r, 600));
  return {
    ok: true,
    message: 'If an account exists for that email, we sent a reset link.',
  };
}