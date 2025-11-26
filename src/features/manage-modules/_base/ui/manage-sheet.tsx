'use client';

import { use, createContext, useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/shared/ui/sheet';

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

export function ManageSheet({ children }: { children: React.ReactNode }) {
  const manageSheet = useManageSheet();
  const isOpen = manageSheet.data !== null;

  return (
    <Sheet
      open={isOpen}
      onOpenChange={open => !open && manageSheet.close()}
    >
      <SheetContent className='max-w-4xl!'>
        <SheetHeader>
          <SheetTitle>Title</SheetTitle>
          <SheetDescription>Description</SheetDescription>
        </SheetHeader>
        <div className='overflow-y-auto px-4'>{children}</div>
      </SheetContent>
    </Sheet>
  );
}
