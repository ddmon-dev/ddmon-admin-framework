'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/shared/lib/supabase/server';
import { createServerAction } from '@/features/utils/server-actions';
import { Result } from '@/shared/utils/results';
import { VALIDATION_ERRORS, CRUD_ERRORS } from '@/shared/constants/error-messages';
import { TableName } from '@/shared/lib/supabase/db-helpers';

export interface BulkDeleteParams {
  tableName: TableName;
  ids: string[];
  pathname?: string;
}

/**
 * Bulk soft delete: 여러 항목의 deleted 컬럼을 true로 설정
 */
export const bulkSoftDelete = createServerAction<BulkDeleteParams, { count: number }>({
  name: 'bulkSoftDelete',
  auth: true,
  handler: async ({ tableName, ids, pathname }) => {
    if (!ids || ids.length === 0) {
      return Result.error(VALIDATION_ERRORS.NO_ID);
    }

    const supabase = createServerClient();

    const { data, error } = await supabase
      .from(tableName)
      .update({ deleted: true })
      .in('id', ids)
      .select();

    if (error) {
      console.error('Supabase bulk delete error:', error);
      return Result.error(CRUD_ERRORS.DELETE_FAILED());
    }

    if (pathname) {
      revalidatePath(pathname);
    }

    return Result.success({ count: data?.length || 0 });
  },
});
