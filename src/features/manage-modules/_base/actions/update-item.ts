'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/shared/lib/supabase/server';
import { requireAuth } from '@/features/auth';
import { Result } from '@/shared/utils/results';
import { GENERAL_ERRORS, VALIDATION_ERRORS, CRUD_ERRORS } from '@/shared/constants/error-messages';
import { getOldFiles, cleanupDeletedFiles } from '@/shared/lib/file-system';
import type { ZodObject, ZodType } from 'zod';
import type { ActionResult } from '@/shared/types/results';
import type { UpdateItemParams } from '../types';
import type { TableName } from '@/shared/lib/supabase/db-helpers';

interface UpdateItemConfig {
  tableName: TableName;
  schema?: ZodType;
  // CONFIG 전체 전달 시 무시되는 속성들 (타입 호환성)
  [key: string]: unknown;
}

export async function updateItem<TData>(
  config: UpdateItemConfig,
  params: UpdateItemParams<TData>
): Promise<ActionResult<TData>> {
  const { tableName, schema } = config;
  let { values } = params;
  const { id, pathname } = params;

  if (!id) {
    return Result.error(VALIDATION_ERRORS.NO_ID);
  }

  // 스키마 검증 (있을 때만) - partial()로 부분 업데이트 허용
  if (schema) {
    const partialSchema = (schema as ZodObject<any>).partial();
    const result = partialSchema.safeParse(values);
    if (!result.success) {
      console.error('[updateItem] Validation failed:', result.error.flatten());
      return Result.error(VALIDATION_ERRORS.INVALID_INPUT);
    }
    values = result.data as Partial<TData>;
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
      updated_by_id: user?.id ?? null,
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
