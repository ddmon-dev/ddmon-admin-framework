'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/shared/lib/supabase/server';
import { createServerAction } from '@/features/utils/server-actions';
import { Result } from '@/shared/utils/results';
import type { TableName } from '@/shared/lib/supabase/db-helpers';

interface MoveSortOrderParams {
  tableName: TableName;
  id: string;
  direction: 'up' | 'down';
  pathname: string;
  filters?: Record<string, string>;
  /** 목록 정렬 방향 (기본값: 'desc') */
  sortDirection?: 'asc' | 'desc';
}

// order 필드를 가진 항목 타입
interface OrderedItem {
  id: string;
  order: number;
}

export const moveSortOrder = createServerAction<MoveSortOrderParams, boolean>({
  name: 'moveSortOrder',
  auth: true,
  handler: async ({
    tableName,
    id,
    direction,
    pathname,
    filters = {},
    sortDirection = 'desc',
  }) => {
    const supabase = createServerClient();

    // 1. 현재 항목 조회
    // "order"는 PostgreSQL 예약어이므로 따옴표 필요
    const { data: currentItem, error: currentError } = await supabase
      .from(tableName)
      .select('id, "order"')
      .eq('id', id)
      .single();

    console.log('[moveSortOrder] currentItem:', currentItem, 'error:', currentError);

    if (currentError || !currentItem) {
      return Result.error('Item not found');
    }

    // 타입 단언 (order 필드가 있는 테이블에서만 사용)
    const current = currentItem as unknown as OrderedItem;

    // 2. 인접 항목 조회
    // ASC: up = 더 작은 값 찾기, down = 더 큰 값 찾기
    // DESC: up = 더 큰 값 찾기, down = 더 작은 값 찾기 (반전)
    const isUp = direction === 'up';
    const isDesc = sortDirection === 'desc';
    const findSmaller = isDesc ? !isUp : isUp;

    console.log('[moveSortOrder] direction:', direction, 'sortDirection:', sortDirection, 'findSmaller:', findSmaller);
    console.log('[moveSortOrder] current.order:', current.order, 'filters:', filters);

    let query = supabase
      .from(tableName)
      .select('id, "order"')
      .eq('deleted', false)
      .neq('id', id); // 자기 자신 제외

    // 필터 조건 적용
    if (filters.category) {
      query = query.eq('category', filters.category);
    }

    // 정렬 방향에 따른 인접 항목 검색
    // "order"는 PostgreSQL 예약어이므로 따옴표 필요
    if (findSmaller) {
      query = query
        .lt('"order"', current.order)
        .order('"order"', { ascending: false });
    } else {
      query = query
        .gt('"order"', current.order)
        .order('"order"', { ascending: true });
    }

    const { data: adjacentItem, error: adjacentError } = await query
      .limit(1)
      .single();

    console.log('[moveSortOrder] adjacentItem:', adjacentItem, 'error:', adjacentError);

    if (adjacentError || !adjacentItem) {
      return Result.error('No adjacent item');
    }

    // 타입 단언
    const adjacent = adjacentItem as unknown as OrderedItem;

    // 3. RPC로 원자적 교환
    const { error: swapError } = await supabase.rpc('swap_order', {
      p_table_name: tableName,
      p_id1: current.id,
      p_order1: current.order,
      p_id2: adjacent.id,
      p_order2: adjacent.order,
    });

    if (swapError) {
      console.error('Swap order error:', swapError);
      return Result.error('Failed to swap order');
    }

    revalidatePath(pathname);
    return Result.success(true);
  },
});
