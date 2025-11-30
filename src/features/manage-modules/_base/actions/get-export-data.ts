'use server';

import { createServerClient } from '@/shared/lib/supabase/server';
import { transformSnakeToCamel } from '@/shared/utils/objects';
import { createServerAction } from '@/shared/utils/server-actions';
import { Result } from '@/shared/utils/results';
import { GetExportDataParams } from '../types';
import { CRUD_ERRORS } from '@/shared/constants/error-messages';

/**
 * 엑셀 다운로드용 전체 데이터 조회
 * - 페이지네이션 없음
 * - deleted = false 조건만 적용
 */
export const getExportData = createServerAction<GetExportDataParams, any[]>({
  name: 'getExportData',
  auth: true,
  handler: async ({ tableName }) => {
    const supabase = createServerClient();

    let query = supabase.from(tableName).select('*').eq('deleted', false);

    query = query.order('created_at', { ascending: false }).order('id', { ascending: false });

    const { data: rawData, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return Result.error(CRUD_ERRORS.READ_FAILED());
    }

    const data = rawData.map(row => transformSnakeToCamel(row));
    return Result.success(data);
  },
});
