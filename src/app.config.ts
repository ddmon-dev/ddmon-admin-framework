/**
 * 앱 전역 설정
 * UX CONFIG 외에는 임시 목업임. 추후 정리 및 리팩토링 필요
 */
export const SEO_CONFIG = {
  TITLE: 'Admin Dashboard',
  DESCRIPTION: 'Admin Dashboard',
};

export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 15,
  MAX_VISIBLE_PAGES: 5,
};

export const AUTH_CONFIG = {
  ID_MIN_LENGTH: 5,
  PASSWORD_STRENGTH: 'minimum',
  IDLE_TIMEOUT: 1 * 60 * 60 * 1000, // 1 hour
  IDLE_WARNING_TIME: 5 * 60 * 1000, // 5 minutes
  SIDEBAR_COOKIE_MAX_AGE: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const FILE_CONFIG = {
  UPLOAD_TIMEOUT: 30 * 1000, // 30 seconds
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ACCEPT_PRESETS: ['image/*', 'application/pdf'],
  EDITOR_DEFAULT_FOLDER: 'editor',
  EDITOR_ACCEPTED_FORMATS: ['image/*', 'application/pdf'],
};

export const PASSWORD_POLICY_CONFIG = {
  MIN_LENGTH: 6,
  MAX_LENGTH: 12,
};

export const UX_CONFIG = {
  // 로딩 스켈레톤 최소 표시 시간 (ms)
  MIN_LOADING_TIME: 600,
} as const;
