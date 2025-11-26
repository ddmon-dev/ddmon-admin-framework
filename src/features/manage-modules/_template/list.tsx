'use client';

import { ManageList } from '../_base/ui';
import { listColumns } from './list-columns';
import { type ItemDTO } from './config';

interface ListProps {
  data: ItemDTO[];
  totalCount: number;
}

export function List({ data, totalCount }: ListProps) {
  return (
    <ManageList
      data={data}
      totalCount={totalCount}
      listColumns={listColumns}
    />
  );
}
