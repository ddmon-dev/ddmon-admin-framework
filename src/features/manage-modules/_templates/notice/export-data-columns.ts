import { type ExcelColumn } from '../../_base/ui/export-data-button';
import { type ItemDTO } from './config';

export const exportDataColumns: ExcelColumn<ItemDTO>[] = [
  {
    header: '카테고리',
    accessorKey: 'category',
    width: 15,
  },
  {
    header: '제목',
    accessorKey: 'title',
    width: 40,
  },
  {
    header: '조회수',
    accessorKey: 'view_count',
    width: 10,
  },
  {
    header: '작성일',
    accessorFn: row => new Date(row.created_at).toLocaleDateString(),
    width: 15,
  },
];
