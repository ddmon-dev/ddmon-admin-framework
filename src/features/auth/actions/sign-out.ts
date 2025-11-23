'use server';

import { nextAuthSignOut } from '../lib/auth.handler';
import { AUTH_PATHS } from '../lib/auth.constants';

export async function signOut() {
  await nextAuthSignOut({ redirectTo: AUTH_PATHS.SIGN_IN });
}
