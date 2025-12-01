import { type ExcelColumn } from '../../_base/ui/export-data-button';
import { type ItemDTO } from './config';

export const exportDataColumns: ExcelColumn<ItemDTO>[] = [
  {
    header: '질문',
    accessorKey: 'question',
    width: 40,
  },
  {
    header: '답변',
    accessorKey: 'answer',
    width: 40,
  },
  {
    header: '작성일',
    accessorFn: row => new Date(row.createdAt).toLocaleDateString(),
    width: 15,
  },
];
