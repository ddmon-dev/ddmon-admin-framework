import { type SearchParams } from '@/shared/types/search-params';

import { ManageContainer } from '../_base/ui';

import { CONFIG, type ItemDTO } from './config';
import { HeaderAddons } from './addons';
import { List } from './list';
import { ItemSheet } from './item-sheet';

import { getList } from './actions/get-list';

interface Props {
  searchParams: SearchParams;
}

export default function ManageModule({ searchParams }: Props) {
  return (
    <ManageContainer<ItemDTO>
      moduleName={CONFIG.moduleName}
      searchParams={searchParams}
      getList={getList}
      headerAddons={<HeaderAddons />}
    >
      {({ data, totalCount }) => (
        <>
          <List
            data={data}
            totalCount={totalCount}
          />
          <ItemSheet />
        </>
      )}
    </ManageContainer>
  );
}
