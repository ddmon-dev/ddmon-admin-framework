'use client';

import { ExcelExportButton } from '@/shared/ui/excel-export-button';
import { type ExcelColumn } from '@/shared/lib/excel';

import { ManageList } from '../_base/ui';
import { listColumns } from './list-columns';
import { type ItemDTO } from './types';
import { getExportData } from './actions/get-export-data';

interface ListProps {
  data: ItemDTO[];
  totalCount: number;
}

export function List({ data, totalCount }: ListProps) {
  // 엑셀 컬럼 정의
  const excelColumns: ExcelColumn<ItemDTO>[] = [
    {
      header: '질문',
      accessorKey: 'question',
      width: 40,
    },
    {
      header: '답변',
      accessorKey: 'answer',
      width: 15,
    },
    {
      header: '작성일',
      accessorFn: row => new Date(row.createdAt).toLocaleDateString(),
      width: 15,
    },
  ];

  return (
    <div className='space-y-4'>
      {/* 엑셀 다운로드 버튼 */}
      <div className='flex justify-end'>
        <ExcelExportButton
          fetchData={async () => {
            // Server Action 호출
            const result = await getExportData();
            if (!result.success) {
              throw new Error(result.error || '데이터 조회 실패');
            }

            return result.data || [];
          }}
          columns={excelColumns}
          fileName={`데이터내보내기_${new Date().toLocaleDateString()}.xlsx`}
          sheetName='Sheet1'
        />
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
