'use server';

import { createServerClient } from '@/shared/lib/supabase/server';
import { transformSnakeToCamel } from '@/shared/utils/objects';
import { createServerAction, ActionResult } from '@/shared/utils/server-actions';
import { CONFIG } from '../config';
import { type ItemDTO } from '../config';

/**
 * 엑셀 다운로드용 전체 데이터 조회
 * - 페이지네이션 없음
 * - 필터링 조건은 getList와 동일
 */
export const getExportData = createServerAction<void, ItemDTO[]>({
  name: 'getExportData',
  auth: true,
  handler: async () => {
    const supabase = createServerClient();

    // 기본 쿼리
    let query = supabase.from(CONFIG.tableName).select('*').eq('deleted', false); // 삭제된 데이터는 제외

    // 정렬
    query = query.order('created_at', { ascending: false }).order('id', { ascending: false });

    // 페이지네이션 없이 전체 조회
    const { data: rawData, error } = await query;

    // 예상 가능한 Supabase 에러
    if (error) {
      console.error('Supabase error:', error);
      return ActionResult.error(error.message);
    }

    // snake_case → camelCase 변환
    const data = rawData.map(row => transformSnakeToCamel(row)) as ItemDTO[];
    return ActionResult.success(data);
  },
});
