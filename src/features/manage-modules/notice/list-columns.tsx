import { ColumnDef } from '@tanstack/react-table';
import { ModifyButton } from '../_base/components/modify-button';
import { SoftDeleteItemButton, HardDeleteItemButton } from './delete-item-button';
import { type ItemDTO } from './types';

export const listColumns: ColumnDef<ItemDTO>[] = [
  {
    accessorKey: 'title',
    header: '제목',
    size: 400,
    cell: ({ row }) => {
      const notice = row.original;
      const isNotice = notice.category === 'notice';

      return (
        <>
          {isNotice && <strong className='text-primary mr-1'>[공지]</strong>}
          {notice.title}
        </>
      );
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
          <ModifyButton itemId={id} />
          <SoftDeleteItemButton itemId={id} />
          <HardDeleteItemButton itemId={id} />
        </nav>
      );
    },
  },
];
