'use server';

import { createServerClient } from '@/shared/lib/supabase/server';
import { requireAuth } from '@/features/auth';
import { Result } from '@/shared/utils/results';
import { GENERAL_ERRORS, VALIDATION_ERRORS, CRUD_ERRORS } from '@/shared/constants/error-messages';
import type { ActionResult } from '@/shared/types/results';
import type { GetItemParams } from '../types';
import type { TableName } from '@/shared/lib/supabase/db-helpers';

interface GetItemConfig {
  tableName: TableName;
  // CONFIG 전체 전달 시 무시되는 속성들 (타입 호환성)
  [key: string]: unknown;
}

export async function getItem<TData>(
  config: GetItemConfig,
  params: GetItemParams
): Promise<ActionResult<TData>> {
  const { tableName } = config;
  const { id } = params;

  if (!id) {
    return Result.error(VALIDATION_ERRORS.NO_ID);
  }

  await requireAuth();

  try {
    const supabase = createServerClient();

    const { data: rawData, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return Result.error(CRUD_ERRORS.READ_FAILED());
    }

    return Result.success(rawData as TData);
  } catch (error) {
    console.error('[getItem] Unexpected error:', error);
    return Result.error(GENERAL_ERRORS.UNEXPECTED);
  }
}
