'use client';

import { ManageList } from '../_base/ui';
import { listColumns } from './list-columns';
import { type ItemDTO } from './config';

import { DataExportButton } from './data-export-button';

interface ListProps {
  data: ItemDTO[];
  totalCount: number;
}

export function List({ data, totalCount }: ListProps) {
  return (
    <div className='space-y-4'>
      {/* 엑셀 다운로드 버튼 */}
      <div className='flex justify-end'>
        <DataExportButton />
      </div>

      {/* 테이블 */}
      <ManageList
        data={data}
        totalCount={totalCount}
        listColumns={listColumns}
      />
    </div>
  );
}
