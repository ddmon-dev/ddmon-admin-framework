import { type SearchParams } from '@/shared/type';
import { List, getList, Filters } from '@/features/manage-modules/notice';

interface PageProps {
  searchParams: SearchParams;
}

export default async function ManageNoticePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const result = await getList(params);

  if (!result.success) {
    return (
      <div className='space-y-4'>
        <Filters />
        <div className='rounded-md border border-destructive bg-destructive/10 p-4'>
          <p className='text-destructive'>데이터를 불러오는 중 오류가 발생했습니다: {result.error}</p>
        </div>
      </div>
    );
  }

  const { data, totalCount } = result.data;

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
