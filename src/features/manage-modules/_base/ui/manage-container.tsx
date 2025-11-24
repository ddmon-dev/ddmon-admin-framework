import { ManageSheetProvider } from './manage-sheet';

export function ManageContainer({ children }: { children: React.ReactNode }) {
  return <ManageSheetProvider>{children}</ManageSheetProvider>;
}
