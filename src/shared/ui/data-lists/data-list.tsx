'use client';

import * as React from 'react';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { SortingButton } from './sorting-button';
import { DataListPagination } from './data-list-pagination';

interface DataListProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];

  // 페이지네이션
  pageCount: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;

  // 정렬
  sortingKey?: string;
  onSortingChange?: (key: string) => void;

  // 선택
  onSelectionChange?: (rows: TData[]) => void;

  // 상태
  isLoading?: boolean;
  emptyMessage?: string;
}

export function DataList<TData>({
  data,
  columns,
  pageCount,
  currentPage = 1,
  onPageChange,
  sortingKey,
  onSortingChange,
  onSelectionChange,
  isLoading,
  emptyMessage = '데이터가 없습니다.',
}: DataListProps<TData>) {
  const [rowSelection, setRowSelection] = React.useState({});

  // enableSorting이 true인 컬럼에 자동으로 SortingButton 적용
  const processedColumns = React.useMemo(() => {
    return columns.map(col => {
      if (col.enableSorting && typeof col.header === 'string' && 'accessorKey' in col) {
        const columnKey = col.accessorKey as string;
        const headerText = col.header;

        return {
          ...col,
          header: () => (
            <SortingButton
              columnKey={columnKey}
              currentSortKey={sortingKey}
              onSort={onSortingChange}
            >
              {headerText}
            </SortingButton>
          ),
        };
      }
      return col;
    });
  }, [columns, sortingKey, onSortingChange]);

  const table = useReactTable({
    data,
    columns: processedColumns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
  });

  // 선택된 행이 변경될 때 콜백 호출
  React.useEffect(() => {
    if (onSelectionChange) {
      const selectedRows = table.getFilteredSelectedRowModel().rows.map(row => row.original);
      onSelectionChange(selectedRows);
    }
  }, [rowSelection, table, onSelectionChange]);

  return (
    <div className='w-full'>
      <div className='overflow-hidden rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  const size = header.column.columnDef.size;
                  return (
                    <TableHead
                      key={header.id}
                      style={size ? { width: size } : undefined}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  로딩 중...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map(cell => {
                    const size = cell.column.columnDef.size;
                    return (
                      <TableCell
                        key={cell.id}
                        style={size ? { width: size } : undefined}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {pageCount > 0 && (
        <div className='sticky bottom-0 bg-background'>
          <DataListPagination
            pageCount={pageCount}
            currentPage={currentPage}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}
