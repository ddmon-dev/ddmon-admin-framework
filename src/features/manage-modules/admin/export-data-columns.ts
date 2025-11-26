import { type ExcelColumn } from '../_base/ui/export-data-button';
import { type ItemDTO } from './config';

export const exportDataColumns: ExcelColumn<ItemDTO>[] = [
  {
    header: '이름',
    accessorKey: 'name',
    width: 20,
  },
  {
    header: '이메일',
    accessorKey: 'email',
    width: 30,
  },
  {
    header: '아이디',
    accessorKey: 'id',
    width: 20,
  },
  {
    header: '최고관리자',
    accessorFn: row => (row.superAdmin ? 'Y' : 'N'),
    width: 15,
  },
  {
    header: '생성일',
    accessorFn: row => new Date(row.createdAt).toLocaleDateString(),
    width: 15,
  },
];
