'use client';

import { createContext, use, useCallback, useRef, useState } from 'react';
import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import { Spinner } from '@/shared/ui/spinner';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/utils/classnames';

// Types
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
  title: string | React.ReactNode;
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

type DialogState =
  | { type: 'confirm'; data: ConfirmDialogData }
  | { type: 'alert'; data: AlertDialogData }
  | null;

interface DialogContextType {
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

// Context
const DialogContext = createContext<DialogContextType | null>(null);

// Provider
interface DialogProviderProps {
  children: React.ReactNode;
}

export function DialogProvider({ children }: DialogProviderProps) {
  const [dialogState, setDialogState] = useState<DialogState>(null);
  const resolveRef = useRef<((value: any) => void) | null>(null);

  const confirm = useCallback((data: ConfirmDialogData): Promise<void> => {
    return new Promise(resolve => {
      resolveRef.current = resolve;
      setDialogState({ type: 'confirm', data });
    });
  }, []);

  const alert = useCallback((data: AlertDialogData): Promise<void> => {
    return new Promise(resolve => {
      resolveRef.current = resolve;
      setDialogState({ type: 'alert', data });
    });
  }, []);

  const close = useCallback(() => {
    if (resolveRef.current) {
      resolveRef.current(undefined);
      resolveRef.current = null;
    }
    setDialogState(null);
  }, []);

  const handleConfirm = useCallback(async () => {
    // onConfirm 콜백 실행
    let shouldClose = true;
    if (dialogState?.type === 'confirm' && dialogState.data.onConfirm) {
      const result = await dialogState.data.onConfirm();
      // undefined나 true는 닫기, false는 유지
      shouldClose = result !== false;
    }

    // 닫기 조건이 충족되면 Promise resolve 및 다이얼로그 닫기
    if (shouldClose) {
      if (resolveRef.current) {
        resolveRef.current(undefined);
        resolveRef.current = null;
      }
      setDialogState(null);
    }
  }, [dialogState]);

  const handleCancel = useCallback(async () => {
    // onCancel 콜백 실행
    let shouldClose = true;
    if (dialogState?.type === 'confirm' && dialogState.data.onCancel) {
      const result = await dialogState.data.onCancel();
      // undefined나 true는 닫기, false는 유지
      shouldClose = result !== false;
    }

    // 닫기 조건이 충족되면 Promise resolve 및 다이얼로그 닫기
    if (shouldClose) {
      if (resolveRef.current) {
        resolveRef.current(undefined);
        resolveRef.current = null;
      }
      setDialogState(null);
    }
  }, [dialogState]);

  const handleAlertClose = useCallback(async () => {
    // onConfirm 콜백 실행
    let shouldClose = true;
    if (dialogState?.type === 'alert' && dialogState.data.onConfirm) {
      const result = await dialogState.data.onConfirm();
      // undefined나 true는 닫기, false는 유지
      shouldClose = result !== false;
    }

    // 닫기 조건이 충족되면 Promise resolve 및 다이얼로그 닫기
    if (shouldClose) {
      if (resolveRef.current) {
        resolveRef.current(undefined);
        resolveRef.current = null;
      }
      setDialogState(null);
    }
  }, [dialogState]);

  return (
    <DialogContext.Provider value={{ confirm, alert, close }}>
      {children}

      {dialogState?.type === 'confirm' && (
        <ConfirmDialogComponent
          data={dialogState.data}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}

      {dialogState?.type === 'alert' && (
        <AlertDialogComponent
          data={dialogState.data}
          onClose={handleAlertClose}
        />
      )}
    </DialogContext.Provider>
  );
}

// Hook
export function useDialog() {
  const context = use(DialogContext);
  if (!context) {
    throw new Error('useDialog must be used within DialogProvider');
  }
  return context;
}

// Confirm Dialog Component
interface ConfirmDialogComponentProps {
  data: ConfirmDialogData;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void | Promise<void>;
}

function ConfirmDialogComponent({ data, onConfirm, onCancel }: ConfirmDialogComponentProps) {
  const {
    title,
    description,
    confirmText = '확인',
    cancelText = '취소',
    variant = 'default',
  } = data;
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    await onConfirm();
    setIsLoading(false);
  };

  const handleCancel = async () => {
    setIsLoading(true);
    await onCancel();
    setIsLoading(false);
  };

  return (
    <AlertDialog
      open
      onOpenChange={open => !open && !isLoading && handleCancel()}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && <AlertDialogDescription>{description}</AlertDialogDescription>}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            variant='outline'
            onClick={handleCancel}
            disabled={isLoading}
            className='min-w-18'
          >
            {cancelText}
          </Button>
          <Button
            variant={variant === 'destructive' ? 'destructive' : 'default'}
            onClick={handleConfirm}
            disabled={isLoading}
            className='min-w-18'
          >
            {isLoading ? <Spinner /> : confirmText}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Alert Dialog Component
interface AlertDialogComponentProps {
  data: AlertDialogData;
  onClose: () => void | Promise<void>;
}

const VARIANT_CONFIG = {
  success: {
    icon: CheckCircle2,
    iconClassName: 'h-5 w-5 text-green-600',
  },
  error: {
    icon: XCircle,
    iconClassName: 'h-5 w-5 text-red-600',
  },
  warning: {
    icon: AlertTriangle,
    iconClassName: 'h-5 w-5 text-yellow-600',
  },
  default: {
    icon: Info,
    iconClassName: 'h-5 w-5 text-blue-600',
  },
} as const;

function AlertDialogComponent({ data, onClose }: AlertDialogComponentProps) {
  const { title, description, confirmText = '확인', variant = 'default' } = data;
  const variantConfig = VARIANT_CONFIG[variant];
  const Icon = variantConfig.icon;
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = async () => {
    setIsLoading(true);
    await onClose();
    setIsLoading(false);
  };

  return (
    <Dialog
      open
      onOpenChange={open => !open && !isLoading && handleClose()}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Icon className={variantConfig.iconClassName} />
            <span>{title}</span>
          </DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className='flex justify-end'>
          <Button
            onClick={handleClose}
            disabled={isLoading}
          >
            {isLoading ? <Spinner /> : confirmText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
