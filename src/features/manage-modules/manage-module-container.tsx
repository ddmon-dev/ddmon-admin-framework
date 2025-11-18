import { ItemSheetProvider, ItemSheet } from './components/item-sheet';

export function ManageModuleContainer({ children }: { children: React.ReactNode }) {
  return (
    <ItemSheetProvider>
      {children}
      <ItemSheet />
    </ItemSheetProvider>
  );
}
