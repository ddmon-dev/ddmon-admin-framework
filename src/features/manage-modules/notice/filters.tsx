import { SearchBar, CategoryButtonGroup } from '@/shared/ui/data-list';
import { CONFIG } from './config';

export function Filters() {
  return (
    <div className='flex justify-between gap-2'>
      <CategoryButtonGroup options={[...CONFIG.categoryOptions]} />
      <SearchBar />
    </div>
  );
}
