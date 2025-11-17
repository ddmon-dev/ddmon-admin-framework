import { type SearchParams } from '@/shared/type';
import { List, getList, Filters } from '@/features/manage-modules/notice';

interface PageProps {
  searchParams: SearchParams;
}

export default async function ManageNoticePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const { data, totalCount } = await getList(params);

  return (
    <div className='space-y-4'>
      <Filters />
      <List
        data={data}
        totalCount={totalCount}
      />
    </div>
  );
}
