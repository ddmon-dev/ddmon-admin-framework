'use server';

import { createServerClient } from '@/shared/lib/supabase/server';
import { transformSnakeToCamel } from '@/shared/utils/objects';
import { createServerAction, ActionResult } from '@/shared/utils/server-actions';
import { VALIDATION_ERRORS, CRUD_ERRORS } from '@/shared/constants/error-messages';
import { GetItemParams } from '../../_base/config';
import { CONFIG } from '../config';
import { type ItemDTO } from '../config';

export const getItem = createServerAction<GetItemParams, ItemDTO>({
  name: 'getItem',
  auth: { requireSuper: true },
  validate: params => {
    if (!params.id) {
      return ActionResult.error(VALIDATION_ERRORS.NO_ID);
    }
    return null;
  },
  handler: async ({ id }) => {
    const supabase = createServerClient();

    const { data: rawData, error } = await supabase
      .from(CONFIG.tableName)
      .select('id, name, email, super_admin, created_at, updated_at, deleted')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return ActionResult.error(CRUD_ERRORS.READ_FAILED('관리자'));
    }

    const item = transformSnakeToCamel(rawData);

    return ActionResult.success(item as ItemDTO);
  },
});
