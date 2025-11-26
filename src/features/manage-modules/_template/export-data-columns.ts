import { type ExcelColumn } from '../_base/ui/export-data-button';
import { type ItemDTO } from './config';

export const exportDataColumns: ExcelColumn<ItemDTO>[] = [
  {
    header: '이름',
    accessorKey: 'name',
    width: 40,
  },
  {
    header: '이메일',
    accessorKey: 'email',
    width: 15,
  },
  {
    header: '전화번호',
    accessorKey: 'phone',
    width: 10,
  },
  {
    header: '우편번호',
    accessorKey: 'zipCode',
    width: 10,
  },
  {
    header: '주소',
    accessorKey: 'address',
    width: 10,
  },
  {
    header: '주소 상세',
    accessorKey: 'addressDetail',
    width: 10,
  },
  {
    header: '작성일',
    accessorFn: row => new Date(row.createdAt).toLocaleDateString(),
    width: 15,
  },
];
