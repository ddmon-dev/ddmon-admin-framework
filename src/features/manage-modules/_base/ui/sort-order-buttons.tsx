'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import type { TableName } from '@/shared/lib/supabase/db-helpers';
import { Button } from '@/shared/ui/button';
import { Spinner } from '@/shared/ui/spinner';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { moveSortOrder } from '../actions/move-sort-order';

interface SortOrderButtonsProps {
  tableName: TableName;
  id: string;
  isFirst: boolean;
  isLast: boolean;
  /** 목록 정렬 방향 (기본값: 'desc') */
  sortDirection?: 'asc' | 'desc';
  /** 전역 로딩 상태 (다른 항목이 순서 변경 중일 때 비활성화) */
  disabled?: boolean;
  /** 순서 변경 시작 콜백 */
  onSortStart?: () => void;
  /** 순서 변경 완료 콜백 */
  onSortEnd?: () => void;
}

export function SortOrderButtons({
  tableName,
  id,
  isFirst,
  isLast,
  sortDirection = 'desc',
  disabled = false,
  onSortStart,
  onSortEnd,
}: SortOrderButtonsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 현재 필터 조건 추출
  const filters: Record<string, string> = {};
  const category = searchParams.get('category');

  if (category) filters.category = category;

  const handleMove = async (direction: 'up' | 'down') => {
    onSortStart?.();
    try {
      const result = await moveSortOrder({
        tableName,
        id,
        direction,
        pathname,
        filters,
        sortDirection,
      });
      if (!result.success) {
        toast.error(result.error);
      }
    } finally {
      onSortEnd?.();
    }
  };

  return (
    <div className="inline-flex flex-row">
      <Button
        variant="outline"
        size="icon-sm"
        className="size-7! rounded-l-[10px]! rounded-r-none border-r-0"
        onClick={() => handleMove('up')}
        disabled={disabled || isFirst}
      >
        {disabled ? (
          <Spinner className="size-[12px]!" />
        ) : (
          <ChevronUp className="size-[12px]!" />
        )}
      </Button>
      <Button
        variant="outline"
        size="icon-sm"
        className="size-7! rounded-l-none rounded-r-[10px]!"
        onClick={() => handleMove('down')}
        disabled={disabled || isLast}
      >
        {disabled ? (
          <Spinner className="size-[12px]!" />
        ) : (
          <ChevronDown className="size-[12px]!" />
        )}
      </Button>
    </div>
  );
}
