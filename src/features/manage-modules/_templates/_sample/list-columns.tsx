import { ColumnDef } from '@tanstack/react-table';
import { formatPhoneNumber } from '@/shared/utils/formats';
import { Separator } from '@/shared/ui/separator';
import { ModifyButton, SoftDeleteButton } from '../../_base/ui';

import { CONFIG } from './config';
import { type ItemDTO } from './config';

export const listColumns: ColumnDef<ItemDTO>[] = [
  {
    accessorKey: 'name',
    header: '이름',
    meta: {
      className: 'text-left',
      truncate: true,
    },
  },
  {
    accessorKey: 'email',
    header: '이메일',
    size: 200,
    cell: ({ row }) => {
      const { email = '-' } = row.original;
      return email;
    },
  },
  {
    accessorKey: 'phone',
    header: '전화번호',
    size: 120,
    cell: ({ row }) => {
      const { phone = '-' } = row.original;
      const formattedPhone = formatPhoneNumber(phone as string);
      if (!formattedPhone) return '-';
      return formattedPhone;
    },
  },
  {
    accessorKey: 'age',
    header: '나이',
    size: 80,
    cell: ({ row }) => {
      const { age = '-' } = row.original;
      return age;
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
          <ModifyButton id={id} />
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
