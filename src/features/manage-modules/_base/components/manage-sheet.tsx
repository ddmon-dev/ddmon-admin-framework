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
  return use(ManageSheetContext);
}

export function ManageSheet({ children }: { children: React.ReactNode }) {
  const { manageSheetData, closeManageSheet } = useManageSheet();
  const isOpen = manageSheetData !== null;

  return (
    <Sheet
      open={isOpen}
      onOpenChange={open => !open && closeManageSheet()}
    >
      <SheetContent className='max-w-4xl!'>
        <SheetHeader>
          <SheetTitle>Title</SheetTitle>
          <SheetDescription>Description</SheetDescription>
        </SheetHeader>
        <div className='overflow-y-auto'>{children}</div>
      </SheetContent>
    </Sheet>
  );
}
