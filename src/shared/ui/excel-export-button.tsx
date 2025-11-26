'use client';

import { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { Spinner } from '@/shared/ui/spinner';
import { Download } from 'lucide-react';
import { exportToExcel, type ExcelColumn } from '@/shared/lib/excel';
import { type ActionResult } from '@/shared/types/action-results';
import { delay } from '@/shared/utils/delay';
import { toast } from 'sonner';

import { SUCCESS_MESSAGES } from '@/shared/constants/success-messages';
import { GENERAL_ERRORS, CRUD_ERRORS } from '@/shared/constants/error-messages';

interface ExcelExportButtonProps<TData = any> {
  /** 서버에서 데이터를 가져오는 함수 (필수) */
  fetchData: () => Promise<ActionResult<TData[]>>;
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
  fileName,
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
      await delay(500);

      const { success, data, error } = await fetchData();

      if (!success) {
        toast.error(CRUD_ERRORS.READ_FAILED(), {
          description: error,
        });
        return;
      }

      exportToExcel({
        data,
        columns,
        fileName,
        sheetName,
      });

      toast.success(SUCCESS_MESSAGES.DOWNLOAD_SUCCESS());
    } catch (error) {
      console.error('엑셀 다운로드 실패:', error);
      toast.error(GENERAL_ERRORS.UNEXPECTED, {
        description: GENERAL_ERRORS.PLEASE_TRY_AGAIN,
      });
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
      {isLoading ? <Spinner /> : <Download />}
      {children}
    </Button>
  );
}
