import { type ExcelColumn } from '../../_base/ui/export-data-button';
import { type ItemDTO } from './config';

export const exportDataColumns: ExcelColumn<ItemDTO>[] = [
  {
    header: '제목',
    accessorKey: 'title',
    width: 40,
  },
  {
    header: '조회수',
    accessorKey: 'viewCount',
    width: 10,
  },
  {
    header: '작성일',
    accessorFn: row => new Date(row.createdAt).toLocaleDateString(),
    width: 15,
  },
];
