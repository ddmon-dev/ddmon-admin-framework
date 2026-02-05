'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/shared/lib/supabase/server';
import { createServerAction } from '@/features/utils/server-actions';
import { Result } from '@/shared/utils/results';
import { CRUD_ERRORS } from '@/shared/constants/error-messages';
import { CONFIG, type ItemDTO } from '../config';
import { type CreateItemParams } from '../../_base/types';

export const createItem = createServerAction<CreateItemParams<ItemDTO>, ItemDTO>({
  name: 'createItem',
  auth: true,
  handler: async ({ values, pathname }, { user }) => {
    const supabase = createServerClient();

    // 현재 최대 order 값 조회 (카테고리별)
    // "order"는 PostgreSQL 예약어이므로 따옴표 필요
    const { data: maxOrderItem } = await supabase
      .from(CONFIG.tableName)
      .select('"order"')
      .eq('deleted', false)
      .eq('category', values.category ?? 'general')
      .order('"order"', { ascending: false })
      .limit(1)
      .single();

    const nextOrder = (maxOrderItem?.order ?? 0) + 1;

    const insertValues = {
      ...values,
      order: nextOrder,
      author: user?.name ?? null,
    };

    const { data, error } = await supabase
      .from(CONFIG.tableName)
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

    return Result.success(data as ItemDTO);
  },
});
