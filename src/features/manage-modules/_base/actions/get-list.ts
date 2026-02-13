'use server';

import { APP_CONFIG } from '@/app.config';
import { createServerClient } from '@/shared/lib/supabase/server';
import { requireAuth } from '@/features/auth';
import { Result } from '@/shared/utils/results';
import { GENERAL_ERRORS } from '@/shared/constants/error-messages';
import type { ActionResult } from '@/shared/types/results';
import type { GetListParams, ListProps, ReorderConfig } from '../types';
import type { TableName } from '@/shared/lib/supabase/db-helpers';

/** 정렬 설정 */
interface OrderByConfig {
  column: string;
  ascending?: boolean;
}

interface GetListConfig {
  tableName: TableName;
  searchFields?: readonly string[] | string[];
  auth?: boolean | { requireSuper?: boolean };
  selectColumns?: string;
  orderBy?: OrderByConfig[];
  softDelete?: boolean;
  categoryField?: string;
  additionalFilters?: (query: any, ctx: any) => any;
  enableReorder?: ReorderConfig;
  // CONFIG 전체 전달 시 무시되는 속성들 (타입 호환성)
  [key: string]: unknown;
}

const DEFAULT_ORDER_BY: OrderByConfig[] = [
  { column: 'created_at', ascending: false },
  { column: 'id', ascending: false },
];

export async function getList<TData>(
  config: GetListConfig,
  params: GetListParams
): Promise<ActionResult<ListProps<TData>>> {
  const {
    tableName,
    searchFields = ['name', 'email'],
    auth = true,
    selectColumns = '*',
    orderBy: customOrderBy,
    softDelete = true,
    categoryField = 'category',
    additionalFilters,
    enableReorder,
  } = config;

  // 1. 인증 확인
  let user = null;
  if (auth) {
    user = await requireAuth(typeof auth === 'object' ? auth : {});
  }
  const ctx = { user };

  try {
    // enableReorder 설정 시 자동 정렬, 그렇지 않으면 커스텀 또는 기본 정렬
    const direction = enableReorder === true ? 'desc' : (enableReorder?.direction ?? 'desc');
    const orderBy = enableReorder
      ? [{ column: 'sort_order', ascending: direction !== 'desc' }]
      : (customOrderBy ?? DEFAULT_ORDER_BY);

    // 검색 쿼리 문자열 생성
    const buildSearchFilter = (search: string) => {
      return searchFields.map((field) => `${field}.ilike.%${search}%`).join(',');
    };

    // 공통 필터 적용 함수
    const applyFilters = (query: any, search: string, category: string) => {
      // soft delete 필터
      if (softDelete) {
        query = query.eq('deleted', false);
      }

      // 검색 필터
      if (search) {
        query = query.or(buildSearchFilter(search));
      }

      // 카테고리 필터
      if (category) {
        query = query.eq(categoryField, category);
      }

      // 추가 필터
      if (additionalFilters) {
        query = additionalFilters(query, ctx);
      }

      return query;
    };

    const {
      page: rawPage = '1',
      search = '',
      category = '',
      pageSize = APP_CONFIG.UI.PAGINATION.PAGE_SIZE_OPTIONS[0],
    } = params;

    const supabase = createServerClient();

    // 1. count 먼저 쿼리
    let countQuery = supabase.from(tableName).select('*', { count: 'exact', head: true });
    countQuery = applyFilters(countQuery, search, category);

    const { count, error: countError } = await countQuery;

    if (countError) {
      console.error('Supabase count error:', countError);
      return Result.success({ data: [] as TData[], totalCount: 0, error: countError.message });
    }

    const totalCount = count || 0;

    // 2. page 보정 (음수 → 1, pageCount 초과 → 마지막 페이지)
    const pageCount = Math.ceil(totalCount / pageSize);
    const rawPageNum = parseInt(rawPage) || 1;
    const page = Math.min(Math.max(1, rawPageNum), Math.max(1, pageCount));

    // 3. 보정된 page로 data 쿼리
    let dataQuery = supabase.from(tableName).select(selectColumns);
    dataQuery = applyFilters(dataQuery, search, category);

    // 정렬 적용
    for (const order of orderBy) {
      dataQuery = dataQuery.order(order.column, { ascending: order.ascending ?? false });
    }

    const startIndex = (page - 1) * pageSize;
    dataQuery = dataQuery.range(startIndex, startIndex + pageSize - 1);

    const { data: rawData, error: dataError } = await dataQuery;

    if (dataError) {
      console.error('Supabase data error:', dataError);
      return Result.success({ data: [] as TData[], totalCount, error: dataError.message });
    }

    return Result.success({ data: rawData as TData[], totalCount });
  } catch (error) {
    console.error('[getList] Unexpected error:', error);
    return Result.error(GENERAL_ERRORS.UNEXPECTED);
  }
}
