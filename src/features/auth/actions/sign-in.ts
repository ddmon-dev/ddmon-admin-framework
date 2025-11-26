'use server';

import { AuthError } from 'next-auth';
import { nextAuthSignIn } from '../handler';
import { AUTH_ERRORS } from '@/shared/constants/error-messages';
import type { SignInValues, SignInResult } from '../types';

export async function signIn(values: SignInValues): Promise<SignInResult> {
  try {
    await nextAuthSignIn('credentials', {
      id: values.id,
      password: values.password,
      redirect: false,
    });

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { success: false, error: AUTH_ERRORS.CREDENTIALS_SIGNIN };
        default:
          return { success: false, error: AUTH_ERRORS.LOGIN_ERROR };
      }
    }

    return { success: false, error: AUTH_ERRORS.UNKNOWN_ERROR };
  }
}
