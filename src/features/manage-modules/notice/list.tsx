'use client';

import { ManageList } from '../_base/components';
import { listColumns } from './list-columns';
import { type ItemDTO } from './types';

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
