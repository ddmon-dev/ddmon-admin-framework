import { type ExcelColumn } from '../_base/ui/export-data-button';
import { STATUS_CONFIG, type ItemDTO } from './config';

export const exportDataColumns: ExcelColumn<ItemDTO>[] = [
  {
    header: '이름',
    accessorKey: 'name',
    width: 15,
  },
  {
    header: '이메일',
    accessorKey: 'email',
    width: 25,
  },
  {
    header: '연락처',
    accessorFn: (row) => row.phone ?? '-',
    width: 15,
  },
  {
    header: '회사',
    accessorFn: (row) => row.company ?? '-',
    width: 20,
  },
  {
    header: '직책',
    accessorFn: (row) => row.position ?? '-',
    width: 15,
  },
  {
    header: '문의 내용',
    accessorKey: 'content',
    width: 50,
  },
  {
    header: '상태',
    accessorFn: (row) => STATUS_CONFIG[row.status]?.label ?? row.status,
    width: 10,
  },
  {
    header: '접수일',
    accessorFn: (row) => new Date(row.created_at).toLocaleDateString(),
    width: 15,
  },
];
