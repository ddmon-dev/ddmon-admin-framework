'use server';

import { AuthError } from 'next-auth';
import { AUTH_ERRORS } from '@/shared/constants/error-messages';
import { Result } from '@/shared/utils/results';
import { nextAuthSignIn } from '../handler';
import type { SignInValues, SignInResult } from '../types';

export async function signIn(values: SignInValues): Promise<SignInResult> {
  try {
    await nextAuthSignIn('credentials', {
      id: values.id,
      password: values.password,
      redirect: false,
    });

    return Result.ok();
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return Result.error(AUTH_ERRORS.CREDENTIALS_SIGNIN);
        default:
          return Result.error(AUTH_ERRORS.LOGIN_ERROR);
      }
    }

    return Result.error(AUTH_ERRORS.UNKNOWN_ERROR);
  }
}
