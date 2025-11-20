'use client';

import { useSearchParams } from 'next/navigation';
import { DataList, useDataList } from '@/shared/ui/data-list';
import { listColumns } from './list-columns';
import { BASE_CONFIG } from '../_base/config';
import { type ListProps } from '../_base/types';
import { type CamelCaseRowData } from './types';
import { useManageSheet } from '../_base/components/manage-sheet';

export function List({ list, totalCount }: ListProps<CamelCaseRowData>) {
  const searchParams = useSearchParams();
  const { openManageSheet } = useManageSheet();
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
      onRowClick={row => openManageSheet({ id: row.id, mode: 'modify' })}
    />
  );
}
