'use client';

import * as React from 'react';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { SortingButton } from './sorting-button';
import { PageSizeSelect } from './page-size-select';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/shared/ui/pagination';
import { useIsMobile } from '@/shared/hooks';

interface DataListProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];

  totalCount: number;
  pageCount: number;
  currentPage?: number;
  maxVisible?: number;
  mobileMaxVisible?: number;
  onPageChange?: (page: number) => void;

  sortingKey?: string;
  onSortingChange?: (key: string) => void;

  // 선택
  onSelectionChange?: (rows: TData[]) => void;

  // 상태
  isLoading?: boolean;
  emptyMessage?: string;

  // 행 클릭
  onRowClick?: (row: TData) => void;
}

export function DataList<TData>({
  data,
  columns,
  totalCount,
  pageCount,
  currentPage = 1,
  maxVisible,
  mobileMaxVisible,
  onPageChange,
  sortingKey,
  onSortingChange,
  onSelectionChange,
  onRowClick,
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
    defaultColumn: {
      size: undefined,
    },
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

  const handleRowClick = (event: React.MouseEvent<HTMLTableRowElement>, row: TData) => {
    const eventTarget = event.target as HTMLElement;
    const preventElements = ['BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'A'];

    if (preventElements.includes(eventTarget.tagName.toUpperCase())) {
      event.stopPropagation();
      return;
    }

    onRowClick?.(row);
  };

  return (
    <div className='w-full'>
      <div className='flex items-center justify-between mb-2'>
        <span className='text-sm text-muted-foreground font-semibold'>Total ({totalCount})</span>
      </div>
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
                  onClick={event => handleRowClick(event, row.original)}
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
        <div className='sticky bottom-0 bg-background flex items-center justify-between'>
          <DataListPagination
            pageCount={pageCount}
            currentPage={currentPage}
            maxVisible={maxVisible}
            mobileMaxVisible={mobileMaxVisible}
            onPageChange={onPageChange}
          />
          <PageSizeSelect />
        </div>
      )}
    </div>
  );
}

interface DataListPaginationProps {
  pageCount: number;
  currentPage: number;
  maxVisible?: number;
  mobileMaxVisible?: number;
  onPageChange?: (page: number) => void;
}

function DataListPagination({
  pageCount,
  maxVisible = 7,
  mobileMaxVisible = 5,
  currentPage,
  onPageChange,
}: DataListPaginationProps) {
  const isMobile = useIsMobile();
  const effectiveMaxVisible = isMobile ? mobileMaxVisible : maxVisible;

  const canPreviousPage = currentPage > 1;
  const canNextPage = currentPage < pageCount;

  // 표시할 페이지 번호 계산
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];

    if (pageCount <= effectiveMaxVisible) {
      // 전체 페이지가 maxVisible 이하면 모두 표시
      for (let i = 1; i <= pageCount; i++) {
        pages.push(i);
      }
    } else {
      // effectiveMaxVisible에서 첫/마지막 페이지, ellipsis 2개 제외한 나머지를 주변 페이지로
      // effectiveMaxVisible=5: sideCount=1, effectiveMaxVisible=7: sideCount=2
      const sideCount = Math.floor((effectiveMaxVisible - 3) / 2);

      // 항상 첫 페이지 표시
      pages.push(1);

      if (currentPage > sideCount + 2) {
        pages.push('ellipsis');
      }

      // 현재 페이지 주변
      const start = Math.max(2, currentPage - sideCount);
      const end = Math.min(pageCount - 1, currentPage + sideCount);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < pageCount - sideCount - 1) {
        pages.push('ellipsis');
      }

      // 항상 마지막 페이지 표시
      pages.push(pageCount);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className='py-4'>
      <Pagination className='justify-start'>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => canPreviousPage && onPageChange?.(currentPage - 1)}
              className={!canPreviousPage ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
            />
          </PaginationItem>

          {pageNumbers.map((page, index) =>
            page === 'ellipsis' ? (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => onPageChange?.(page)}
                  isActive={page === currentPage}
                  className='cursor-pointer'
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            )
          )}

          <PaginationItem>
            <PaginationNext
              onClick={() => canNextPage && onPageChange?.(currentPage + 1)}
              className={!canNextPage ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
