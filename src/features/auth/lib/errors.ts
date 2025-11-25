/**
 * 권한 부족 에러
 * Server Action이나 API에서 권한 체크 실패 시 사용
 */
export class AuthorizationError extends Error {
  constructor(message: string = '권한이 없습니다.') {
    super(message);
    this.name = 'AuthorizationError';
  }
}
