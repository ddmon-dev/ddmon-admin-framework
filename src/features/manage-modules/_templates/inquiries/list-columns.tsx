import { format } from 'date-fns';
import { ColumnDef } from '@tanstack/react-table';
import { Separator } from '@/shared/ui/separator';
import { ViewButton, SoftDeleteButton } from '../../_base/ui';
import { CONFIG, type ItemDTO } from './config';
import { StatusBadge } from './status-badge';

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
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
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
