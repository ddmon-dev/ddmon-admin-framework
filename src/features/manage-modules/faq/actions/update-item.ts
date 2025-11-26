'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/shared/lib/supabase/server';
import { transformCamelToSnake, transformSnakeToCamel } from '@/shared/utils/objects';
import { createServerAction } from '@/shared/utils/server-actions';
import { Result } from '@/shared/utils/results';
import { VALIDATION_ERRORS, CRUD_ERRORS } from '@/shared/constants/error-messages';
import { UpdateItemParams } from '../../_base/config';
import { CONFIG } from '../config';
import { type ItemDTO } from '../config';

export const updateItem = createServerAction<UpdateItemParams<ItemDTO>, ItemDTO>({
  name: 'updateItem',
  auth: true,
  validate: params => {
    if (!params.id) {
      return Result.error(VALIDATION_ERRORS.NO_ID);
    }
    return null;
  },
  handler: async ({ id, values, pathname }) => {
    const supabase = createServerClient();

    const snakedValues = transformCamelToSnake(values);

    const { data, error } = await supabase
      .from(CONFIG.tableName)
      .update(snakedValues as any)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return Result.error(CRUD_ERRORS.UPDATE_FAILED());
    }

    if (pathname) {
      revalidatePath(pathname);
    }

    const updatedItem = transformSnakeToCamel(data);

    return Result.success(updatedItem as ItemDTO);
  },
});
