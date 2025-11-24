import { ColumnDef } from '@tanstack/react-table';
import { ModifyButton, SoftDeleteButton } from '../_base/ui';

import { CONFIG } from './config';
import { type ItemDTO } from './types';

export const listColumns: ColumnDef<ItemDTO>[] = [
  {
    accessorKey: 'id',
    header: '아이디',
    size: 600,
  },
  {
    accessorKey: 'name',
    header: '이름',
    size: 150,
  },
  {
    accessorKey: 'superAdmin',
    header: '구분',
    size: 150,
    cell: ({ row }) => {
      const { superAdmin } = row.original;
      return <>{superAdmin ? '최고관리자' : '일반관리자'}</>;
    },
  },
  {
    accessorKey: 'createdAt',
    header: '생성일',
    size: 200,
    cell: ({ row }) => {
      const { createdAt } = row.original;
      const date = new Date(createdAt);
      return <div>{date.toLocaleDateString()}</div>;
    },
  },
  {
    accessorKey: 'etc',
    header: () => <div className='text-right'>기타</div>,
    cell: ({ row }) => {
      const { id } = row.original;
      return (
        <nav className='flex gap-2'>
          <ModifyButton id={id}>정보수정</ModifyButton>
          <SoftDeleteButton
            tableName={CONFIG.tableName}
            id={id}
          />
        </nav>
      );
    },
  },
];
