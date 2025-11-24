'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/shared/lib/supabase/server';
import { transformCamelToSnake, transformSnakeToCamel } from '@/shared/lib/utils/objects';

import { type UpdateResult } from '../../_base/types';

import { CONFIG } from '../config';
import { type ItemDTO } from '../types';

interface Params {
  id: string;
  values: Partial<ItemDTO>;
  pathname?: string;
}

export async function updateItem({ id, values, pathname }: Params): Promise<UpdateResult<ItemDTO>> {
  try {
    if (!id) {
      throw new Error('ID값이 없습니다.');
    }

    const supabase = createServerClient();

    const snakedValues = transformCamelToSnake(values);

    const { data, error } = await supabase
      .from(CONFIG.tableName)
      .update(snakedValues as any)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    if (pathname) {
      revalidatePath(pathname);
    }

    const updatedItem = transformSnakeToCamel(data);

    return { success: true, data: updatedItem as ItemDTO };
  } catch (error) {
    console.error(error);
    return { success: false, error: '데이터를 업데이트하는 중 오류가 발생했습니다.' };
  }
}
