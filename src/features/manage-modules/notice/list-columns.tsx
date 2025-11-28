import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/shared/ui/badge';
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
      const categoryLabel = CONFIG.categoryOptions.find(option => option.value === category)?.label;

      if (categoryLabel === '공지') {
        return <Badge variant='default'>{categoryLabel}</Badge>;
      }

      return <Badge variant='secondary'>{categoryLabel}</Badge>;
    },
  },
  {
    accessorKey: 'title',
    header: '제목',
    meta: {
      className: 'text-left',
    },
  },
  {
    accessorKey: 'author',
    header: '작성자',
    size: 120,
  },
  {
    accessorKey: 'createdAt',
    header: '작성일',
    size: 100,
    cell: ({ row }) => {
      const { createdAt } = row.original;
      if (!createdAt) return '-';
      const date = new Date(createdAt);
      return date.toLocaleDateString();
    },
  },
  {
    accessorKey: 'viewCount',
    header: '조회수',
    meta: {
      className: 'text-center',
    },
    size: 120,
    cell: ({ row }) => {
      const { viewCount } = row.original;
      return viewCount?.toLocaleString() ?? '-';
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
          <SoftDeleteButton
            tableName={CONFIG.tableName}
            id={id}
          />
        </nav>
      );
    },
  },
];
