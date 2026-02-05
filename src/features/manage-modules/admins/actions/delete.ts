'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/shared/lib/supabase/server';
import { requireAuth } from '@/features/auth';
import { Result } from '@/shared/utils/results';
import { GENERAL_ERRORS, VALIDATION_ERRORS, CRUD_ERRORS } from '@/shared/constants/error-messages';
import type { ActionResult } from '@/shared/types/results';
import { CONFIG } from '../config';

interface DeleteAdminParams {
  id: string;
  pathname: string;
}

/**
 * Soft delete: deleted 컬럼을 true로 설정
 */
export async function deleteAdmin(params: DeleteAdminParams): Promise<ActionResult<any>> {
  const { id, pathname } = params;

  if (!id) {
    return Result.error(VALIDATION_ERRORS.NO_ID);
  }

  await requireAuth(CONFIG.auth);

  try {
    const supabase = createServerClient();

    const { data: checkData, error: checkError } = await supabase
      .from(CONFIG.tableName)
      .select('super_admin')
      .eq('id', id)
      .single();

    if (checkError) {
      console.error('Supabase error:', checkError);
      return Result.error(CRUD_ERRORS.DELETE_FAILED());
    }

    const { super_admin } = checkData;

    if (super_admin === true) {
      return Result.error('최고 관리자는 삭제할 수 없습니다.');
    }

    const { data, error } = await supabase
      .from(CONFIG.tableName)
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
    console.error('[deleteAdmin] Unexpected error:', error);
    return Result.error(GENERAL_ERRORS.UNEXPECTED);
  }
}
