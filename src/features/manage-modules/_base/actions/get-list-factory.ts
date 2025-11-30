import { APP_CONFIG } from '@/app.config';
import { createServerClient } from '@/shared/lib/supabase/server';
import { transformSnakeToCamel } from '@/shared/utils/objects';
import { createServerAction } from '@/features/utils/server-actions';
import { Result } from '@/shared/utils/results';
import { GetListParams, ListProps } from '../types';
import { TableName } from '@/shared/lib/supabase/db-helpers';

/** 정렬 설정 */
interface OrderByConfig {
  column: string;
  ascending?: boolean;
}

/** 팩토리 설정 인터페이스 */
interface GetListFactoryConfig {
  tableName: TableName;
  searchFields?: string[];
  auth?: boolean | { requireSuper?: boolean };
  selectColumns?: string;
  orderBy?: OrderByConfig[];
  softDelete?: boolean;
  categoryField?: string;
  additionalFilters?: (query: any) => any;
}

const DEFAULT_ORDER_BY: OrderByConfig[] = [
  { column: 'created_at', ascending: false },
  { column: 'id', ascending: false },
];

/**
 * getList Server Action 팩토리 함수
 *
 * @template TData - 반환될 데이터 타입 (보통 ItemDTO)
 * @param config - 팩토리 설정
 * @param config.tableName - Supabase 테이블명 (필수)
 * @param config.searchFields - 검색할 필드 배열 (기본: ['name', 'email'])
 * @param config.auth - 인증 설정 (기본: true, 예: { requireSuper: true })
 * @param config.selectColumns - SELECT할 컬럼 (기본: '*', 예: 'id, name, email')
 * @param config.orderBy - 정렬 설정 (기본: created_at desc, id desc)
 * @param config.softDelete - deleted=false 필터 적용 여부 (기본: true)
 * @param config.categoryField - 카테고리 필터 필드명 (기본: 'category')
 * @param config.additionalFilters - 추가 필터 함수 (query => query.eq('status', 'active'))
 *
 * @example
 * // 기본 사용
 * export const getList = createGetListAction<ItemDTO>({
 *   tableName: CONFIG.tableName,
 *   searchFields: ['title', 'author'],
 * });
 *
 * @example
 * // admin 모듈 (특수 권한 + 컬럼 선택)
 * export const getList = createGetListAction<ItemDTO>({
 *   tableName: CONFIG.tableName,
 *   searchFields: ['name', 'id'],
 *   auth: { requireSuper: true },
 *   selectColumns: 'id, name, email, super_admin, created_at, updated_at, deleted',
 * });
 *
 * @example
 * // 커스텀 정렬 + 추가 필터
 * export const getList = createGetListAction<ItemDTO>({
 *   tableName: CONFIG.tableName,
 *   orderBy: [{ column: 'priority', ascending: true }],
 *   additionalFilters: (query) => query.eq('status', 'published'),
 * });
 */
export function createGetListAction<TData>(config: GetListFactoryConfig) {
  const {
    tableName,
    searchFields = ['name', 'email'],
    auth = true,
    selectColumns = '*',
    orderBy = DEFAULT_ORDER_BY,
    softDelete = true,
    categoryField = 'category',
    additionalFilters,
  } = config;

  // 검색 쿼리 문자열 생성
  const buildSearchFilter = (search: string) => {
    return searchFields.map(field => `${field}.ilike.%${search}%`).join(',');
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
      query = additionalFilters(query);
    }

    return query;
  };

  return createServerAction<GetListParams, ListProps<TData>>({
    name: 'getList',
    auth,
    handler: async ({
      page: rawPage = '1',
      search = '',
      category = '',
      pageSize = APP_CONFIG.UI.PAGINATION.PAGE_SIZE_OPTIONS[0],
    }) => {
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

      const data = rawData.map(row => transformSnakeToCamel(row)) as TData[];

      return Result.success({ data, totalCount });
    },
  });
}
