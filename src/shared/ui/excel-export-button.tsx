'use client';

import { Button } from '@/shared/ui/button';
import { Download } from 'lucide-react';
import { exportToExcel, type ExcelOptions } from '@/shared/lib/excel';

interface ExcelExportButtonProps<TData = any> {
  /** 엑셀 생성 옵션 */
  options: ExcelOptions<TData>;
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
  options,
  children = '엑셀 다운로드',
  variant = 'outline',
  size = 'default',
  className,
}: ExcelExportButtonProps<TData>) {
  const handleExport = () => {
    try {
      exportToExcel(options);
    } catch (error) {
      console.error('엑셀 다운로드 실패:', error);
      alert('엑셀 다운로드에 실패했습니다.');
    }
  };

  return (
    <Button variant={variant} size={size} onClick={handleExport} className={className}>
      <Download className='mr-2 h-4 w-4' />
      {children}
    </Button>
  );
}
