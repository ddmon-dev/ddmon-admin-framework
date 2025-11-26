'use client';

import { type ItemDTO } from './config';
import { CONFIG } from './config';
import { exportDataColumns } from './export-data-columns';

import { ExportDataButton as BaseExportDataButton } from '../_base/ui/export-data-button';
import { getExportData } from '../_base/actions/get-export-data';

export function ExportDataButton() {
  return (
    <BaseExportDataButton<ItemDTO>
      fetchDataFn={() => getExportData({ tableName: CONFIG.tableName })}
      columns={exportDataColumns}
      fileName='템플릿데이터'
    >
      엑셀로 내보내기
    </BaseExportDataButton>
  );
}
