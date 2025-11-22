'use client';

import { ManageList } from '../_base/components/manage-list';
import { type ItemDTO } from './types';
import { listColumns } from './list-columns';

export function List({ data, totalCount }: { data: ItemDTO[]; totalCount: number }) {
  return (
    <ManageList
      data={data}
      totalCount={totalCount}
      listColumns={listColumns}
    />
  );
}
