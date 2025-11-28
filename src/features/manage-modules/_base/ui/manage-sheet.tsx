'use client';

import { use, createContext, useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/shared/ui/sheet';
import type { DbFilesJSONB } from '@/shared/lib/file-system';
import type { GetItemAction } from '../hooks/use-manage-item-data';
import { useManageItemData } from '../hooks/use-manage-item-data';
import { ManageSheetLoading } from './manage-sheet-loading';
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
}

export function ManageSheet<T extends { files?: DbFilesJSONB }>({
  fetchFn,
  additionalDateFields,
  formComponent: FormComponent,
  viewComponent: ViewComponent,
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
      return <ManageSheetLoading />;
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
      <SheetContent className='max-w-4xl! rounded-l-xl'>
        <SheetHeader>
          <SheetTitle>Title</SheetTitle>
          <SheetDescription>Description</SheetDescription>
        </SheetHeader>
        <div className='overflow-y-auto px-4'>{renderContent()}</div>
      </SheetContent>
    </Sheet>
  );
}
