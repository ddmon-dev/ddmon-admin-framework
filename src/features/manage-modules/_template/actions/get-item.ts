'use server';

import { createServerClient } from '@/shared/lib/supabase/server';
import { transformSnakeToCamel } from '@/shared/utils/objects';

import { type GetItemResult } from '../../_base/config';

import { CONFIG } from '../config';
import { type ItemDTO } from '../config';

interface Params {
  id: string;
}

export async function getItem({ id }: Params): Promise<GetItemResult<ItemDTO>> {
  try {
    const supabase = createServerClient();

    const { data: rawData, error } = await supabase
      .from(CONFIG.tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    const item = transformSnakeToCamel(rawData);

    return { success: true, data: item as ItemDTO };
  } catch (error) {
    console.error(error);
    return { success: false, error: '데이터를 불러오는 중 오류가 발생했습니다.' };
  }
}
