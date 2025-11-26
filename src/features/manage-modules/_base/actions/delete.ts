'use server';

import { revalidatePath } from 'next/cache';
import { transformSnakeToCamel } from '@/shared/utils/objects';
import { createServerClient } from '@/shared/lib/supabase/server';
import { deleteFolderFromStorage } from '@/shared/lib/file-system';
import { createServerAction, ActionResult } from '@/shared/utils/server-actions';
import { VALIDATION_ERRORS } from '@/shared/constants/error-messages';
import { DeleteItemParams } from '../config';

/**
 * Soft delete: deleted 컬럼을 true로 설정
 */
export const softDelete = createServerAction<DeleteItemParams, any>({
  name: 'softDelete',
  auth: true,
  validate: params => {
    if (!params.id) {
      return ActionResult.error(VALIDATION_ERRORS.NO_ID);
    }
    return null;
  },
  handler: async ({ tableName, id, pathname }) => {
    const supabase = createServerClient();

    const { data, error } = await supabase
      .from(tableName)
      .update({ deleted: true })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return ActionResult.error(error.message);
    }

    // 성공 처리
    if (pathname) {
      revalidatePath(pathname);
    }

    const deletedItem = transformSnakeToCamel(data);
    return ActionResult.success(deletedItem);
  },
});

/**
 * Hard delete: 실제로 데이터를 삭제
 */
export const hardDelete = createServerAction<DeleteItemParams, any>({
  name: 'hardDelete',
  auth: { requireSuper: true },
  validate: params => {
    if (!params.id) {
      return ActionResult.error(VALIDATION_ERRORS.NO_ID);
    }
    return null;
  },
  handler: async ({ tableName, id, pathname }) => {
    const supabase = createServerClient();

    // DB에서 완전 삭제
    const { data, error } = await supabase.from(tableName).delete().eq('id', id).select().single();

    if (error) {
      console.error('Supabase error:', error);
      return ActionResult.error(error.message);
    }

    // Storage 폴더 전체 삭제
    const folderPath = `${tableName}/${id}`;
    await deleteFolderFromStorage(folderPath);

    // 성공 처리
    if (pathname) {
      revalidatePath(pathname);
    }

    const deletedItem = transformSnakeToCamel(data);
    return ActionResult.success(deletedItem);
  },
});
