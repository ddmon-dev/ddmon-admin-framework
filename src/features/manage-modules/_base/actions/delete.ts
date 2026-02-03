'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/shared/lib/supabase/server';
import { deleteFolderFromStorage } from '@/shared/lib/file-system';
import { createServerAction } from '@/features/utils/server-actions';
import { Result } from '@/shared/utils/results';
import { VALIDATION_ERRORS, CRUD_ERRORS } from '@/shared/constants/error-messages';
import { DeleteItemParams } from '../types';

/**
 * Soft delete: deleted 컬럼을 true로 설정
 */
export const softDelete = createServerAction<DeleteItemParams, any>({
  name: 'softDelete',
  auth: true,
  handler: async ({ tableName, id, pathname }) => {
    if (!id) {
      return Result.error(VALIDATION_ERRORS.NO_ID);
    }

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

    // 성공 처리
    if (pathname) {
      revalidatePath(pathname);
    }

    return Result.success(data);
  },
});

/**
 * Hard delete: 실제로 데이터를 삭제
 */
export const hardDelete = createServerAction<DeleteItemParams, any>({
  name: 'hardDelete',
  auth: { requireSuper: true },
  handler: async ({ tableName, id, pathname }) => {
    if (!id) {
      return Result.error(VALIDATION_ERRORS.NO_ID);
    }

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

    // 성공 처리
    if (pathname) {
      revalidatePath(pathname);
    }

    return Result.success(data);
  },
});
