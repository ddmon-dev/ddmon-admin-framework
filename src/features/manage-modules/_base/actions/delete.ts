'use server';

import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/shared/lib/supabase/server';
import { deleteFolderFromStorage } from '@/shared/lib/file-system';
import { requireAuth } from '@/features/auth';
import { Result } from '@/shared/utils/results';
import { GENERAL_ERRORS, VALIDATION_ERRORS, CRUD_ERRORS } from '@/shared/constants/error-messages';
import type { ActionResult } from '@/shared/types/results';
import type { DeleteItemParams } from '../types';

/**
 * Soft delete: deleted 컬럼을 true로 설정
 */
export async function softDelete(params: DeleteItemParams): Promise<ActionResult<any>> {
  const { tableName, id, pathname } = params;

  try {
    if (!id) {
      return Result.error(VALIDATION_ERRORS.NO_ID);
    }

    await requireAuth();
    const supabase = createServerClient();

    const { data, error } = await supabase
      .from(tableName)
      .update({ deleted: true })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return Result.error(CRUD_ERRORS.DELETE_FAILED());
    }

    if (pathname) {
      revalidatePath(pathname);
    }

    return Result.success(data);
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error('[softDelete] Unexpected error:', error);
    return Result.error(GENERAL_ERRORS.UNEXPECTED);
  }
}

/**
 * Hard delete: 실제로 데이터를 삭제
 */
export async function hardDelete(params: DeleteItemParams): Promise<ActionResult<any>> {
  const { tableName, id, pathname } = params;

  try {
    if (!id) {
      return Result.error(VALIDATION_ERRORS.NO_ID);
    }

    await requireAuth({ requireSuper: true });
    const supabase = createServerClient();

    // DB에서 완전 삭제
    const { data, error } = await supabase.from(tableName).delete().eq('id', id).select().single();

    if (error) {
      console.error('Supabase error:', error);
      return Result.error(CRUD_ERRORS.DELETE_FAILED());
    }

    // Storage 폴더 전체 삭제
    const folderPath = `${tableName}/${id}`;
    await deleteFolderFromStorage(folderPath);

    if (pathname) {
      revalidatePath(pathname);
    }

    return Result.success(data);
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error('[hardDelete] Unexpected error:', error);
    return Result.error(GENERAL_ERRORS.UNEXPECTED);
  }
}
