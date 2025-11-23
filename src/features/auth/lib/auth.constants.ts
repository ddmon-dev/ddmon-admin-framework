// 관리자 테이블명
export const ADMIN_TABLE_NAME = 'admins';

// 비밀번호 해시 반복 횟수
export const SALT_ROUNDS = 10;

export const AUTH_ERROR_MESSAGES = {
  CREDENTIALS_SIGNIN: '아이디 또는 비밀번호가 일치하지 않습니다.',
  LOGIN_ERROR: '로그인에 실패했습니다.',
  UNKNOWN_ERROR: '로그인 중 오류가 발생했습니다.',
};

export const AUTH_PATHS = {
  SIGN_IN: '/auth/sign-in',
  SIGN_OUT: '/auth/sign-out',
};
