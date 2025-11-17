'use client';

import {
  DataList,
  useDataListParams,
  SearchBar,
  CategoryButtonGroup,
} from '@/shared/ui/data-lists';

export default function ManageNoticePage() {
  const { page, sort, search, category, setPage, setSort } = useDataListParams();

  return (
    <div className='space-y-4'>
      <div className='flex gap-2'>
        <SearchBar />
        <CategoryButtonGroup
          options={[
            { value: 'notice', label: '공지' },
            { value: 'normal', label: '일반' },
          ]}
        />
      </div>
      <DataList
        data={[]}
        columns={[]}
        pageCount={0}
        currentPage={page}
        onPageChange={setPage}
        sortingKey={sort}
        onSortingChange={setSort}
      />
    </div>
  );
}
