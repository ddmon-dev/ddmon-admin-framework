'use client';

import { useSearchParams } from 'next/navigation';
import { DataList, useDataList } from '@/shared/ui/data-list';
import { listColumns } from './list-columns';
import { BASE_CONFIG } from '../base.config';
import { type ListProps } from '../base.types';
import { type ListItem } from './types';

export function List({ list, totalCount }: ListProps<ListItem>) {
  const searchParams = useSearchParams();
  const pageSize = Number(searchParams.get('pageSize')) || BASE_CONFIG.defaultListPageSize;

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
