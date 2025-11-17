'use client';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/shared/ui/pagination';

interface DataListPaginationProps {
  pageCount: number;
  currentPage: number;
  onPageChange?: (page: number) => void;
}

export function DataListPagination({
  pageCount,
  currentPage,
  onPageChange,
}: DataListPaginationProps) {
  const canPreviousPage = currentPage > 1;
  const canNextPage = currentPage < pageCount;

  // 표시할 페이지 번호 계산
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    const maxVisible = 5;

    if (pageCount <= maxVisible) {
      // 전체 페이지가 5개 이하면 모두 표시
      for (let i = 1; i <= pageCount; i++) {
        pages.push(i);
      }
    } else {
      // 항상 첫 페이지 표시
      pages.push(1);

      if (currentPage > 3) {
        pages.push('ellipsis');
      }

      // 현재 페이지 주변
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(pageCount - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < pageCount - 2) {
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
      <Pagination className='justify-end'>
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
