'use server';

import { createServerClient } from '@/shared/lib/supabase/server';
import { transformSnakeToCamel } from '@/shared/utils/objects';
import { createServerAction, ActionResult } from '@/shared/utils/server-actions';
import { VALIDATION_ERRORS } from '@/shared/constants/error-messages';
import { GetItemParams } from '../config';
import { TableName } from '@/shared/lib/supabase/db-helpers';

export const getItem = createServerAction<GetItemParams & { tableName: TableName }, any>({
  name: 'getItem',
  auth: true,
  validate: params => {
    if (!params.id) {
      return ActionResult.error(VALIDATION_ERRORS.NO_ID);
    }
    return null;
  },
  handler: async ({ tableName, id }) => {
    const supabase = createServerClient();

    const { data: rawData, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return ActionResult.error(error.message);
    }

    const item = transformSnakeToCamel(rawData);
    return ActionResult.success(item);
  },
});
