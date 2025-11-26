'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { useQueryParams } from '@/shared/hooks/use-query-params';
import { DataList, useDataList } from '@/shared/ui/data-list';
import { useManageSheet } from './manage-sheet';
import { BASE_CONFIG } from '../config';

interface ManageListProps<TData extends { id?: string }> {
  data: TData[];
  totalCount: number;
  listColumns: ColumnDef<TData>[];
  onRowClick?: (row: TData) => void;
}

export function ManageList<TData extends { id?: string }>({
  data,
  totalCount,
  listColumns,
  onRowClick,
}: ManageListProps<TData>) {
  const queryParams = useQueryParams();
  const { openManageSheet } = useManageSheet();
  const pageSize = Number(queryParams.get('pageSize')) || BASE_CONFIG.defaultListPageSize;

  const { page, setPage, pageCount } = useDataList({
    totalCount,
    pageSize,
  });

  const handleRowClick = (row: TData) => {
    if (onRowClick) {
      onRowClick(row);
    } else {
      openManageSheet({ id: row.id, mode: 'modify' });
    }
  };

  return (
    <DataList
      data={data}
      columns={listColumns}
      pageCount={pageCount}
      currentPage={page}
      maxVisible={BASE_CONFIG.defaultListPaginationMaxVisible}
      onPageChange={setPage}
      onRowClick={handleRowClick}
    />
  );
}
