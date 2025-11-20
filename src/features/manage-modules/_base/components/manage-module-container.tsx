import { ManageSheetProvider } from './manage-sheet';

export function ManageModuleContainer({ children }: { children: React.ReactNode }) {
  return <ManageSheetProvider>{children}</ManageSheetProvider>;
}
