'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/shared/lib/supabase/server';
import { transformCamelToSnake, transformSnakeToCamel } from '@/shared/utils/objects';
import { createServerAction } from '@/shared/utils/server-actions';
import { Result } from '@/shared/utils/results';
import { CreateItemParams } from '../types';
import { TableName } from '@/shared/lib/supabase/db-helpers';
import { CRUD_ERRORS } from '@/shared/constants/error-messages';

export const createItem = createServerAction<CreateItemParams<any> & { tableName: TableName }, any>(
  {
    name: 'createItem',
    auth: true,
    handler: async ({ tableName, values, pathname }) => {
      const supabase = createServerClient();

      const snakedValues = transformCamelToSnake(values);

      const { data, error } = await supabase
        .from(tableName)
        .insert(snakedValues as any)
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        return Result.error(CRUD_ERRORS.CREATE_FAILED());
      }

      if (pathname) {
        revalidatePath(pathname);
      }

      const createdItem = transformSnakeToCamel(data);
      return Result.success(createdItem);
    },
  }
);
