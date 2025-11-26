'use server';

import { createServerClient } from '@/shared/lib/supabase/server';
import { transformSnakeToCamel } from '@/shared/utils/objects';
import { createServerAction } from '@/shared/utils/server-actions';
import { Result } from '@/shared/utils/results';
import { CONFIG } from '../config';
import { type ItemDTO } from '../config';
import { CRUD_ERRORS } from '@/shared/constants/error-messages';

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

    let query = supabase.from(CONFIG.tableName).select('*').eq('deleted', false);

    query = query.order('created_at', { ascending: false }).order('id', { ascending: false });

    // 페이지네이션 없이 전체 조회
    const { data: rawData, error } = await query;

    // 에러 처리
    if (error) {
      console.error('Supabase error:', error);
      return Result.error(CRUD_ERRORS.READ_FAILED());
    }

    
    const data = rawData.map(row => transformSnakeToCamel(row)) as ItemDTO[];

    return Result.success(data);
  },
});
