'use client';

import { ManageList, useManageSheet } from '../../_base/ui';
import { listColumns } from './list-columns';
import { CONFIG, type ItemDTO } from './config';

interface ListProps {
  data: ItemDTO[];
  totalCount: number;
}

export function List({ data, totalCount }: ListProps) {
  const manageSheet = useManageSheet();

  const handleRowClick = (row: ItemDTO) => {
    manageSheet.open({ id: row.id, mode: 'view' });
  };

  return (
    <ManageList
      data={data}
      totalCount={totalCount}
      listColumns={listColumns}
      tableName={CONFIG.tableName}
      enableBulkAction={CONFIG.enableBulkAction}
      onRowClick={handleRowClick}
    />
  );
}
