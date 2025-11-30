'use server';

import { createServerClient } from '@/shared/lib/supabase/server';
import { transformSnakeToCamel } from '@/shared/utils/objects';
import { createServerAction } from '@/features/utils/server-actions';
import { Result } from '@/shared/utils/results';
import { CONFIG } from '../config';
import { type ItemDTO } from '../config';
import { CRUD_ERRORS } from '@/shared/constants/error-messages';

/**
 * 엑셀 다운로드용 전체 데이터 조회
 * 비밀번호 필드 제외
 */
export const getExportData = createServerAction<void, ItemDTO[]>({
  name: 'getExportData',
  auth: { requireSuper: true },
  handler: async () => {
    const supabase = createServerClient();

    let query = supabase
      .from(CONFIG.tableName)
      .select('id, name, email, super_admin, created_at, updated_at, deleted')
      .eq('deleted', false);

    query = query.order('created_at', { ascending: false }).order('id', { ascending: false });

    const { data: rawData, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return Result.error(CRUD_ERRORS.READ_FAILED('관리자'));
    }

    const data = rawData.map(row => transformSnakeToCamel(row)) as ItemDTO[];
    return Result.success(data);
  },
});
