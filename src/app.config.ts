import type { PasswordStrength } from '@/shared/schemas/presets/password';
import type { SidebarVariant } from '@/shared/ui/sidebar';
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
    PASSWORD_STRENGTH: 'minimum' as PasswordStrength,
    IDLE_TIMEOUT: 1 * 60 * 60 * 1000, // 1 시간
    IDLE_WARNING_TIME: 5 * 60 * 1000, // 5 분
    PATHS: {
      SIGN_IN: '/auth/sign-in',
      FORBIDDEN: '/unauthorized',
    },
  },
  UI: {
    SIDEBAR: {
      VARIANT: 'inset' as SidebarVariant,
      WIDTH: '20rem',
      WIDTH_MD: '15rem',
      WIDTH_MOBILE: '18rem',
      WIDTH_ICON: '3rem',
      COOKIE_NAME: 'sidebar_state',
      COOKIE_MAX_AGE: 60 * 60 * 24 * 7,
      KEYBOARD_SHORTCUT: 'b',
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
  EDITOR: {
    UPLOAD_FOLDER: 'editor',
    IMAGE_MAX_SIZE_MB: 2,
    IMAGE_ACCEPTED_FORMATS: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  },
  FILE: {
    UPLOAD_TIMEOUT_MS: 30000,
  },
} as const;
