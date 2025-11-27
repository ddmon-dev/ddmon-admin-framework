'use server';

import { createServerClient } from '@/shared/lib/supabase/server';
import { transformSnakeToCamel } from '@/shared/utils/objects';
import { createServerAction } from '@/shared/utils/server-actions';
import { Result } from '@/shared/utils/results';
import { BASE_CONFIG, GetListParams, ListProps } from '../config';
import { TableName } from '@/shared/lib/supabase/db-helpers';

export const getList = createServerAction<GetListParams & { tableName: TableName }, ListProps<any>>(
  {
    name: 'getList',
    auth: true,
    handler: async ({
      tableName,
      page: rawPage = '1',
      search = '',
      category = '',
      pageSize = BASE_CONFIG.defaultListPageSize,
    }) => {
      const supabase = createServerClient();

      // 1. count 먼저 쿼리
      let countQuery = supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true })
        .eq('deleted', false);

      if (search) {
        countQuery = countQuery.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
      }

      // 카테고리 필터
      if (category) {
        countQuery = countQuery.eq('category', category);
      }

      const { count, error: countError } = await countQuery;

      if (countError) {
        console.error('Supabase count error:', countError);
        return Result.success({ data: [], totalCount: 0, error: countError.message });
      }

      const totalCount = count || 0;

      // 2. page 보정 (음수 → 1, pageCount 초과 → 마지막 페이지)
      const pageCount = Math.ceil(totalCount / pageSize);
      const rawPageNum = parseInt(rawPage) || 1;
      const page = Math.min(Math.max(1, rawPageNum), Math.max(1, pageCount));

      // 3. 보정된 page로 data 쿼리
      let dataQuery = supabase.from(tableName).select('*').eq('deleted', false);

      if (search) {
        dataQuery = dataQuery.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
      }

      // 카테고리 필터
      if (category) {
        dataQuery = dataQuery.eq('category', category);
      }

      dataQuery = dataQuery
        .order('created_at', { ascending: false })
        .order('id', { ascending: false });

      const startIndex = (page - 1) * pageSize;
      dataQuery = dataQuery.range(startIndex, startIndex + pageSize - 1);

      const { data: rawData, error: dataError } = await dataQuery;

      if (dataError) {
        console.error('Supabase data error:', dataError);
        return Result.success({ data: [], totalCount, error: dataError.message });
      }

      const data = rawData.map(row => transformSnakeToCamel(row));

      return Result.success({ data, totalCount });
    },
  }
);
