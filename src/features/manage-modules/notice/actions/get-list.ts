'use server';

import { createServerClient } from '@/shared/lib/supabase/server';
import { transformSnakeToCamel } from '@/shared/utils/objects';
import { createServerAction, ActionResult } from '@/shared/utils/server-actions';
import { BASE_CONFIG, GetListParams, ListProps } from '../../_base/config';
import { CONFIG } from '../config';
import { type ItemDTO } from '../config';

interface Params extends GetListParams {
  category?: string;
}

export const getList = createServerAction<Params, ListProps<ItemDTO>>({
  name: 'getList',
  auth: true,
  handler: async ({
    page: rawPage = '1',
    search = '',
    category = '',
    pageSize = BASE_CONFIG.defaultListPageSize,
  }) => {
    const page = parseInt(rawPage) || 1;

    const supabase = createServerClient();

    // 기본 쿼리
    let query = supabase
      .from(CONFIG.tableName)
      .select('*', { count: 'exact' })
      .eq('deleted', false); // 삭제된 데이터는 제외

    // 검색 필터
    if (search) {
      query = query.or(`title.ilike.%${search}%,author.ilike.%${search}%`);
    }

    // 카테고리 필터
    if (category) {
      query = query.eq('category', category);
    }

    // 정렬
    query = query.order('created_at', { ascending: false }).order('id', { ascending: false });

    // 페이지네이션
    const startIndex = (page - 1) * pageSize;
    query = query.range(startIndex, startIndex + pageSize - 1);

    // 쿼리 실행
    const { data: rawData, count, error } = await query;

    // 예상 가능한 Supabase 에러
    if (error) {
      console.error('Supabase error:', error);
      return ActionResult.error(error.message);
    }

    // snake_case → camelCase 변환
    const data = rawData.map(row => transformSnakeToCamel(row)) as ItemDTO[];

    return ActionResult.success({ data, totalCount: count || 0 });
  },
});
