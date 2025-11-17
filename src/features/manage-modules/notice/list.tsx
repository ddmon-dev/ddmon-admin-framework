'use client';

import { DataList, useDataListParams } from '@/shared/ui/data-list';
import { Row } from './types';
import { columns } from './columns';
import { PAGE_SIZE } from './constants';

interface ListProps {
  data: Row[];
  totalCount: number;
  pageSize?: number;
}

export function List({ data, totalCount, pageSize = PAGE_SIZE }: ListProps) {
  const { page, sort, setPage, setSort } = useDataListParams();
  const pageCount = Math.ceil(totalCount / pageSize);

  return (
    <DataList
      data={data}
      columns={columns}
      pageCount={pageCount}
      currentPage={page}
      onPageChange={setPage}
      sortingKey={sort}
      onSortingChange={setSort}
    />
  );
}
