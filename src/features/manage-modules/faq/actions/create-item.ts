'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/shared/lib/supabase/server';
import { transformCamelToSnake, transformSnakeToCamel } from '@/shared/utils/objects';
import { requireAuth } from '@/features/auth';

import { type CreateResult } from '../../_base/config';

import { CONFIG } from '../config';
import { type ItemDTO } from '../config';

interface Params {
  values: Partial<ItemDTO>;
  pathname?: string;
}

export async function createItem({ values, pathname }: Params): Promise<CreateResult<ItemDTO>> {
  // 인증 확인
  await requireAuth();

  try {
    const supabase = createServerClient();

    const snakedValues = transformCamelToSnake(values);

    const { data, error } = await supabase
      .from(CONFIG.tableName)
      .insert(snakedValues as any)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(error.message);
    }

    if (pathname) {
      revalidatePath(pathname);
    }

    const createdItem = transformSnakeToCamel(data);

    return { success: true, data: createdItem as ItemDTO };
  } catch (error) {
    console.error(error);
    return { success: false, error: '데이터를 생성하는 중 오류가 발생했습니다.' };
  }
}
