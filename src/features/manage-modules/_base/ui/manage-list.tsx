'use client';

import { APP_CONFIG } from '@/app.config';
import { type ColumnDef } from '@tanstack/react-table';
import { DataList, useDataList } from '@/shared/ui/data-list';
import { useManageSheet } from './manage-sheet';

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
  const manageSheet = useManageSheet();

  const { page, setPage, pageCount } = useDataList({
    totalCount,
    defaultPageSize: APP_CONFIG.UI.PAGINATION.PAGE_SIZE_OPTIONS[0],
  });

  const handleRowClick = (row: TData) => {
    if (onRowClick) {
      onRowClick(row);
    } else {
      manageSheet.open({ id: row.id, mode: 'modify' });
    }
  };

  return (
    <DataList
      data={data}
      columns={listColumns}
      totalCount={totalCount}
      pageCount={pageCount}
      currentPage={page}
      maxVisible={APP_CONFIG.UI.PAGINATION.MAX_VISIBLE_PAGES}
      onPageChange={setPage}
      onRowClick={handleRowClick}
    />
  );
}
