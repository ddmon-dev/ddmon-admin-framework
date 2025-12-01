import { ExportDataButton } from './export-data-button';

export function HeaderAddons() {
  return (
    <div className='flex justify-between gap-2'>
      <div className='ml-auto flex items-center gap-2'>
        <ExportDataButton />
      </div>
    </div>
  );
}
