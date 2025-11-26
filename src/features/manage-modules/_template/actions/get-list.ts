'use server';

import { createServerClient } from '@/shared/lib/supabase/server';
import { transformSnakeToCamel } from '@/shared/utils/objects';
import { createServerAction, ActionResult } from '@/shared/utils/server-actions';
import { BASE_CONFIG, GetListParams, ListProps } from '../../_base/config';
import { CONFIG } from '../config';
import { type ItemDTO } from '../config';

export const getList = createServerAction<GetListParams, ListProps<ItemDTO>>({
  name: 'getList',
  auth: true,
  handler: async ({ page: rawPage = '1', search = '', pageSize = BASE_CONFIG.defaultListPageSize }) => {
    const page = parseInt(rawPage) || 1;

    const supabase = createServerClient();

    // 기본 쿼리
    let query = supabase
      .from(CONFIG.tableName)
      .select('*', { count: 'exact' })
      .eq('deleted', false);

    // 검색 필터 (이름, 이메일)
    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
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
