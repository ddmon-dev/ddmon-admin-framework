import { SearchBar, CategoryButtonGroup } from '@/shared/ui/data-list';

const CATEGORY_OPTIONS = [
  { value: 'notice', label: '공지' },
  { value: 'normal', label: '일반' },
] as const;

export function ListFilters() {
  return (
    <div className='flex justify-between gap-2'>
      <CategoryButtonGroup options={[...CATEGORY_OPTIONS]} />
      <SearchBar />
    </div>
  );
}
