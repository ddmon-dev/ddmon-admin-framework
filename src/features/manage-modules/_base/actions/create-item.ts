'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/shared/lib/supabase/server';
import { createServerAction } from '@/features/utils/server-actions';
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

      const { data, error } = await supabase
        .from(tableName)
        .insert(values as any)
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        return Result.error(CRUD_ERRORS.CREATE_FAILED());
      }

      if (pathname) {
        revalidatePath(pathname);
      }

      return Result.success(data);
    },
  }
);
