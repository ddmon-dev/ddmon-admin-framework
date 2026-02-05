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
import type { ManageSheetMode } from '../types';
import { useManageSheet } from './manage-sheet';
import { BulkActionBar } from './bulk-action-bar';
import { SortOrderButtons } from './sort-order-buttons';

interface ManageListProps<TData extends { id?: string; order?: number }> {
  data: TData[];
  totalCount: number;
  listColumns: ColumnDef<TData>[];
  tableName?: TableName;
  onRowClick?: (row: TData) => void;
  /** 행 클릭 시 시트 모드 (기본값: 'modify') */
  rowClickMode?: ManageSheetMode;
  enableBulkAction?: boolean;
  /** 순서 변경 기능 활성화 */
  enableSortOrder?: boolean;
  /** 특정 searchParams가 있을 때 순서 버튼 숨김 (예: ['search']) */
  hideSortOrderWhen?: string[];
  /** 목록 정렬 방향 (기본값: 'desc') */
  sortDirection?: 'asc' | 'desc';
}

export function ManageList<TData extends { id?: string; order?: number }>({
  data,
  totalCount,
  listColumns,
  tableName,
  onRowClick,
  rowClickMode = 'modify',
  enableBulkAction = false,
  enableSortOrder = false,
  hideSortOrderWhen = [],
  sortDirection = 'desc',
}: ManageListProps<TData>) {
  const manageSheet = useManageSheet();
  const searchParams = useSearchParams();
  const [selectedRows, setSelectedRows] = useState<TData[]>([]);
  const [selectionKey, setSelectionKey] = useState(0);
  const [isSorting, setIsSorting] = useState(false);
  const isInitialMount = useRef(true);

  // 순서 버튼 표시 조건: enableSortOrder && hideSortOrderWhen에 해당하는 파라미터 값이 없어야 함
  const shouldShowSortOrder = useMemo(() => {
    if (!enableSortOrder || !tableName) return false;
    // 파라미터가 존재하고 값이 비어있지 않을 때만 숨김
    return !hideSortOrderWhen.some(param => {
      const value = searchParams.get(param);
      return value !== null && value !== '';
    });
  }, [enableSortOrder, tableName, hideSortOrderWhen, searchParams]);

  // 컬럼 처리: selection + sortOrder + listColumns
  const processedColumns = useMemo(() => {
    let columns: ColumnDef<TData>[] = [...listColumns];

    // 순서 변경 컬럼 추가 (맨 앞)
    if (shouldShowSortOrder && tableName) {
      const sortOrderColumn: ColumnDef<TData> = {
        id: 'sortOrder',
        header: '순서',
        size: 80,
        cell: ({ row }) => {
          const item = row.original;
          const index = row.index;
          const isFirst = index === 0;
          const isLast = index === data.length - 1;

          return (
            <SortOrderButtons
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
      columns = [sortOrderColumn, ...columns];
    }

    // selection 컬럼 추가 (맨 앞)
    if (enableBulkAction) {
      columns = [createSelectionColumn<TData>(), ...columns];
    }

    return columns;
  }, [
    listColumns,
    enableBulkAction,
    shouldShowSortOrder,
    tableName,
    data.length,
    sortDirection,
    isSorting,
  ]);

  // 데이터 변경 시 선택 상태 초기화 (페이지 전환, 검색 등)
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
