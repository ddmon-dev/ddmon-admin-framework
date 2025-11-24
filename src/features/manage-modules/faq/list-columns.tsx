import { ColumnDef } from '@tanstack/react-table';
import { ModifyButton, SoftDeleteButton, HardDeleteButton } from '../_base/ui';

import { CONFIG } from './config';
import { type ItemDTO } from './config';

export const listColumns: ColumnDef<ItemDTO>[] = [
  {
    accessorKey: 'question',
    header: '질문',
    size: 600,
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
          <ModifyButton id={id} />
          <SoftDeleteButton
            tableName={CONFIG.tableName}
            id={id}
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
