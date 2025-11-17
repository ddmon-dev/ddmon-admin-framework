'use client';

import { useSearchParams } from 'next/navigation';
import { DataList, useDataList } from '@/shared/ui/data-list';
import { listColumns } from './list-columns';
import { DEFAULT_LIST_PAGE_SIZE } from '../base.config';
import { type ListRow } from './types';
import { type ListProps } from '../base.types';

export function List({ list, totalCount }: ListProps<ListRow>) {
  const searchParams = useSearchParams();
  const pageSize = Number(searchParams.get('pageSize')) || DEFAULT_LIST_PAGE_SIZE;

  const { page, setPage, pageCount } = useDataList({
    totalCount,
    pageSize,
  });

  return (
    <DataList
      data={list}
      columns={listColumns}
      pageCount={pageCount}
      currentPage={page}
      onPageChange={setPage}
    />
  );
}
