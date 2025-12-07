import { APP_CONFIG } from '@/app.config';
import { format } from 'date-fns';
import { ColumnDef } from '@tanstack/react-table';
import { Separator } from '@/shared/ui/separator';
import { ModifyButton } from '../_base/ui';

import { type ItemDTO } from './config';
import { DeleteAdminButton } from './delete-button';

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
    accessorKey: 'superAdmin',
    header: '구분',
    size: 150,
    cell: ({ row }) => {
      const { superAdmin } = row.original;
      return superAdmin
        ? APP_CONFIG.AUTH.ADMIN_LABELS.SUPER_ADMIN
        : APP_CONFIG.AUTH.ADMIN_LABELS.ADMIN;
    },
  },
  {
    accessorKey: 'createdAt',
    header: '생성일',
    size: 120,
    cell: ({ row }) => {
      const { createdAt } = row.original;
      return format(createdAt, 'yyyy-MM-dd');
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
      const { id, superAdmin } = row.original;
      return (
        <nav className='flex items-center justify-end gap-2'>
          <ModifyButton id={id}>정보수정</ModifyButton>
          <Separator
            orientation='vertical'
            className='data-[orientation=vertical]:h-6'
          />
          <DeleteAdminButton
            id={id}
            disabled={superAdmin}
          />
        </nav>
      );
    },
  },
];
