'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/shared/lib/supabase/server';
import { transformCamelToSnake, transformSnakeToCamel } from '@/shared/utils/objects';
import { createServerAction, ActionResult } from '@/shared/utils/server-actions';
import { CreateItemParams } from '../../_base/config';
import { CONFIG } from '../config';
import { type ItemDTO } from '../config';
import { CRUD_ERRORS } from '@/shared/constants/error-messages';

export const createItem = createServerAction<CreateItemParams<ItemDTO>, ItemDTO>({
  name: 'createItem',
  auth: true,
  handler: async ({ values, pathname }) => {
    const supabase = createServerClient();

    const snakedValues = transformCamelToSnake(values);

    const { data, error } = await supabase
      .from(CONFIG.tableName)
      .insert(snakedValues as any)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return ActionResult.error(CRUD_ERRORS.CREATE_FAILED());
    }

    if (pathname) {
      revalidatePath(pathname);
    }

    const createdItem = transformSnakeToCamel(data);

    return ActionResult.success(createdItem as ItemDTO);
  },
});
