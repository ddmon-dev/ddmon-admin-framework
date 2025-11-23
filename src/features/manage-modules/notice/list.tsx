'use client';

import { ManageList } from '../_base/components';
import { listColumns } from './list-columns';
import { type ItemDTO } from './types';
import { ExcelExportButton } from '@/shared/ui/excel-export-button';
import { type ExcelColumn } from '@/shared/lib/excel';

interface ListProps {
  data: ItemDTO[];
  totalCount: number;
}

export function List({ data, totalCount }: ListProps) {
  // 엑셀 컬럼 정의
  const excelColumns: ExcelColumn<ItemDTO>[] = [
    {
      header: '제목',
      accessorFn: row => {
        const isNotice = row.category === 'notice';
        return isNotice ? `[공지] ${row.title}` : row.title;
      },
      width: 40,
    },
    {
      header: '작성자',
      accessorKey: 'author',
      width: 15,
    },
    {
      header: '작성일',
      accessorFn: row => new Date(row.createdAt).toLocaleDateString(),
      width: 15,
    },
    {
      header: '조회수',
      accessorKey: 'viewCount',
      width: 10,
    },
  ];

  return (
    <div className='space-y-4'>
      {/* 엑셀 다운로드 버튼 */}
      <div className='flex justify-end'>
        <ExcelExportButton
          options={{
            data,
            columns: excelColumns,
            fileName: `공지사항_${new Date().toLocaleDateString()}.xlsx`,
            sheetName: '공지사항',
          }}
        />
      </div>

      {/* 테이블 */}
      <ManageList data={data} totalCount={totalCount} listColumns={listColumns} />
    </div>
  );
}
