import { type SearchParams } from '@/shared/types/search-params';

import { ManageContainer, CreateButton } from '../_base/ui';

import { CONFIG } from './config';
import { Filters } from './filters';
import { List } from './list';
import { ItemSheet } from './item-sheet';

import { getList } from './actions/get-list';
import { ExportDataButton } from './export-data-button';

interface Props {
  searchParams: SearchParams;
}

export default async function ManageModule({ searchParams }: Props) {
  const params = await searchParams;
  const { data: rawData, error } = await getList(params);
  const { data, totalCount } = rawData || { data: [], totalCount: 0 };

  if (error) {
    // 에러는 어떻게 처리할까? 그냥 콘솔로그만?
  }

  return (
    <ManageContainer>
      <div className='space-y-4'>
        <div className='flex justify-between items-center'>
          <h1 className='text-2xl font-bold'>{CONFIG.moduleName} 관리</h1>
          <CreateButton>{CONFIG.moduleName} 생성</CreateButton>
        </div>
        <Filters />
        <ExportDataButton />
        <List
          data={data}
          totalCount={totalCount}
        />
        <ItemSheet />
      </div>
    </ManageContainer>
  );
}
