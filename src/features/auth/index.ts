// 이 배럴은 "클라이언트 안전 기본값"이다. 서버 전용 API(auth, nextAuthHandlers)는
// 클라 번들 오염을 막기 위해 여기서 제외한다 — '@/features/auth/server'에서 가져올 것.

// Auth UI
export * from './ui/auth-layout';
export * from './ui/sign-in-form';
export * from './ui/require-auth';
export * from './idle-logout-provider';

// Server Actions (권장 사용 방식)
export * from './actions';

// 타입
export * from './types';
export type { User } from 'next-auth';

// 유틸리티
export * from './utils/password';
export * from './utils/server';

// Client 훅
export * from './use-auth';
