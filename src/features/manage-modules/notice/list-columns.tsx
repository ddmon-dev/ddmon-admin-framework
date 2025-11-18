import { ColumnDef } from '@tanstack/react-table';
import { type ListItem } from './types';
import { ModifyButton } from '../components/modify-button';

export const listColumns: ColumnDef<ListItem>[] = [
  {
    accessorKey: 'title',
    header: '제목',
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
    size: 100,
    cell: ({ row }) => {
      const { id } = row.original;
      return <ModifyButton itemId={id} />;
    },
  },
];
