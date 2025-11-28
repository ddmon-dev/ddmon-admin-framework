import { CONFIG } from './config';
import { ExportDataButton } from './export-data-button';
import { CategoryButtonGroup } from '@/shared/ui/data-list';

export function HeaderAddons() {
  return (
    <div className='flex items-center justify-start gap-2'>
      <CategoryButtonGroup options={[...CONFIG.categoryOptions]} />
      <ExportDataButton />
    </div>
  );
}
