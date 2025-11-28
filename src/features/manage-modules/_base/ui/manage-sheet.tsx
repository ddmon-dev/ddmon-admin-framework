'use client';

import { use, createContext, useState } from 'react';
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
import { ManageSheetError } from './manage-sheet-error';

interface ManageSheetData {
  id?: string;
  mode: 'view' | 'modify' | 'create';
}

interface ManageSheetContextType {
  manageSheetData: ManageSheetData | null;
  openManageSheet: (data: ManageSheetData) => void;
  closeManageSheet: () => void;
}

const ManageSheetContext = createContext<ManageSheetContextType>({
  manageSheetData: null,
  openManageSheet: () => {},
  closeManageSheet: () => {},
});

export function ManageSheetProvider({ children }: { children: React.ReactNode }) {
  const [manageSheetData, setManageSheetData] = useState<ManageSheetData | null>(null);

  const openManageSheet = (data: ManageSheetData) => {
    setManageSheetData(data);
  };

  const closeManageSheet = () => {
    setManageSheetData(null);
  };

  return (
    <ManageSheetContext.Provider
      value={{
        manageSheetData,
        openManageSheet,
        closeManageSheet,
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
    close: context.closeManageSheet,
  };
}

interface ManageSheetProps<T extends { files?: DbFilesJSONB }> {
  fetchFn: GetItemAction<T>;
  additionalDateFields?: string[];
  formComponent: React.ComponentType<{ id?: string; prevValues: T | null }>;
  viewComponent?: React.ComponentType<{ data: T }>;
  size?: 'sm' | 'md' | 'lg';
}

const VARIANTS = {
  create: {
    title: '데이터 생성하기',
    description: '새로운 데이터를 생성합니다. 입력 후 저장 버튼을 클릭하세요.',
  },
  modify: {
    title: '데이터 수정하기',
    description: '기존 데이터를 수정합니다. 입력 후 저장 버튼을 클릭하세요.',
  },
  view: {
    title: '데이터 상세 보기',
    description: '기존 데이터를 상세 보여줍니다.',
  },
};

const SIZES = {
  sm: 'md:max-w-lg',
  md: 'md:max-w-xl',
  lg: 'md:max-w-2xl',
};

export function ManageSheet<T extends { files?: DbFilesJSONB }>({
  fetchFn,
  additionalDateFields,
  formComponent: FormComponent,
  viewComponent: ViewComponent,
  size = 'md',
}: ManageSheetProps<T>) {
  const manageSheet = useManageSheet();
  const { id, mode } = manageSheet.data ?? {};
  const isOpen = manageSheet.data !== null;

  // 데이터 페칭 (useManageItemData 내부에서 id 없으면 자동 skip)
  const { prevValues, isLoading, error } = useManageItemData(fetchFn, {
    additionalDateFields,
  });

  // 렌더링 로직
  const renderContent = () => {
    // create 모드: 바로 폼 표시 (깜빡임 없음)
    if (mode === 'create') {
      return (
        <FormComponent
          id={id}
          prevValues={null}
        />
      );
    }

    // 로딩 중
    if (isLoading) {
      return <FormSkeleton />;
    }

    // 에러
    if (error) {
      return <ManageSheetError error={error} />;
    }

    // modify 모드: 폼 표시
    if (mode === 'modify') {
      return (
        <FormComponent
          id={id}
          prevValues={prevValues ?? null}
        />
      );
    }

    // view 모드: 뷰 표시
    if (mode === 'view' && ViewComponent && prevValues) {
      return <ViewComponent data={prevValues} />;
    }

    return null;
  };

  return (
    <Sheet
      open={isOpen}
      onOpenChange={open => !open && manageSheet.close()}
    >
      <SheetContent className={cn(SIZES[size], 'w-[440px] max-w-full md:w-full md:rounded-l-xl')}>
        <SheetHeader className='border-b'>
          {mode && (
            <>
              <SheetTitle>{VARIANTS[mode].title}</SheetTitle>
              <SheetDescription>{VARIANTS[mode].description}</SheetDescription>
            </>
          )}
        </SheetHeader>
        <SheetBody className='md:px-8 md:pt-8 [&_.manage-sheet-footer]:md:-mx-8 [&_.manage-sheet-footer]:-mx-4'>
          {renderContent()}
        </SheetBody>
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
        'manage-sheet-footer border-t py-4 sticky bottom-0 bg-background md:rounded-b-xl z-50',
        'flex-row justify-end md:gap-1',
        '[&_button]:w-full [&_button]:flex-1',
        '[&_button]:md:max-w-40',
        className
      )}
    >
      {children}
    </SheetFooter>
  );
}
