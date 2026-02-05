'use server';

import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { createServerClient } from '@/shared/lib/supabase/server';
import { requireAuth } from '@/features/auth';
import { Result } from '@/shared/utils/results';
import { GENERAL_ERRORS, CRUD_ERRORS } from '@/shared/constants/error-messages';
import type { ActionResult } from '@/shared/types/results';
import type { GetExportDataParams } from '../types';

/**
 * 엑셀 다운로드용 전체 데이터 조회
 * - 페이지네이션 없음
 * - deleted = false 조건만 적용
 */
export async function getExportData(params: GetExportDataParams): Promise<ActionResult<any[]>> {
  const { tableName } = params;

  try {
    await requireAuth();
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
    if (isRedirectError(error)) throw error;
    console.error('[getExportData] Unexpected error:', error);
    return Result.error(GENERAL_ERRORS.UNEXPECTED);
  }
}
