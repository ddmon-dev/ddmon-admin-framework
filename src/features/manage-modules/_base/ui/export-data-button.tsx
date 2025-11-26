import { ExcelExportButton } from '@/shared/ui/excel-export-button';
import { type ActionResult } from '@/shared/types/action-results';
import { type ExcelColumn } from '@/shared/lib/excel';
export { type ExcelColumn } from '@/shared/lib/excel/types';

type ExportDataButtonProps<T> = {
  fetchDataFn: () => Promise<ActionResult<T[]>>;
  columns: ExcelColumn<T>[];
  fileName?: string;
  sheetName?: string;
  children?: React.ReactNode | string;
};

export function ExportDataButton<T>({
  fetchDataFn,
  columns,
  fileName = 'export.xlsx',
  sheetName = 'Sheet1',
  children = '엑셀 다운로드',
}: ExportDataButtonProps<T>) {
  return (
    <ExcelExportButton
      fetchData={async () => {
        const result = await fetchDataFn();
        if (!result.success) {
          throw new Error(result.error || '데이터 조회 실패');
        }

        return result.data || [];
      }}
      columns={columns}
      fileName={`${fileName ? fileName : '데이터내보내기'}_${new Date().toLocaleDateString()}.xlsx`}
      sheetName={sheetName}
    >
      {children}
    </ExcelExportButton>
  );
}
