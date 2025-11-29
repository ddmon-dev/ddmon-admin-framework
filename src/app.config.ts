import { Radar } from 'lucide-react';

/**
 * 앱 전역 설정
 */
export const APP_CONFIG = {
  LOGO: {
    SYMBOL: Radar,
  },
  SEO: {
    TITLE: 'Admin Dashboard',
    DESCRIPTION: 'Admin Dashboard',
  },
  AUTH: {
    ADMIN_TABLE_NAME: 'admins',
    SALT_ROUNDS: 10,
    ID_MIN_LENGTH: 5,
    PASSWORD_STRENGTH: 'minimum',
    IDLE_TIMEOUT: 1 * 60 * 60 * 1000, // 1 시간
    IDLE_WARNING_TIME: 5 * 60 * 1000, // 5 분
    PATHS: {
      SIGN_IN: '/auth/sign-in',
      FORBIDDEN: '/',
    },
  },
  UI: {
    SIDEBAR: {
      VARIANT: 'sidebar', // 'inset' | 'floating' | 'sidebar'
    },
    PAGINATION: {
      PAGE_SIZE_OPTIONS: [15, 30, 50, 100],
      MAX_VISIBLE_PAGES: 7,
      MOBILE_MAX_VISIBLE_PAGES: 5,
    },
  },
  UX: {
    MIN_LOADING_TIME: 400,
  },
  FILE: {
    UPLOAD_TIMEOUT_MS: 30000,
    EDITOR_IMAGE_MAX_SIZE_MB: 2,
  },
} as const;
