'use server';

import { createServerClient } from '@/shared/lib/supabase/server';
import { transformSnakeToCamel } from '@/shared/lib/utils/objects';
import { DEFAULT_LIST_PAGE_SIZE } from '../../base.config';
import { TABLE_NAME } from '../config';
import { type ListRow } from '../types';
import { type FetchListResult } from '../../base.types';

interface GetListParams {
  page?: string;
  sort?: string;
  search?: string;
  category?: string;
  pageSize?: number;
}

export async function getList(params: GetListParams): Promise<FetchListResult<ListRow>> {
  try {
    const {
      page: rawPage = '1',
      search = '',
      category = '',
      pageSize = DEFAULT_LIST_PAGE_SIZE,
    } = params;
    const page = parseInt(rawPage) || 1;

    const supabase = createServerClient();

    // 기본 쿼리
    let query = supabase.from(TABLE_NAME).select('*', { count: 'exact' });

    // 검색 필터
    if (search) {
      query = query.or(`title.ilike.%${search}%,author.ilike.%${search}%`);
    }

    // 카테고리 필터
    if (category) {
      query = query.eq('category', category);
    }

    // 정렬
    query = query.order('created_at', { ascending: false });

    // 페이지네이션
    const startIndex = (page - 1) * pageSize;
    query = query.range(startIndex, startIndex + pageSize - 1);

    // 쿼리 실행
    const { data: rawData, count, error } = await query;

    // 에러 처리
    if (error) {
      return { success: false, error: error.message };
    }

    // snake_case → camelCase 변환
    const list: ListRow[] = (rawData || []).map(item => transformSnakeToCamel(item)) as ListRow[];

    return { success: true, data: { list, totalCount: count || 0 } };
  } catch (error) {
    console.error(error);
    return { success: false, error: '데이터를 불러오는 중 오류가 발생했습니다.' };
  }
}
