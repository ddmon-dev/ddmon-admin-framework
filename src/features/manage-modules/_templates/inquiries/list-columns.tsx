import { format } from 'date-fns';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/shared/ui/badge';
import { Separator } from '@/shared/ui/separator';
import { ViewButton, SoftDeleteButton } from '../../_base/ui';

import { CONFIG } from './config';
import { type ItemDTO } from './config';

const statusVariants: Record<string, 'default' | 'secondary'> = {
  pending: 'secondary',
  answered: 'default',
};

const statusLabels: Record<string, string> = {
  pending: '대기',
  answered: '답변완료',
};

export const listColumns: ColumnDef<ItemDTO>[] = [
  {
    accessorKey: 'name',
    header: '이름',
    size: 100,
  },
  {
    accessorKey: 'email',
    header: '이메일',
    meta: {
      className: 'text-left',
      truncate: true,
    },
  },
  {
    accessorKey: 'company',
    header: '회사',
    size: 150,
    cell: ({ row }) => row.original.company || '-',
  },
  {
    accessorKey: 'status',
    header: '상태',
    size: 100,
    cell: ({ row }) => {
      const { status } = row.original;
      return (
        <Badge variant={statusVariants[status] || 'secondary'}>
          {statusLabels[status] || status}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'created_at',
    header: '접수일',
    size: 120,
    cell: ({ row }) => {
      const { created_at } = row.original;
      return format(created_at, 'yyyy-MM-dd');
    },
  },
  {
    accessorKey: 'addons',
    header: '',
    meta: {
      className: 'text-right',
    },
    size: 200,
    cell: ({ row }) => {
      const { id, name } = row.original;
      return (
        <nav className='flex items-center justify-end gap-2'>
          <ViewButton id={id}>자세히보기</ViewButton>
          <Separator
            orientation='vertical'
            className='data-[orientation=vertical]:h-6'
          />
          <SoftDeleteButton
            tableName={CONFIG.tableName}
            id={id}
            dataLabel={name}
          />
        </nav>
      );
    },
  },
];
