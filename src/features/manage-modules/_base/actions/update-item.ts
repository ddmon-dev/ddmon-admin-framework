'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/shared/lib/supabase/server';
import { transformCamelToSnake, transformSnakeToCamel } from '@/shared/utils/objects';
import { createServerAction } from '@/shared/utils/server-actions';
import { Result } from '@/shared/utils/results';
import { VALIDATION_ERRORS, CRUD_ERRORS } from '@/shared/constants/error-messages';
import { UpdateItemParams } from '../config';
import { getOldFiles, cleanupDeletedFiles } from '@/shared/lib/file-system';
import { TableName } from '@/shared/lib/supabase/db-helpers';

export const updateItem = createServerAction<UpdateItemParams<any> & { tableName: TableName }, any>(
  {
    name: 'updateItem',
    auth: true,
    validate: params => {
      if (!params.id) {
        return Result.error(VALIDATION_ERRORS.NO_ID);
      }
      return null;
    },
    handler: async ({ tableName, id, values, pathname }) => {
      const supabase = createServerClient();

      const oldFiles = await getOldFiles({
        supabase,
        tableName,
        id,
        values,
      });

      const snakedValues = transformCamelToSnake(values);

      const { data, error } = await supabase
        .from(tableName)
        .update(snakedValues as any)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        return Result.error(CRUD_ERRORS.UPDATE_FAILED());
      }

      await cleanupDeletedFiles({
        oldFiles,
        newFiles: values.files,
      });

      if (pathname) {
        revalidatePath(pathname);
      }

      const updatedItem = transformSnakeToCamel(data);
      return Result.success(updatedItem);
    },
  }
);
