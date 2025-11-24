import { type SearchParams } from '@/shared/types/search-params';

import { ManageContainer, CreateButton } from '../_base/ui';

import { Filters } from './filters';
import { List } from './list';
import { ItemSheet } from './item-sheet';

import { getList } from './actions/get-list';

interface Props {
  searchParams: SearchParams;
}

export async function ManageNotice({ searchParams }: Props) {
  const params = await searchParams;
  const result = await getList(params);

  if (!result.success) {
    throw new Error(result.error);
  }

  const { data, totalCount } = result.data;

  return (
    <ManageContainer>
      <div className='space-y-4'>
        <div className='flex justify-end'>
          <CreateButton>생성</CreateButton>
        </div>
        <Filters />
        <List
          data={data}
          totalCount={totalCount}
        />
        <ItemSheet />
      </div>
    </ManageContainer>
  );
}
