'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/shared/lib/supabase/server';
import { requireAuth } from '@/features/auth';
import { Result } from '@/shared/utils/results';
import { GENERAL_ERRORS, VALIDATION_ERRORS, CRUD_ERRORS } from '@/shared/constants/error-messages';
import { getOldFiles, cleanupDeletedFiles } from '@/shared/lib/file-system';
import type { ActionResult } from '@/shared/types/results';
import type { UpdateItemParams } from '../types';
import type { TableName } from '@/shared/lib/supabase/db-helpers';

interface UpdateItemConfig {
  tableName: TableName;
  // CONFIG 전체 전달 시 무시되는 속성들 (타입 호환성)
  [key: string]: unknown;
}

export async function updateItem<TData>(
  config: UpdateItemConfig,
  params: UpdateItemParams<TData>
): Promise<ActionResult<TData>> {
  const { tableName } = config;
  const { id, values, pathname } = params;

  if (!id) {
    return Result.error(VALIDATION_ERRORS.NO_ID);
  }

  const user = await requireAuth();

  try {
    const supabase = createServerClient();

    const oldFiles = await getOldFiles({
      supabase,
      tableName,
      id,
      values,
    });

    // updated_by 자동 주입
    const updateValues = {
      ...values,
      updated_by: user?.name ?? null,
    };

    const { data, error } = await supabase
      .from(tableName)
      .update(updateValues as any)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return Result.error(CRUD_ERRORS.UPDATE_FAILED());
    }

    await cleanupDeletedFiles({
      oldFiles,
      newFiles: (values as any).files,
    });

    if (pathname) {
      revalidatePath(pathname);
    }

    return Result.success(data as TData);
  } catch (error) {
    console.error('[updateItem] Unexpected error:', error);
    return Result.error(GENERAL_ERRORS.UNEXPECTED);
  }
}
