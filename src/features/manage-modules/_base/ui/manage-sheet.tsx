'use client';

import { use, createContext, useRef, useState } from 'react';
import { useDialog } from '@/shared/ui/app-dialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetBody,
} from '@/shared/ui/sheet';
import { FormSkeleton } from '@/shared/ui/skeletons';
import { cn } from '@/shared/utils/classnames';
import type { DbFilesJSONB } from '@/shared/lib/file-system';
import type { GetItemAction } from '../hooks/use-manage-item-data';
import { useManageItemData } from '../hooks/use-manage-item-data';
import type { ManageSheetMode } from '../types';
import { ManageSheetError } from './manage-sheet-error';

interface ManageSheetData {
  id?: string;
  mode: ManageSheetMode;
}

interface ManageSheetContextType {
  manageSheetData: ManageSheetData | null;
  openManageSheet: (data: ManageSheetData) => void;
  setMode: (mode: ManageSheetMode) => void;
  closeManageSheet: () => void;
  closeWithGuard: () => void;
  setModeWithGuard: (mode: ManageSheetMode) => void;
  setCloseGuard: (guard: (() => boolean) | null) => void;
}

export const ManageSheetContext = createContext<ManageSheetContextType>({
  manageSheetData: null,
  openManageSheet: () => {},
  setMode: () => {},
  closeManageSheet: () => {},
  closeWithGuard: () => {},
  setModeWithGuard: () => {},
  setCloseGuard: () => {},
});

export function ManageSheetProvider({ children }: { children: React.ReactNode }) {
  const [manageSheetData, setManageSheetData] = useState<ManageSheetData | null>(null);
  const closeGuardRef = useRef<(() => boolean) | null>(null);
  const dialog = useDialog();

  const openManageSheet = (data: ManageSheetData) => {
    setManageSheetData(data);
  };

  const setMode = (mode: ManageSheetMode) => {
    setManageSheetData((prev) => (prev ? { ...prev, mode } : null));
  };

  const closeManageSheet = () => {
    closeGuardRef.current = null;
    setManageSheetData(null);
  };

  const runWithGuard = async (action: () => void) => {
    if (!closeGuardRef.current || !closeGuardRef.current()) {
      action();
      return;
    }

    await dialog.confirm({
      title: '변경사항이 있습니다',
      description: '저장하지 않은 변경사항이 있습니다. 계속하시겠습니까?',
      confirmText: '확인',
      cancelText: '취소',
      variant: 'destructive',
      onConfirm: action,
    });
  };

  const closeWithGuard = () => runWithGuard(closeManageSheet);
  const setModeWithGuard = (mode: ManageSheetMode) => runWithGuard(() => setMode(mode));

  const setCloseGuard = (guard: (() => boolean) | null) => {
    closeGuardRef.current = guard;
  };

  return (
    <ManageSheetContext.Provider
      value={{
        manageSheetData,
        openManageSheet,
        setMode,
        closeManageSheet,
        closeWithGuard,
        setModeWithGuard,
        setCloseGuard,
      }}
    >
      {children}
    </ManageSheetContext.Provider>
  );
}

export function useManageSheet() {
  const context = use(ManageSheetContext);
  return {
    data: context.manageSheetData,
    open: context.openManageSheet,
    setMode: context.setMode,
    close: context.closeManageSheet,
    closeWithGuard: context.closeWithGuard,
    setModeWithGuard: context.setModeWithGuard,
    setCloseGuard: context.setCloseGuard,
  };
}

// ── ManageSheet 데이터 Context ──────────────────────────────

interface ManageSheetDataContextType {
  prevValues: unknown;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

const ManageSheetDataContext = createContext<ManageSheetDataContextType | null>(null);

export function useManageSheetData<T>() {
  const context = use(ManageSheetDataContext);
  if (!context) {
    throw new Error('useManageSheetData는 ManageSheet 내부에서만 사용할 수 있습니다.');
  }
  return {
    ...context,
    prevValues: context.prevValues as T | null,
  };
}

interface ManageSheetProps<T extends { files?: DbFilesJSONB }> {
  fetchFn: GetItemAction<T>;
  additionalDateFields?: string[];
  formComponent?: React.ComponentType<{ id?: string; prevValues: T | null }>;
  viewComponent?: React.ComponentType<{ data: T }>;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  moduleName?: string;
  customVariant?: {
    create?: {
      title: (moduleName?: string) => string;
      description: string;
    };
    modify?: {
      title: (moduleName?: string) => string;
      description: string;
    };
    view?: {
      title: (moduleName?: string) => string;
      description: string;
    };
    clone?: {
      title: (moduleName?: string) => string;
      description: string;
    };
  };
}

const VARIANTS = {
  create: {
    title: (moduleName?: string) => `${moduleName ?? '데이터'} 생성하기`,
    description: `내용 입력 후 저장 버튼을 클릭하세요.`,
  },
  modify: {
    title: (moduleName?: string) => `${moduleName ?? '데이터'} 수정하기`,
    description: `수정 후 저장 버튼을 클릭하세요.`,
  },
  view: {
    title: (moduleName?: string) => `${moduleName ?? '데이터'} 상세 보기`,
    description: `해당 데이터의 상세 내용입니다.`,
  },
  clone: {
    title: (moduleName?: string) => `${moduleName ?? '데이터'} 복제하기`,
    description: `복제된 내용을 확인하고 저장하세요.`,
  },
};

const SIZES = {
  sm: 'md:max-w-lg',
  md: 'md:max-w-xl',
  lg: 'md:max-w-2xl',
  xl: 'md:max-w-3xl',
  '2xl': 'md:max-w-5xl',
  full: 'md:max-w-[92vw]',
};

export function ManageSheet<T extends { files?: DbFilesJSONB }>({
  fetchFn,
  additionalDateFields,
  formComponent: FormComponent,
  viewComponent: ViewComponent,
  moduleName,
  size = 'md',
  customVariant,
}: ManageSheetProps<T>) {
  const manageSheet = useManageSheet();
  const { id, mode } = manageSheet.data ?? {};
  const isOpen = manageSheet.data !== null;

  // 데이터 페칭 (useManageItemData 내부에서 id 없으면 자동 skip)
  const { prevValues, isLoading, error, refetch } = useManageItemData(fetchFn, {
    additionalDateFields,
  });

  const dataContextValue: ManageSheetDataContextType = {
    prevValues,
    isLoading,
    error,
    refetch,
  };

  // 렌더링 로직
  const renderContent = () => {
    // create 모드: FormComponent가 있을 때만 렌더링
    if (mode === 'create') {
      return FormComponent ? <FormComponent id={id} prevValues={null} /> : null;
    }

    // 로딩 중
    if (isLoading) {
      return <FormSkeleton />;
    }

    // 에러
    if (error) {
      return <ManageSheetError />;
    }

    // modify 모드: FormComponent가 있을 때만 렌더링
    if (mode === 'modify') {
      return FormComponent ? <FormComponent id={id} prevValues={prevValues ?? null} /> : null;
    }

    // clone 모드: 원본 데이터를 가져와서 id 없이 생성 폼에 주입
    if (mode === 'clone') {
      return FormComponent ? (
        <FormComponent id={undefined} prevValues={prevValues ?? null} />
      ) : null;
    }

    // view 모드: 뷰 표시
    if (mode === 'view' && ViewComponent && prevValues) {
      return <ViewComponent data={prevValues} />;
    }

    return null;
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && manageSheet.closeWithGuard()}>
      <SheetContent className={cn(SIZES[size], 'w-[440px] max-w-full md:w-full md:rounded-l-xl')}>
        <ManageSheetDataContext.Provider value={dataContextValue}>
          {!error && (
            <SheetHeader className="border-b md:p-8 md:pb-4 gap-0.5">
              {mode && (
                <>
                  <SheetTitle className="text-lg">
                    {customVariant?.[mode]?.title?.(moduleName) ?? VARIANTS[mode].title(moduleName)}
                  </SheetTitle>
                  <SheetDescription className="text-sm">
                    {customVariant?.[mode]?.description ?? VARIANTS[mode].description}
                  </SheetDescription>
                </>
              )}
            </SheetHeader>
          )}
          <SheetBody
            className={cn(
              'md:px-8 md:pt-8 [&_.manage-sheet-footer]:md:-mx-8 [&_.manage-sheet-footer]:-mx-4 flex flex-col flex-1 min-h-0 [&_form]:flex-1 [&_form]:flex [&_form]:flex-col [&_form]:min-h-0 [&_form]:space-y-6',
              error && 'pt-0 md:pt-0'
            )}
          >
            {renderContent()}
          </SheetBody>
        </ManageSheetDataContext.Provider>
      </SheetContent>
    </Sheet>
  );
}

export function ManageSheetFooter({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <SheetFooter
      className={cn(
        'manage-sheet-footer border-t py-4 md:px-8 sticky bottom-0 bg-background md:rounded-b-xl z-99999 mt-auto',
        'flex-row justify-end md:gap-1',
        '[&_button]:w-full [&_button]:flex-1',
        '[&_button]:md:max-w-28',
        className
      )}
    >
      {children}
    </SheetFooter>
  );
}
