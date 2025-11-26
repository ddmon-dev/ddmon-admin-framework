'use server';

import { createServerClient } from '@/shared/lib/supabase/server';
import { transformSnakeToCamel } from '@/shared/utils/objects';
import { createServerAction } from '@/shared/utils/server-actions';
import { Result } from '@/shared/utils/results';
import { BASE_CONFIG, GetListParams, ListProps } from '../../_base/config';
import { CONFIG } from '../config';
import { type ItemDTO } from '../config';
import { CRUD_ERRORS } from '@/shared/constants/error-messages';

export const getList = createServerAction<GetListParams, ListProps<ItemDTO>>({
  name: 'getList',
  auth: { requireSuper: true },
  handler: async ({
    page: rawPage = '1',
    search = '',
    pageSize = BASE_CONFIG.defaultListPageSize,
  }) => {
    const page = parseInt(rawPage) || 1;

    const supabase = createServerClient();

    let query = supabase
      .from(CONFIG.tableName)
      .select('id, name, email, super_admin, created_at, updated_at, deleted', { count: 'exact' })
      .eq('deleted', false);

    if (search) {
      query = query.or(`name.ilike.%${search}%,id.ilike.%${search}%`);
    }

    query = query.order('created_at', { ascending: false }).order('id', { ascending: false });

    const startIndex = (page - 1) * pageSize;
    query = query.range(startIndex, startIndex + pageSize - 1);

    const { data: rawData, count, error } = await query;

    // 에러 처리
    if (error) {
      console.error('Supabase error:', error);
      return Result.error(CRUD_ERRORS.READ_FAILED('관리자'));
    }

    const data = rawData.map(row => transformSnakeToCamel(row)) as ItemDTO[];

    return Result.success({ data, totalCount: count || 0 });
  },
});
