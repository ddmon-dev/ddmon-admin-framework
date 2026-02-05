'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/shared/lib/supabase/server';
import { createServerAction } from '@/features/utils/server-actions';
import { Result } from '@/shared/utils/results';
import { CreateItemParams, ReorderConfig } from '../types';
import { TableName } from '@/shared/lib/supabase/db-helpers';
import { CRUD_ERRORS } from '@/shared/constants/error-messages';

interface CreateItemWithReorderParams<T> extends CreateItemParams<T> {
  tableName: TableName;
  enableReorder?: ReorderConfig;
}

export const createItem = createServerAction<CreateItemWithReorderParams<any>, any>(
  {
    name: 'createItem',
    auth: true,
    handler: async ({ tableName, values, pathname, enableReorder }, { user }) => {
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

      return Result.success(data);
    },
  }
);
