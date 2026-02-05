'use client';

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { APP_CONFIG } from '@/app.config';
import { type ColumnDef } from '@tanstack/react-table';
import {
  DataList,
  useDataList,
  createSelectionColumn,
} from '@/shared/ui/data-list';
import type { TableName } from '@/shared/lib/supabase/db-helpers';
import type { ManageSheetMode, ReorderConfig } from '../types';
import { useManageSheet } from './manage-sheet';
import { BulkActionBar } from './bulk-action-bar';
import { ReorderButtons } from './reorder-buttons';

interface ModuleConfig {
  tableName: TableName;
  enableBulkAction?: boolean;
  enableReorder?: ReorderConfig;
}

interface ManageListProps<TData extends { id?: string }> {
  data: TData[];
  totalCount: number;
  listColumns: ColumnDef<TData>[];
  config: ModuleConfig;
  onRowClick?: (row: TData) => void;
  rowClickMode?: ManageSheetMode;
}

export function ManageList<TData extends { id?: string }>({
  data,
  totalCount,
  listColumns,
  config,
  onRowClick,
  rowClickMode = 'modify',
}: ManageListProps<TData>) {
  const { tableName, enableBulkAction = false, enableReorder } = config;

  const manageSheet = useManageSheet();
  const searchParams = useSearchParams();
  const [selectedRows, setSelectedRows] = useState<TData[]>([]);
  const [selectionKey, setSelectionKey] = useState(0);
  const [isSorting, setIsSorting] = useState(false);
  const isInitialMount = useRef(true);

  // 순서 버튼 표시 조건: enableReorder가 설정되어 있고, 검색 중이 아닐 때
  const shouldShowReorder = useMemo(() => {
    if (!enableReorder) return false;
    const searchValue = searchParams.get('search');
    return !searchValue || searchValue === '';
  }, [enableReorder, searchParams]);

  const sortDirection = enableReorder === true ? 'desc' : enableReorder?.direction ?? 'desc';

  // 컬럼 처리
  const processedColumns = useMemo(() => {
    let columns: ColumnDef<TData>[] = [...listColumns];

    if (shouldShowReorder) {
      const reorderColumn: ColumnDef<TData> = {
        id: 'reorder',
        header: '순서',
        size: 80,
        cell: ({ row }) => {
          const item = row.original;
          const index = row.index;
          const isFirst = index === 0;
          const isLast = index === data.length - 1;

          return (
            <ReorderButtons
              tableName={tableName}
              id={item.id!}
              isFirst={isFirst}
              isLast={isLast}
              sortDirection={sortDirection}
              disabled={isSorting}
              onSortStart={() => setIsSorting(true)}
              onSortEnd={() => setIsSorting(false)}
            />
          );
        },
      };
      columns = [reorderColumn, ...columns];
    }

    if (enableBulkAction) {
      columns = [createSelectionColumn<TData>(), ...columns];
    }

    return columns;
  }, [
    listColumns,
    enableBulkAction,
    shouldShowReorder,
    tableName,
    data.length,
    sortDirection,
    isSorting,
  ]);

  // 데이터 변경 시 선택 상태 초기화
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (enableBulkAction && selectedRows.length > 0) {
      setSelectedRows([]);
      setSelectionKey(prev => prev + 1);
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
      manageSheet.open({ id: row.id, mode: rowClickMode });
    }
  };

  const handleSelectionChange = useCallback((rows: TData[]) => {
    setSelectedRows(rows);
  }, []);

  const handleClearSelection = useCallback(() => {
    setSelectedRows([]);
    setSelectionKey(prev => prev + 1);
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

      {enableBulkAction && (
        <BulkActionBar
          tableName={tableName}
          selectedRows={selectedRows}
          onClearSelection={handleClearSelection}
        />
      )}
    </>
  );
}
