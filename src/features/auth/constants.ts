import { type PasswordStrength } from '@/shared/schemas';

export const ADMIN_TABLE_NAME = 'admins';
export const SALT_ROUNDS = 10;

export const AUTH_PATHS = {
  SIGN_IN: '/auth/sign-in',
  SIGN_OUT: '/auth/sign-out',
  FORBIDDEN: '/',
} as const;

export const AUTH_POLICIES = {
  ID_MIN_LENGTH: 5,
  PASSWORD_STRENGTH: 'minimum' as PasswordStrength,
} as const;
