import { format } from 'date-fns';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/shared/ui/badge';
import { APP_CONFIG, type LangCode } from '@/app.config';
import { RowActions } from '../_base/ui';

import { CONFIG } from './config';
import { type ItemDTO } from './config';

export const listColumns: ColumnDef<ItemDTO>[] = [
  {
    accessorKey: 'lang',
    header: '언어',
    size: 80,
    cell: ({ row }) => {
      const lang = row.original.lang as LangCode;
      return <Badge variant="outline">{APP_CONFIG.LANG.LABELS[lang] ?? lang}</Badge>;
    },
  },
  {
    accessorKey: 'title',
    header: '제목',
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
    header: '작성일',
    size: 100,
    cell: ({ row }) => {
      const { created_at } = row.original;
      return format(created_at, 'yyyy-MM-dd');
    },
  },
  {
    accessorKey: 'view_count',
    header: '조회수',
    meta: {
      className: 'text-center',
    },
    size: 120,
    cell: ({ row }) => {
      const { view_count } = row.original;
      return view_count?.toLocaleString() ?? '-';
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
        <RowActions
          type="buttons"
          id={id}
          tableName={CONFIG.tableName}
          actions={['modify', 'delete']}
        />
      );
    },
  },
];
