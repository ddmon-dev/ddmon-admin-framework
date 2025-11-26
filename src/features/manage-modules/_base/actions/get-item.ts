'use server';

import { createServerClient } from '@/shared/lib/supabase/server';
import { transformSnakeToCamel } from '@/shared/utils/objects';
import { createServerAction } from '@/shared/utils/server-actions';
import { Result } from '@/shared/utils/results';
import { VALIDATION_ERRORS, CRUD_ERRORS } from '@/shared/constants/error-messages';
import { GetItemParams } from '../config';
import { TableName } from '@/shared/lib/supabase/db-helpers';

export const getItem = createServerAction<GetItemParams & { tableName: TableName }, any>({
  name: 'getItem',
  auth: true,
  validate: params => {
    if (!params.id) {
      return Result.error(VALIDATION_ERRORS.NO_ID);
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
      return Result.error(CRUD_ERRORS.READ_FAILED());
    }

    const item = transformSnakeToCamel(rawData);
    return Result.success(item);
  },
});
