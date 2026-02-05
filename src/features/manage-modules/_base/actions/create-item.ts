'use server';

import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/shared/lib/supabase/server';
import { requireAuth } from '@/features/auth';
import { Result } from '@/shared/utils/results';
import { GENERAL_ERRORS, CRUD_ERRORS } from '@/shared/constants/error-messages';
import type { ActionResult } from '@/shared/types/results';
import type { CreateItemParams, ReorderConfig } from '../types';
import type { TableName } from '@/shared/lib/supabase/db-helpers';

export interface CreateItemConfig {
  tableName: TableName;
  enableReorder?: ReorderConfig;
  // CONFIG 전체 전달 시 무시되는 속성들 (타입 호환성)
  [key: string]: unknown;
}

/**
 * 항목 생성 Server Action
 *
 * @param config - 생성 설정 (tableName, enableReorder 등)
 * @param params - 생성할 데이터 및 pathname
 */
export async function createItem<TData>(
  config: CreateItemConfig,
  params: CreateItemParams<TData>
): Promise<ActionResult<TData>> {
  const { tableName, enableReorder } = config;
  const { values, pathname } = params;

  try {
    const user = await requireAuth();
    const supabase = createServerClient();

    // author 자동 주입
    const insertValues: Record<string, any> = {
      ...values,
      author: user?.name ?? null,
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
    if (isRedirectError(error)) throw error;
    console.error('[createItem] Unexpected error:', error);
    return Result.error(GENERAL_ERRORS.UNEXPECTED);
  }
}
