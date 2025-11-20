'use client';

import { use, createContext, useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/shared/ui/sheet';

interface ManageSheetData {
  id?: string | null;
  mode: 'view' | 'modify' | 'create';
}

interface ManageSheetContextType<T> {
  manageSheetOpen: boolean;
  setManageSheetOpen: (open: boolean) => void;
  manageSheetData: T | null;
  setManageSheetData: (data: T | null) => void;
  openManageSheet: (data: T) => void;
}

const ManageSheetContext = createContext<ManageSheetContextType<ManageSheetData>>({
  manageSheetOpen: false,
  setManageSheetOpen: () => {},
  manageSheetData: null,
  setManageSheetData: () => {},
  openManageSheet: () => {},
});

export function ManageSheetProvider({ children }: { children: React.ReactNode }) {
  const [manageSheetOpen, setManageSheetOpen] = useState(false);
  const [manageSheetData, setManageSheetData] = useState<ManageSheetData | null>(null);

  const openManageSheet = (data: ManageSheetData) => {
    setManageSheetOpen(true);
    setManageSheetData(data);
  };

  useEffect(() => {
    if (!manageSheetOpen) {
      setManageSheetData(null);
    }
  }, [manageSheetOpen]);

  return (
    <ManageSheetContext.Provider
      value={{
        manageSheetOpen,
        setManageSheetOpen,
        manageSheetData,
        setManageSheetData,
        openManageSheet,
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
  const { manageSheetOpen, setManageSheetOpen } = useManageSheet();

  return (
    <Sheet
      open={manageSheetOpen}
      onOpenChange={setManageSheetOpen}
    >
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Title</SheetTitle>
          <SheetDescription>Description</SheetDescription>
        </SheetHeader>
        {children}
      </SheetContent>
    </Sheet>
  );
}
