import { format } from 'date-fns';
import { ColumnDef } from '@tanstack/react-table';
import { RowActions } from '../_base/ui';
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
      const { id } = row.original;
      return (
        <RowActions
          type="buttons"
          id={id}
          tableName={CONFIG.tableName}
          actions={[{ action: 'view', label: '자세히보기' }, 'delete']}
        />
      );
    },
  },
];
