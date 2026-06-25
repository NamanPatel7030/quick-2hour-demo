// iron-session config — cookie-based session for Mediflow-2
import type { SessionOptions } from 'iron-session';
import type { SessionData } from '@/types';

export const sessionOptions: SessionOptions = {
  password:
    process.env.SESSION_SECRET ||
    'mediflow2_dev_password_at_least_32_characters_long_xxx',
  cookieName: 'mediflow2_session',
  cookieOptions: {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  },
};

export const defaultSession: SessionData = {
  userId: '',
  email: '',
  fullName: '',
  initials: '',
  role: 'ATTORNEY',
  firmId: '',
  avatarColor: '',
  loggedInAt: 0,
};