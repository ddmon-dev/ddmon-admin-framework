'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/shared/lib/supabase/server';
import { requireAuth } from '@/features/auth';
import { Result } from '@/shared/utils/results';
import { GENERAL_ERRORS, VALIDATION_ERRORS, CRUD_ERRORS } from '@/shared/constants/error-messages';
import type { ActionResult } from '@/shared/types/results';
import type { TableName } from '@/shared/lib/supabase/db-helpers';

export interface BulkDeleteParams {
  tableName: TableName;
  ids: string[];
  pathname?: string;
}

/**
 * Bulk soft delete: 여러 항목의 deleted 컬럼을 true로 설정
 */
export async function bulkSoftDelete(params: BulkDeleteParams): Promise<ActionResult<{ count: number }>> {
  const { tableName, ids, pathname } = params;

  if (!ids || ids.length === 0) {
    return Result.error(VALIDATION_ERRORS.NO_ID);
  }

  await requireAuth();

  try {
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
  } catch (error) {
    console.error('[bulkSoftDelete] Unexpected error:', error);
    return Result.error(GENERAL_ERRORS.UNEXPECTED);
  }
}
