'use server';

import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { createServerClient } from '@/shared/lib/supabase/server';
import { requireAuth } from '@/features/auth';
import { Result } from '@/shared/utils/results';
import { GENERAL_ERRORS, VALIDATION_ERRORS, CRUD_ERRORS } from '@/shared/constants/error-messages';
import type { ActionResult } from '@/shared/types/results';
import type { GetItemParams } from '../../_base/types';
import { CONFIG, type ItemDTO } from '../config';

export async function getItem(params: GetItemParams): Promise<ActionResult<ItemDTO>> {
  const { id } = params;

  try {
    if (!id) {
      return Result.error(VALIDATION_ERRORS.NO_ID);
    }

    await requireAuth({ requireSuper: true });
    const supabase = createServerClient();

    const { data: rawData, error } = await supabase
      .from(CONFIG.tableName)
      .select('id, name, email, super_admin, created_at, updated_at, deleted')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return Result.error(CRUD_ERRORS.READ_FAILED('관리자'));
    }

    return Result.success(rawData as ItemDTO);
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error('[getItem] Unexpected error:', error);
    return Result.error(GENERAL_ERRORS.UNEXPECTED);
  }
}
