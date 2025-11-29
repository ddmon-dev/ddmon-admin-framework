import { ColumnDef } from '@tanstack/react-table';
import { Separator } from '@/shared/ui/separator';
import { ModifyButton, SoftDeleteButton } from '../_base/ui';

import { CONFIG } from './config';
import { type ItemDTO } from './config';

export const listColumns: ColumnDef<ItemDTO>[] = [
  {
    accessorKey: 'question',
    header: '질문',
    meta: {
      className: 'text-left',
    },
  },
  {
    accessorKey: 'createdAt',
    header: '생성일',
    size: 120,
    cell: ({ row }) => {
      const { createdAt } = row.original;
      if (!createdAt) return '-';
      const date = new Date(createdAt);
      return date.toLocaleDateString();
    },
  },
  {
    accessorKey: 'etc',
    header: '기타',
    size: 120,
    meta: {
      className: 'text-right',
    },
    cell: ({ row }) => {
      const { id } = row.original;
      return (
        <nav className='flex items-center justify-end gap-2'>
          <ModifyButton id={id} />
          <Separator
            orientation='vertical'
            className='data-[orientation=vertical]:h-6'
          />
          <SoftDeleteButton
            tableName={CONFIG.tableName}
            id={id}
          />
        </nav>
      );
    },
  },
];
