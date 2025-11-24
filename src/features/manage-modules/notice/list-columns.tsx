import { ColumnDef } from '@tanstack/react-table';
import { ModifyButton, SoftDeleteButton, HardDeleteButton } from '../_base/ui';

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
      return categoryLabel;
    },
  },
  {
    accessorKey: 'title',
    header: '제목',
    size: 400,
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
      const date = new Date(createdAt);
      return <div className='text-right'>{date.toLocaleDateString()}</div>;
    },
  },
  {
    accessorKey: 'viewCount',
    header: () => <div className='text-right'>조회수</div>,
    size: 100,
    cell: ({ row }) => {
      const count = row.getValue('viewCount') as number;
      return <div className='text-right'>{count.toLocaleString()}</div>;
    },
  },
  {
    accessorKey: 'etc',
    header: () => <div className='text-right'>기타</div>,
    cell: ({ row }) => {
      const { id } = row.original;
      return (
        <nav className='flex gap-2'>
          <ModifyButton id={id} />
          <SoftDeleteButton
            tableName={CONFIG.tableName}
            id={id}
          />
          <HardDeleteButton
            tableName={CONFIG.tableName}
            id={id}
          />
        </nav>
      );
    },
  },
];
