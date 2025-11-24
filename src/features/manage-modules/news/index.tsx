import { type SearchParams } from '@/shared/types/search-params';

import { ManageContainer, CreateButton } from '../_base/ui';

import { CONFIG } from './config';
import { Filters } from './filters';
import { List } from './list';
import { ItemSheet } from './item-sheet';

import { getList } from './actions/get-list';

interface Props {
  searchParams: SearchParams;
}

export default async function ManageModule({ searchParams }: Props) {
  const params = await searchParams;
  const result = await getList(params);

  if (!result.success) {
    throw new Error(result.error);
  }

  const { data, totalCount } = result.data;

  return (
    <ManageContainer>
      <div className='space-y-4'>
        <div className='flex justify-between items-center'>
          <h1 className='text-2xl font-bold'>{CONFIG.moduleName} 관리</h1>
          <CreateButton>{CONFIG.moduleName} 생성</CreateButton>
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
