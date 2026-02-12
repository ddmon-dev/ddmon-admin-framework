import { APP_CONFIG } from '@/app.config';
import NextAuth from 'next-auth';
import authConfig from './config';

const isDev = process.env.NODE_ENV === 'development';
const port = process.env.PORT ?? '3000';

// 개발 환경에서 로컬호스트 쿠키 충돌 방지 (포트별 구분)
const devCookies = isDev
  ? {
      cookies: {
        sessionToken: { name: `next-auth.${port}.session-token` },
        csrfToken: { name: `next-auth.${port}.csrf-token` },
        callbackUrl: { name: `next-auth.${port}.callback-url` },
      },
    }
  : {};

export const { handlers: nextAuthHandlers, auth } = NextAuth({
  ...authConfig,
  session: {
    strategy: 'jwt',
    maxAge: APP_CONFIG.AUTH.IDLE_TIMEOUT_MINUTES * 60, // 분 → 초
  },
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
  ...devCookies,
});
