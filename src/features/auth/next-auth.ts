import { APP_CONFIG } from '@/app.config';
import NextAuth from 'next-auth';
import authConfig from './config';

export const { handlers: nextAuthHandlers, auth } = NextAuth({
  ...authConfig,
  session: {
    strategy: 'jwt',
    maxAge: APP_CONFIG.AUTH.IDLE_TIMEOUT_MINUTES * 60, // 분 → 초
  },
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
});
