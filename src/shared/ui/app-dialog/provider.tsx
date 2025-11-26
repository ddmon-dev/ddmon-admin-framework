'use client';

import { createContext, use, useCallback, useRef, useState } from 'react';
import {
  type DialogState,
  type DialogContextType,
  type ConfirmDialogData,
  type AlertDialogData,
} from './types';
import { ConfirmDialogComponent, AlertDialogComponent } from './components';

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
