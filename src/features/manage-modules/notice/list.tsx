'use client';

import { useSearchParams } from 'next/navigation';
import { ManageList } from '../_base/components';
import { listColumns } from './list-columns';
import { type ItemDTO } from './types';
import { ExcelExportButton } from '@/shared/ui/excel-export-button';
import { type ExcelColumn } from '@/shared/lib/excel';
import { getListForExport } from './actions/get-list-for-export';

interface ListProps {
  data: ItemDTO[];
  totalCount: number;
}

export function List({ data, totalCount }: ListProps) {
  const searchParams = useSearchParams();

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
          fetchData={async () => {
            // 현재 필터 조건 가져오기
            const search = searchParams.get('search') || '';
            const category = searchParams.get('category') || '';

            // Server Action 호출
            const result = await getListForExport({ search, category });
            if (!result.success) {
              throw new Error(result.error || '데이터 조회 실패');
            }

            return result.data || [];
          }}
          columns={excelColumns}
          fileName={`공지사항_${new Date().toLocaleDateString()}.xlsx`}
          sheetName='공지사항'
        />
      </div>

      {/* 테이블 */}
      <ManageList data={data} totalCount={totalCount} listColumns={listColumns} />
    </div>
  );
}
