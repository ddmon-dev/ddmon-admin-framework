import { ColumnDef } from '@tanstack/react-table';
import { ModifyButton, SoftDeleteButton, HardDeleteButton } from '../_base/ui';

import { CONFIG } from './config';
import { type ItemDTO } from './config';

export const listColumns: ColumnDef<ItemDTO>[] = [
  {
    accessorKey: 'name',
    header: '이름',
    size: 150,
  },
  {
    accessorKey: 'email',
    header: '이메일',
    size: 200,
  },
  {
    accessorKey: 'phone',
    header: '전화번호',
    size: 120,
    cell: ({ row }) => {
      const phone = row.getValue('phone') as string | null;
      if (!phone) return '-';

      // 전화번호 포맷팅: 01012345678 → 010-1234-5678
      if (phone.length === 11) {
        return phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
      } else if (phone.length === 10) {
        if (phone.startsWith('02')) {
          return phone.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3');
        }
        return phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
      }
      return phone;
    },
  },
  {
    accessorKey: 'age',
    header: () => <div className='text-right'>나이</div>,
    size: 80,
    cell: ({ row }) => {
      const age = row.getValue('age') as number | null;
      return <div className='text-right'>{age ?? '-'}</div>;
    },
  },
  {
    accessorKey: 'createdAt',
    header: '생성일',
    size: 120,
    cell: ({ row }) => {
      const { createdAt } = row.original;
      const date = new Date(createdAt);
      return <div className='text-right'>{date.toLocaleDateString()}</div>;
    },
  },
  {
    accessorKey: 'etc',
    header: () => <div className='text-right'>기타</div>,
    cell: ({ row }) => {
      const { id, name } = row.original;
      return (
        <nav className='flex gap-2'>
          <ModifyButton id={id} />
          <SoftDeleteButton
            tableName={CONFIG.tableName}
            id={id}
            dataLabel={name}
          />
          <HardDeleteButton
            tableName={CONFIG.tableName}
            id={id}
          />
        </nav>
      );
    },
  },
];
