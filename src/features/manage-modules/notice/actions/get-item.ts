'use server';

import { createServerClient } from '@/shared/lib/supabase/server';
import { transformSnakeToCamel } from '@/shared/utils/objects';
import { createServerAction, ActionResult } from '@/shared/utils/server-actions';
import { VALIDATION_ERRORS } from '@/shared/constants/error-messages';
import { GetItemParams } from '../../_base/config';
import { CONFIG } from '../config';
import { type ItemDTO } from '../config';

export const getItem = createServerAction<GetItemParams, ItemDTO>({
  name: 'getItem',
  auth: true,
  validate: params => {
    if (!params.id) {
      return ActionResult.error(VALIDATION_ERRORS.NO_ID);
    }
    return null;
  },
  handler: async ({ id }) => {
    const supabase = createServerClient();

    // notices 테이블에서 데이터 조회 (files JSONB 컬럼 포함)
    const { data: rawData, error } = await supabase
      .from(CONFIG.tableName)
      .select('*')
      .eq('id', id)
      .single();

    // 예상 가능한 Supabase 에러
    if (error) {
      console.error('Supabase error:', error);
      return ActionResult.error(error.message);
    }

    // snake_case → camelCase 변환
    const item = transformSnakeToCamel(rawData);
    return ActionResult.success(item as ItemDTO);
  },
});
