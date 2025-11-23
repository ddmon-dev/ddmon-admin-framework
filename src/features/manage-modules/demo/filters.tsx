import { SearchBar } from '@/shared/ui/data-list';

export function Filters() {
  return (
    <div className='flex justify-end'>
      <SearchBar placeholder='이름 또는 이메일로 검색' />
    </div>
  );
}
