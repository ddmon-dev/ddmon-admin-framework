'use server';

import { nextAuthSignOut } from '../handler';
import { AUTH_PATHS } from '../constants';

export async function signOut(options?: { redirect?: boolean }) {
  await nextAuthSignOut({
    redirect: options?.redirect ?? true,
    redirectTo: AUTH_PATHS.SIGN_IN,
  });
}
