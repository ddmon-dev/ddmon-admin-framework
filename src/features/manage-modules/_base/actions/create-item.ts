'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/shared/lib/supabase/server';
import { transformCamelToSnake, transformSnakeToCamel } from '@/shared/utils/objects';
import { createServerAction, ActionResult } from '@/shared/utils/server-actions';
import { CreateItemParams } from '../config';
import { TableName } from '@/shared/lib/supabase/db-helpers';

export const createItem = createServerAction<
  CreateItemParams<any> & { tableName: TableName },
  any
>({
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
      return ActionResult.error(error.message);
    }

    if (pathname) {
      revalidatePath(pathname);
    }

    const createdItem = transformSnakeToCamel(data);
    return ActionResult.success(createdItem);
  },
});
