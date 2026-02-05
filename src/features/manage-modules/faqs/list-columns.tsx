import { format } from 'date-fns';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/shared/ui/badge';
import { Separator } from '@/shared/ui/separator';
import { ModifyButton, SoftDeleteButton } from '../_base/ui';

import { CONFIG } from './config';
import { type ItemDTO } from './config';

export const listColumns: ColumnDef<ItemDTO>[] = [
  {
    accessorKey: 'category',
    header: '카테고리',
    size: 100,
    cell: ({ row }) => {
      const { category } = row.original;
      const categoryLabel = CONFIG.categoryOptions.find(
        option => option.value === category
      )?.label;

      return <Badge variant="secondary">{categoryLabel}</Badge>;
    },
  },
  {
    accessorKey: 'question',
    header: '질문',
    meta: {
      className: 'text-left',
      truncate: true,
    },
  },
  {
    accessorKey: 'author',
    header: '작성자',
    size: 120,
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
      const { id } = row.original;
      return (
        <nav className="flex items-center justify-end gap-2">
          <ModifyButton id={id} />
          <Separator
            orientation="vertical"
            className="data-[orientation=vertical]:h-6"
          />
          <SoftDeleteButton tableName={CONFIG.tableName} id={id} />
        </nav>
      );
    },
  },
];
