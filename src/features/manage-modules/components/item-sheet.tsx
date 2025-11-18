'use client';

import { use, createContext, useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/shared/ui/sheet';

interface ItemSheetData {
  id: string | number;
  mode: 'view' | 'modify' | 'create';
}

interface ItemSheetContextType<T> {
  itemSheetOpen: boolean;
  setItemSheetOpen: (open: boolean) => void;
  itemSheetData: T | null;
  setItemSheetData: (data: T | null) => void;
  openItemSheet: (data: T) => void;
}

const ItemSheetContext = createContext<ItemSheetContextType<ItemSheetData>>({
  itemSheetOpen: false,
  setItemSheetOpen: () => {},
  itemSheetData: null,
  setItemSheetData: () => {},
  openItemSheet: () => {},
});

export function ItemSheetProvider({ children }: { children: React.ReactNode }) {
  const [itemSheetOpen, setItemSheetOpen] = useState(false);
  const [itemSheetData, setItemSheetData] = useState<ItemSheetData | null>(null);

  const openItemSheet = (data: ItemSheetData) => {
    setItemSheetOpen(true);
    setItemSheetData(data);
  };

  return (
    <ItemSheetContext.Provider
      value={{
        itemSheetOpen,
        setItemSheetOpen,
        itemSheetData,
        setItemSheetData,
        openItemSheet,
      }}
    >
      {children}
    </ItemSheetContext.Provider>
  );
}

export function useItemSheet() {
  return use(ItemSheetContext);
}

export function ItemSheet() {
  const { itemSheetOpen, setItemSheetOpen } = useItemSheet();

  return (
    <Sheet
      open={itemSheetOpen}
      onOpenChange={setItemSheetOpen}
    >
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Title</SheetTitle>
          <SheetDescription>Description</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
