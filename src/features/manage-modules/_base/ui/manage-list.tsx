'use client';

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { APP_CONFIG } from '@/app.config';
import { type ColumnDef } from '@tanstack/react-table';
import { DataList, useDataList, createSelectionColumn } from '@/shared/ui/data-list';
import type { TableName } from '@/shared/lib/supabase/db-helpers';
import { useManageSheet } from './manage-sheet';
import { BulkActionBar } from './bulk-action-bar';

interface ManageListProps<TData extends { id?: string }> {
  data: TData[];
  totalCount: number;
  listColumns: ColumnDef<TData>[];
  tableName?: TableName;
  onRowClick?: (row: TData) => void;
  enableBulkAction?: boolean;
}

export function ManageList<TData extends { id?: string }>({
  data,
  totalCount,
  listColumns,
  tableName,
  onRowClick,
  enableBulkAction = false,
}: ManageListProps<TData>) {
  const manageSheet = useManageSheet();
  const [selectedRows, setSelectedRows] = useState<TData[]>([]);
  const [selectionKey, setSelectionKey] = useState(0);
  const isInitialMount = useRef(true);

  // enableBulkAction이 true면 selection column을 자동으로 맨 앞에 추가
  const processedColumns = useMemo(() => {
    if (!enableBulkAction) return listColumns;
    return [createSelectionColumn<TData>(), ...listColumns];
  }, [listColumns, enableBulkAction]);

  // 데이터 변경 시 선택 상태 초기화 (페이지 전환, 검색 등)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (enableBulkAction && selectedRows.length > 0) {
      setSelectedRows([]);
      setSelectionKey((prev) => prev + 1);
    }
  }, [data, enableBulkAction]);

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

  const handleSelectionChange = useCallback((rows: TData[]) => {
    setSelectedRows(rows);
  }, []);

  const handleClearSelection = useCallback(() => {
    setSelectedRows([]);
    setSelectionKey((prev) => prev + 1);
  }, []);

  return (
    <>
      <DataList
        key={enableBulkAction ? selectionKey : undefined}
        data={data}
        columns={processedColumns}
        totalCount={totalCount}
        pageCount={pageCount}
        currentPage={page}
        maxVisible={APP_CONFIG.UI.PAGINATION.MAX_VISIBLE_PAGES}
        onPageChange={setPage}
        onRowClick={handleRowClick}
        onSelectionChange={enableBulkAction ? handleSelectionChange : undefined}
      />

      {enableBulkAction && tableName && (
        <BulkActionBar
          tableName={tableName}
          selectedRows={selectedRows}
          onClearSelection={handleClearSelection}
        />
      )}
    </>
  );
}
