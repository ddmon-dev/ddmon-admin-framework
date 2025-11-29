'use server';

import { APP_CONFIG } from '@/app.config';
import { nextAuthSignOut } from '../handler';

export async function signOut(options?: { redirect?: boolean }) {
  await nextAuthSignOut({
    redirect: options?.redirect ?? true,
    redirectTo: APP_CONFIG.AUTH.PATHS.SIGN_IN,
  });
}
