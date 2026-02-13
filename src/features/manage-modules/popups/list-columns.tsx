import { format } from 'date-fns';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/shared/ui/badge';
import { RowActions } from '../_base/ui';

import { CONFIG } from './config';
import { type ItemDTO } from './config';

export const listColumns: ColumnDef<ItemDTO>[] = [
  {
    accessorKey: 'title',
    header: '제목',
    meta: {
      className: 'text-left',
      truncate: true,
    },
  },
  {
    accessorKey: 'is_active',
    header: '상태',
    size: 100,
    cell: ({ row }) => {
      const { is_active } = row.original;
      return is_active ? (
        <Badge variant="default">노출</Badge>
      ) : (
        <Badge variant="secondary">비노출</Badge>
      );
    },
  },
  {
    accessorKey: 'period',
    header: '노출 기간',
    size: 200,
    cell: ({ row }) => {
      const { is_always, start_date, end_date } = row.original;
      if (is_always) return <Badge variant="outline">항시노출</Badge>;
      if (!start_date && !end_date) return '-';
      const start = start_date
        ? format(start_date, 'yyyy-MM-dd')
        : '시작일 없음';
      const end = end_date ? format(end_date, 'yyyy-MM-dd') : '종료일 없음';
      return `${start} ~ ${end}`;
    },
  },
  {
    accessorKey: 'z_index',
    header: '팝업레이어 순서',
    size: 80,
    cell: ({ row }) => {
      const { z_index } = row.original;
      return z_index;
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
          actions={['modify', 'delete']}
        />
      );
    },
  },
];
