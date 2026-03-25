'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/shared/lib/supabase/server';
import { requireAuth } from '@/features/auth';
import { Result } from '@/shared/utils/results';
import { GENERAL_ERRORS, CRUD_ERRORS, VALIDATION_ERRORS } from '@/shared/constants/error-messages';
import type { ZodType } from 'zod';
import type { ActionResult } from '@/shared/types/results';
import type { CreateItemParams, ReorderConfig } from '../types';
import type { TableName } from '@/shared/lib/supabase/db-helpers';

interface CreateItemConfig {
  tableName: TableName;
  enableReorder?: ReorderConfig;
  schema?: ZodType;
  // CONFIG 전체 전달 시 무시되는 속성들 (타입 호환성)
  [key: string]: unknown;
}

export async function createItem<TData>(
  config: CreateItemConfig,
  params: CreateItemParams<TData>
): Promise<ActionResult<TData>> {
  const { tableName, enableReorder, schema } = config;
  let { values } = params;
  const { pathname } = params;

  // 스키마 검증 (있을 때만)
  if (schema) {
    const result = schema.safeParse(values);
    if (!result.success) {
      console.error('[createItem] Validation failed:', result.error.flatten());
      return Result.error(VALIDATION_ERRORS.INVALID_INPUT);
    }
    values = result.data as Partial<TData>;
  }

  const user = await requireAuth();

  try {
    const supabase = createServerClient();

    // author 자동 주입 (관리자 ID 저장)
    const insertValues: Record<string, any> = {
      ...values,
      author: user?.id ?? null,
    };

    // enableReorder 자동 처리: 전체 테이블에서 최대 sort_order + 1
    if (enableReorder) {
      const { data: maxOrderItem } = await supabase
        .from(tableName)
        .select('sort_order')
        .eq('deleted', false)
        .order('sort_order', { ascending: false })
        .limit(1)
        .single();

      const maxSortOrder = (maxOrderItem as { sort_order?: number } | null)?.sort_order ?? 0;
      insertValues.sort_order = maxSortOrder + 1;
    }

    const { data, error } = await supabase
      .from(tableName)
      .insert(insertValues as any)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return Result.error(CRUD_ERRORS.CREATE_FAILED());
    }

    if (pathname) {
      revalidatePath(pathname);
    }

    return Result.success(data as TData);
  } catch (error) {
    console.error('[createItem] Unexpected error:', error);
    return Result.error(GENERAL_ERRORS.UNEXPECTED);
  }
}
