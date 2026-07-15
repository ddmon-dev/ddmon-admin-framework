/**
 * 데모 모드 (포트폴리오 공개 데모 배포용)
 *
 * NEXT_PUBLIC_ 접두라 서버(액션 가드·이메일 스텁)와 클라이언트(로그인 오버레이·입력 disabled)
 * 양쪽에서 읽힌다. 값은 빌드 시점에 인라인되므로, 일반 배포에서는 데모 분기가 dead-code로
 * 제거된다. 토글하려면 재빌드가 필요하다.
 */

/** 데모 모드 활성화 여부 */
export const IS_DEMO = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

/**
 * 원클릭 "데모로 접속" 버튼이 실제 Credentials 로그인에 사용하는 계정.
 * 기본값은 시드 슈퍼관리자(admin/qwe123) — 공개 데모용 계정이라 노출되어도 무방하며,
 * 이미 시드 마이그레이션에 평문으로 존재한다.
 */
export const DEMO_CREDENTIALS = {
  id: process.env.NEXT_PUBLIC_DEMO_ID ?? 'admin',
  password: process.env.NEXT_PUBLIC_DEMO_PASSWORD ?? 'qwe123',
};

/** 데모 모드에서 차단된 동작을 안내하는 toast 문구 (SSOT) */
export const DEMO_MESSAGES = {
  DELETE_BLOCKED: '데모 환경에서는 삭제할 수 없습니다.',
  EMAIL_STUBBED: '데모 환경에서는 이메일 발송은 처리되지 않습니다.',
  PASSWORD_BLOCKED: '데모 환경에서는 비밀번호를 변경할 수 없습니다.',
} as const;
