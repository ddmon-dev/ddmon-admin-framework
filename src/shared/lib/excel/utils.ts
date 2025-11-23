import * as XLSX from 'xlsx';
import type { ExcelOptions, ExcelColumn } from './types';

/**
 * 데이터를 엑셀 파일로 변환하여 다운로드
 */
export function exportToExcel<TData = any>(options: ExcelOptions<TData>): void {
  const {
    data,
    columns,
    sheetName = 'Sheet1',
    fileName = 'export.xlsx',
    style = {},
  } = options;

  // 1. 헤더 생성
  const headers = columns.map(col => col.header);

  // 2. 데이터 변환
  const rows = data.map(row =>
    columns.map(col => {
      if (col.accessorFn) {
        return col.accessorFn(row);
      }
      if (col.accessorKey) {
        return row[col.accessorKey];
      }
      return '';
    })
  );

  // 3. 워크시트 생성
  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);

  // 4. 컬럼 너비 설정
  ws['!cols'] = columns.map(col => ({ wch: col.width || 15 }));

  // 5. 워크북 생성 및 다운로드
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, fileName);
}
