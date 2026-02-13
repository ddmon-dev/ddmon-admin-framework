import { APP_CONFIG } from '@/app.config';
import { format } from 'date-fns';
import { ColumnDef } from '@tanstack/react-table';

import { type ItemDTO } from './config';
import { AdminRowActions } from './admin-row-actions';

export const listColumns: ColumnDef<ItemDTO>[] = [
  {
    accessorKey: 'id',
    header: '아이디',
    meta: {
      className: 'text-left',
    },
  },
  {
    accessorKey: 'name',
    header: '이름',
    size: 150,
  },
  {
    accessorKey: 'super_admin',
    header: '구분',
    size: 150,
    cell: ({ row }) => {
      const { super_admin } = row.original;
      return super_admin
        ? APP_CONFIG.AUTH.ADMIN_LABELS.SUPER_ADMIN
        : APP_CONFIG.AUTH.ADMIN_LABELS.ADMIN;
    },
  },
  {
    accessorKey: 'created_at',
    header: '생성일',
    size: 120,
    cell: ({ row }) => {
      const { created_at } = row.original;
      return format(created_at, 'yyyy-MM-dd');
    },
  },
  {
    accessorKey: 'addons',
    header: '',
    size: 120,
    meta: {
      className: 'text-right',
    },
    cell: ({ row }) => {
      const { id, super_admin } = row.original;
      return <AdminRowActions id={id} isSuperAdmin={super_admin} />;
    },
  },
];
