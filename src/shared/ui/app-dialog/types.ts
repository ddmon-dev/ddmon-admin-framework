/** 다이얼로그 레이아웃 타입 */
export type DialogLayout = 'default' | 'vertical';

/** 다이얼로그 크기 타입 */
export type DialogSize = 'sm' | 'md' | 'lg';

/**
 * 확인/취소 다이얼로그 데이터 (Toast API와 유사한 콜백 기반 패턴)
 * @example
 * ```typescript
 * await dialog.confirm({
 *   title: '정말 삭제하시겠습니까?',
 *   description: '이 작업은 되돌릴 수 없습니다.',
 *   confirmText: '삭제',
 *   cancelText: '취소',
 *   variant: 'destructive',
 *   onConfirm: async () => {
 *     await deleteItem();
 *     toast.success('삭제되었습니다');
 *   },
 *   onCancel: () => console.log('취소됨')
 * });
 * ```
 */
export interface ConfirmDialogData {
  /** 다이얼로그 제목 (문자열 또는 React 컴포넌트) */
  title: string | React.ReactNode;
  /** 설명 텍스트 (선택사항, 문자열 또는 React 컴포넌트) */
  description?: string | React.ReactNode;
  /** 확인 버튼 텍스트 (기본값: "확인") */
  confirmText?: string;
  /** 취소 버튼 텍스트 (기본값: "취소") */
  cancelText?: string;
  /**
   * 버튼 스타일 variant (기본값: "default")
   * - `default`: 일반 확인 (파란색 버튼)
   * - `destructive`: 위험한 작업 (빨간색 버튼)
   */
  variant?: 'default' | 'destructive';
  /**
   * 레이아웃 타입 (기본값: "default")
   * - `default`: 가로형 레이아웃
   * - `vertical`: 세로형 레이아웃 (중앙 정렬)
   */
  layout?: DialogLayout;
  /**
   * 다이얼로그 너비 (기본값: "md")
   * - `sm`: 작은 너비 (384px)
   * - `md`: 중간 너비 (448px)
   * - `lg`: 큰 너비 (512px)
   */
  size?: DialogSize;
  /**
   * 확인 버튼 클릭 시 실행할 콜백 (선택사항)
   * @returns `false`를 반환하면 다이얼로그를 닫지 않고 유지 (기본값: true - 닫기)
   * @example
   * ```typescript
   * // 성공 시 닫기, 실패 시 유지
   * onConfirm: async () => {
   *   try {
   *     await deleteItem();
   *     toast.success('삭제 완료');
   *     return true; // 다이얼로그 닫기
   *   } catch (error) {
   *     toast.error('삭제 실패');
   *     return false; // 다이얼로그 유지 (재시도 가능)
   *   }
   * }
   * ```
   */
  onConfirm?: () => void | Promise<void> | boolean | Promise<boolean>;
  /**
   * 취소 버튼 클릭 시 실행할 콜백 (선택사항)
   * @returns `false`를 반환하면 다이얼로그를 닫지 않고 유지 (기본값: true - 닫기)
   * @example
   * ```typescript
   * onCancel: () => {
   *   console.log('취소됨');
   *   return true; // 다이얼로그 닫기
   * }
   * ```
   */
  onCancel?: () => void | Promise<void> | boolean | Promise<boolean>;
}

/**
 * 알림 다이얼로그 데이터
 * @example
 * ```typescript
 * // 기본 사용
 * await dialog.alert({
 *   title: '저장 완료',
 *   description: '변경사항이 저장되었습니다.',
 *   variant: 'success'
 * });
 *
 * // onConfirm 콜백 사용
 * await dialog.alert({
 *   title: '세션 만료',
 *   description: '다시 로그인해주세요.',
 *   variant: 'warning',
 *   onConfirm: () => router.push('/login')
 * });
 * ```
 */
export interface AlertDialogData {
  /** 다이얼로그 제목 (문자열 또는 React 컴포넌트) */
  title?: string | React.ReactNode;
  /** 설명 텍스트 (선택사항, 문자열 또는 React 컴포넌트) */
  description?: string | React.ReactNode;
  /** 확인 버튼 텍스트 (기본값: "확인") */
  confirmText?: string;
  /**
   * 아이콘 스타일 variant (기본값: "default")
   * - `success`: 초록색 체크 아이콘
   * - `error`: 빨간색 X 아이콘
   * - `warning`: 노란색 경고 아이콘
   * - `default`: 파란색 정보 아이콘
   */
  variant?: 'default' | 'success' | 'warning' | 'error';
  /**
   * 레이아웃 타입 (기본값: "default")
   * - `default`: 가로형 레이아웃 (아이콘 + 제목 나란히)
   * - `vertical`: 세로형 레이아웃 (아이콘 위, 제목 아래, 중앙 정렬)
   */
  layout?: DialogLayout;
  /**
   * 다이얼로그 너비 (기본값: "md")
   * - `sm`: 작은 너비 (384px)
   * - `md`: 중간 너비 (448px)
   * - `lg`: 큰 너비 (512px)
   */
  size?: DialogSize;
  /**
   * 확인 버튼 클릭 시 실행할 콜백 (선택사항)
   * 리다이렉트, 새로고침 등 Alert 후 필수 액션에 유용함
   * @returns `false`를 반환하면 다이얼로그를 닫지 않고 유지 (기본값: true - 닫기)
   * @example
   * ```typescript
   * onConfirm: () => router.push('/login')
   * onConfirm: async () => { await refetch(); }
   * ```
   */
  onConfirm?: () => void | Promise<void> | boolean | Promise<boolean>;
}

export type DialogState =
  | { type: 'confirm'; data: ConfirmDialogData }
  | { type: 'alert'; data: AlertDialogData }
  | null;

export interface DialogContextType {
  /**
   * 확인/취소 다이얼로그를 표시합니다.
   * @param data - 다이얼로그 데이터 (onConfirm, onCancel 콜백 필수)
   * @returns 확인 또는 취소 클릭 시 완료되는 Promise
   * @example
   * ```typescript
   * await dialog.confirm({
   *   title: '정말 삭제하시겠습니까?',
   *   variant: 'destructive',
   *   onConfirm: async () => {
   *     await deleteItem(id);
   *     toast.success('삭제되었습니다');
   *   }
   * });
   * ```
   */
  confirm: (data: ConfirmDialogData) => Promise<void>;
  /**
   * 알림 다이얼로그를 표시합니다.
   * @param data - 다이얼로그 데이터
   * @returns 확인 클릭 시 완료되는 Promise
   * @example
   * ```typescript
   * await dialog.alert({
   *   title: '저장 완료',
   *   variant: 'success'
   * });
   * ```
   */
  alert: (data: AlertDialogData) => Promise<void>;
  /**
   * 현재 열린 다이얼로그를 강제로 닫습니다.
   */
  close: () => void;
}
