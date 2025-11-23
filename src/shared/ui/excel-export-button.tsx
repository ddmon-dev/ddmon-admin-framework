'use client';

import { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { exportToExcel, type ExcelColumn } from '@/shared/lib/excel';

interface ExcelExportButtonProps<TData = any> {
  /** 서버에서 데이터를 가져오는 함수 (필수) */
  fetchData: () => Promise<TData[]>;
  /** 엑셀 컬럼 설정 */
  columns: ExcelColumn<TData>[];
  /** 파일명 (기본: 'export.xlsx') */
  fileName?: string;
  /** 시트명 (기본: 'Sheet1') */
  sheetName?: string;
  /** 버튼 텍스트 */
  children?: React.ReactNode;
  /** 버튼 variant */
  variant?: 'default' | 'outline' | 'ghost' | 'secondary' | 'destructive' | 'link';
  /** 버튼 크기 */
  size?: 'default' | 'sm' | 'lg' | 'icon';
  /** 추가 className */
  className?: string;
}

export function ExcelExportButton<TData = any>({
  fetchData,
  columns,
  fileName = 'export.xlsx',
  sheetName = 'Sheet1',
  children = '엑셀 다운로드',
  variant = 'outline',
  size = 'default',
  className,
}: ExcelExportButtonProps<TData>) {
  const [isLoading, setIsLoading] = useState(false);

  const handleExport = async () => {
    setIsLoading(true);
    try {
      // 서버에서 데이터 페칭
      const data = await fetchData();

      // 엑셀 다운로드
      exportToExcel({
        data,
        columns,
        fileName,
        sheetName,
      });
    } catch (error) {
      console.error('엑셀 다운로드 실패:', error);
      alert('엑셀 다운로드에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleExport}
      disabled={isLoading}
      className={className}
    >
      {isLoading ? (
        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
      ) : (
        <Download className='mr-2 h-4 w-4' />
      )}
      {isLoading ? '다운로드 중...' : children}
    </Button>
  );
}
