/**
 * 데모 모드 (포트폴리오 공개 데모 배포용)
 *
 * IS_DEMO(분기 플래그)만 NEXT_PUBLIC_ — 서버/클라 양쪽에서 읽히며 빌드 시점에 인라인되어
 * 일반 배포에서는 데모 분기가 dead-code로 제거된다. 토글하려면 재빌드가 필요하다.
 *
 * 데모 계정 ID/비밀번호는 여기 두지 않는다. 클라이언트 번들에 자격증명이 실리는 것을 막기 위해
 * 서버 전용 env(DEMO_ID·DEMO_PASSWORD)로 두고, authorize 콜백(서버)에서만 읽는다.
 * 원클릭 접속은 클라이언트가 sentinel({ demo: 'true' })만 보내고 서버가 자격증명을 주입한다.
 */

/** 데모 모드 활성화 여부 */
export const IS_DEMO = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

/** 데모 모드에서 차단된 동작을 안내하는 toast 문구 (SSOT) */
export const DEMO_MESSAGES = {
  DELETE_BLOCKED: '데모 환경에서는 삭제할 수 없습니다.',
  EMAIL_STUBBED: '데모 환경에서는 이메일 발송은 처리되지 않습니다.',
  PASSWORD_BLOCKED: '데모 환경에서는 비밀번호를 변경할 수 없습니다.',
} as const;
