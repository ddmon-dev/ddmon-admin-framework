'use client';

import { ExportDataButton as BaseExportDataButton } from '../_base/ui/export-data-button';
import { type ItemDTO } from './config';
import { exportDataColumns } from './export-data-columns';
import { getExportData } from './actions/get-export-data';

export function ExportDataButton() {
  return (
    <BaseExportDataButton<ItemDTO>
      fetchDataFn={() => getExportData()}
      columns={exportDataColumns}
      fileName='템플릿데이터'
    >
      엑셀로 내보내기
    </BaseExportDataButton>
  );
}
