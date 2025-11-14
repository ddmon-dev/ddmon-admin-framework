import Link, { LinkProps } from 'next/link';
import { ReactNode } from 'react';

/**
 * 인증 관련 라우트 경로 상수
 * 모든 인증 관련 경로를 중앙에서 관리합니다.
 */
const AUTH_ROOT = '/auth';

export const AUTH_ROUTES = {
  login: `${AUTH_ROOT}/sign-in`,
  signup: `${AUTH_ROOT}/sign-up`,
  forgotPassword: `${AUTH_ROOT}/forgot-password`,
  resetPassword: `${AUTH_ROOT}/reset-password`,
  terms: `${AUTH_ROOT}/terms`,
  privacy: `${AUTH_ROOT}/privacy`,
  callback: `${AUTH_ROOT}/callback`,
} as const;

// 타입 추론을 위한 유틸리티 타입
export type AuthRoute = (typeof AUTH_ROUTES)[keyof typeof AUTH_ROUTES];

interface AuthLinkProps extends Omit<LinkProps, 'href'> {
  className?: string;
  children?: ReactNode;
}

/**
 * 자주 사용되는 인증 관련 링크 컴포넌트
 * 덜 자주 사용되는 링크는 AUTH_ROUTES 상수를 직접 사용하세요.
 */

// 로그인 페이지 링크 - 거의 모든 인증 폼에서 사용됨
export function SignInLink({ children = '로그인', className, ...props }: AuthLinkProps) {
  return (
    <Link
      href={AUTH_ROUTES.login}
      className={className}
      {...props}
    >
      {children}
    </Link>
  );
}

// 회원가입 페이지 링크 - 로그인 폼과 헤더에서 사용됨
export function SignUpLink({ children = '회원가입', className, ...props }: AuthLinkProps) {
  return (
    <Link
      href={AUTH_ROUTES.signup}
      className={className}
      {...props}
    >
      {children}
    </Link>
  );
}

// 비밀번호 찾기 페이지 링크 - 로그인 폼에서만 사용되지만 중요한 UX 요소
export function ForgotPasswordLink({
  children = '비밀번호를 잊으셨나요?',
  className,
  ...props
}: AuthLinkProps) {
  return (
    <Link
      href={AUTH_ROUTES.forgotPassword}
      className={className}
      {...props}
    >
      {children}
    </Link>
  );
}
