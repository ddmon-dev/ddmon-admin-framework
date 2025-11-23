'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/shared/lib/supabase/server';
import { transformCamelToSnake, transformSnakeToCamel } from '@/shared/lib/utils/objects';

import { type CreateResult } from '../../_base/types';

import { CONFIG } from '../config';
import { type ItemDTO, type CreateItemValues } from '../types';

interface Params {
  values: CreateItemValues;
  path?: string;
}

export async function createItem({ values, path }: Params): Promise<CreateResult<ItemDTO>> {
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

    if (path) {
      revalidatePath(path);
    }

    const createdItem = transformSnakeToCamel(data);

    return { success: true, data: createdItem as ItemDTO };
  } catch (error) {
    console.error(error);
    return { success: false, error: '데이터를 생성하는 중 오류가 발생했습니다.' };
  }
}
