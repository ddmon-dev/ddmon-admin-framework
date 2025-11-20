import { type SearchParams } from '@/shared/types/search-params';
import { ManageModuleContainer } from '@/features/manage-modules/_base/components/manage-module-container';
import { CreateButton } from '@/features/manage-modules/_base/components/create-button';
import { List, getList, ListFilters, ItemSheet } from '@/features/manage-modules/notice';

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
        <div className='flex justify-end'>
          <CreateButton>생성</CreateButton>
        </div>
        <ListFilters />
        <List
          list={list}
          totalCount={totalCount}
        />
        <ItemSheet />
      </div>
    </ManageModuleContainer>
  );
}
