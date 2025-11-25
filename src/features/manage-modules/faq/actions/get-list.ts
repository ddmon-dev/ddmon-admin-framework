'use server';

import { createServerClient } from '@/shared/lib/supabase/server';
import { transformSnakeToCamel } from '@/shared/utils/objects';

import { BASE_CONFIG } from '../../_base/config';
import { type GetListResult } from '../../_base/config';

import { CONFIG } from '../config';
import { type ItemDTO } from '../config';

interface Params {
  page?: string;
  search?: string;
  pageSize?: number;
}

export async function getList({
  page: rawPage = '1',
  search = '',
  pageSize = BASE_CONFIG.defaultListPageSize,
}: Params): Promise<GetListResult<ItemDTO>> {
  try {
    const page = parseInt(rawPage) || 1;

    const supabase = createServerClient();

    // 기본 쿼리
    let query = supabase
      .from(CONFIG.tableName)
      .select('*', { count: 'exact' })
      .eq('deleted', false);

    // 검색 필터 (이름, 이메일)
    if (search) {
      query = query.or(`question.ilike.%${search}%,answer.ilike.%${search}%`);
    }

    // 정렬
    query = query.order('created_at', { ascending: false }).order('id', { ascending: false });

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
    const data = rawData.map(row => transformSnakeToCamel(row)) as ItemDTO[];

    return { success: true, data: { data, totalCount: count || 0 } };
  } catch (error) {
    console.error(error);
    return { success: false, error: '데이터를 불러오는 중 오류가 발생했습니다.' };
  }
}
