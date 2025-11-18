import { ManageModuleContainer } from '@/features/manage-modules/manage-module-container';
import { type SearchParams } from '@/shared/types/search-params';
import { List, getList, ListFilters } from '@/features/manage-modules/notice';

interface PageProps {
  searchParams: SearchParams;
}

export default async function ManageNoticePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const result = await getList(params);

  if (!result.success) {
    return <div>Error: {result.error}</div>;
  }

  const { list, totalCount } = result.data;

  return (
    <ManageModuleContainer>
      <div className='space-y-4'>
        <ListFilters />
        <List
          list={list}
          totalCount={totalCount}
        />
      </div>
    </ManageModuleContainer>
  );
}
