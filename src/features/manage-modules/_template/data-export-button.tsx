import { ExportDataButton, type ExcelColumn } from '../_base/ui/export-data-button';
import { type ItemDTO } from './config';
import { getExportData } from './actions/get-export-data';

const excelColumns: ExcelColumn<ItemDTO>[] = [
  {
    header: '이름',
    accessorKey: 'name',
    width: 40,
  },
  {
    header: '이메일',
    accessorKey: 'email',
    width: 15,
  },
  {
    header: '전화번호',
    accessorKey: 'phone',
    width: 10,
  },
  {
    header: '우편번호',
    accessorKey: 'zipCode',
    width: 10,
  },
  {
    header: '주소',
    accessorKey: 'address',
    width: 10,
  },
  {
    header: '주소 상세',
    accessorKey: 'addressDetail',
    width: 10,
  },
  {
    header: '작성일',
    accessorFn: row => new Date(row.createdAt).toLocaleDateString(),
    width: 15,
  },
];

export function DataExportButton() {
  return (
    <ExportDataButton
      fetchDataFn={getExportData}
      columns={excelColumns}
      fileName='템플릿데이터'
    >
      엑셀 다운로드
    </ExportDataButton>
  );
}
