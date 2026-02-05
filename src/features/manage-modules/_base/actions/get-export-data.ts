'use server';

import { createServerClient } from '@/shared/lib/supabase/server';
import { requireAuth } from '@/features/auth';
import { Result } from '@/shared/utils/results';
import { GENERAL_ERRORS, CRUD_ERRORS } from '@/shared/constants/error-messages';
import type { ActionResult } from '@/shared/types/results';
import type { GetExportDataParams } from '../types';

export async function getExportData(params: GetExportDataParams): Promise<ActionResult<any[]>> {
  const { tableName } = params;

  await requireAuth();

  try {
    const supabase = createServerClient();

    let query = supabase.from(tableName).select('*').eq('deleted', false);

    query = query.order('created_at', { ascending: false }).order('id', { ascending: false });

    const { data: rawData, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return Result.error(CRUD_ERRORS.READ_FAILED());
    }

    return Result.success(rawData);
  } catch (error) {
    console.error('[getExportData] Unexpected error:', error);
    return Result.error(GENERAL_ERRORS.UNEXPECTED);
  }
}
