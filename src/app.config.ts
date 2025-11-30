import type { PasswordStrength } from '@/shared/schemas/presets/password';
import type { SidebarVariant } from '@/shared/ui/sidebar';
import { Radar } from 'lucide-react';

export const APP_CONFIG = {
  LOGO: {
    SYMBOL: Radar, // 사이드바, 로그인 페이지 상단 로고 아이콘
  },
  SEO: {
    TITLE: 'Admin Dashboard Template',
    DESCRIPTION: 'This is the admin dashboard template',
  },
  AUTH: {
    ADMIN_TABLE_NAME: 'admins', // Supabase 관리자 테이블명
    SALT_ROUNDS: 10, // bcrypt 해시 라운드
    ID_MIN_LENGTH: 5,
    PASSWORD_STRENGTH: 'minimum' as PasswordStrength, // 관리자 비밀번호 강도
    IDLE_TIMEOUT: 1 * 60 * 60 * 1000, // 자동 로그아웃 (1시간)
    IDLE_WARNING_TIME: 5 * 60 * 1000, // 로그아웃 경고 표시 (5분 전)
    PATHS: {
      SIGN_IN: '/auth/sign-in',
      FORBIDDEN: '/unauthorized',
    },
  },
  UI: {
    SIDEBAR: {
      VARIANT: 'inset' as SidebarVariant, // 사이드바 레이아웃 타입
      WIDTH: '20rem', // 기본
      WIDTH_MD: '15rem', // md 브레이크포인트
      WIDTH_MOBILE: '18rem', // 모바일 시트
      WIDTH_ICON: '3rem', // 축소 상태
      COOKIE_NAME: 'sidebar_state',
      COOKIE_MAX_AGE: 60 * 60 * 24 * 7, // 7일
      KEYBOARD_SHORTCUT: 'b', // Ctrl/Cmd + B
    },
    PAGINATION: {
      PAGE_SIZE_OPTIONS: [15, 30, 50, 100], // 페이지당 아이템 수 옵션
      MAX_VISIBLE_PAGES: 7, // 최대 페이지네이션 버튼 수
      MOBILE_MAX_VISIBLE_PAGES: 5, // 모바일에서 보이는 최대 페이지네이션 버튼 수
    },
  },
  UX: {
    MIN_LOADING_TIME: 400, // 최소 로딩 스켈레톤 표시 시간 (ms) (client-side)
  },
  EDITOR: {
    UPLOAD_ROOT: 'editor', // 이미지 업로드 루트 폴더
    IMAGE_MAX_SIZE_MB: 2, // 최대 이미지 용량 (MB)
    IMAGE_ACCEPTED_FORMATS: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'], // 허용되는 이미지 형식
  },
  FILE: {
    UPLOAD_TIMEOUT_MS: 30000, // 파일 업로드 시 타임아웃 (30초)
  },
} as const;
