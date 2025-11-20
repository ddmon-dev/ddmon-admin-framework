'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/shared/lib/supabase/server';
import { transformCamelToSnake, transformSnakeToCamel } from '@/shared/lib/utils/objects';
import { CONFIG } from '../config';
import { type RowData, type ItemDTO, type UpdateItemValues } from '../types';
import { type UpdateResult } from '../../_base/types';

interface Params {
  id: RowData['id'];
  values: UpdateItemValues;
  path?: string;
}

export async function updateItem({ id, values, path }: Params): Promise<UpdateResult<ItemDTO>> {
  try {
    if (!id) {
      throw new Error('ID값이 없습니다.');
    }

    const snakedValues = transformCamelToSnake(values);

    const supabase = createServerClient();

    // 기본 쿼리
    let query = supabase
      .from(CONFIG.tableName)
      .update(snakedValues as any)
      .eq('id', id)
      .select()
      .single();

    // 쿼리 실행
    const { data, error } = await query;

    // 에러 처리
    if (error) {
      // return { success: false, error: error.message };
      throw new Error(error.message);
    }

    // 패스 재검증
    if (path) {
      revalidatePath(path);
    }

    // snake_case → camelCase 변환
    const updatedItem = transformSnakeToCamel(data);

    return { success: true, data: updatedItem };
  } catch (error) {
    console.error(error);
    return { success: false, error: '데이터를 업데이트하는 중 오류가 발생했습니다.' };
  }
}
