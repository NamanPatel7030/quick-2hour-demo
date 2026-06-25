// Auth guards — server-only helpers
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getIronSession } from 'iron-session';
import type { SessionData } from '@/types';
import { sessionOptions } from './session';
import { ROUTES } from '@/lib/constants/routes';

export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
  if (!session.userId) return null;
  return session;
}

export async function requireUser(): Promise<SessionData> {
  const session = await getSession();
  if (!session) {
    redirect(`${ROUTES.signIn}?next=/attorney/overview`);
  }
  return session;
}

// Mock-only: returns Danny's profile from the static dataset
export async function requireDanny(): Promise<SessionData> {
  const session = await requireUser();
  if (session.email === 'danny@pathora.ai') return session;
  // In this demo, any signed-in user is treated as Danny
  return session;
}