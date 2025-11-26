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

    let query = supabase
      .from(CONFIG.tableName)
      .select('*', { count: 'exact' })
      .eq('deleted', false);

    // 검색 필터
    if (search) {
      query = query.or(`title.ilike.%${search}%,author.ilike.%${search}%`);
    }

    // 카테고리 필터
    if (category) {
      query = query.eq('category', category);
    }

    query = query.order('created_at', { ascending: false }).order('id', { ascending: false });

    const startIndex = (page - 1) * pageSize;
    query = query.range(startIndex, startIndex + pageSize - 1);

    const { data: rawData, count, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return ActionResult.error(error.message);
    }

    const data = rawData.map(row => transformSnakeToCamel(row)) as ItemDTO[];

    return ActionResult.success({ data, totalCount: count || 0 });
  },
});
