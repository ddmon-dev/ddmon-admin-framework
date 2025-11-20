'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/shared/lib/supabase/server';
import { transformCamelToSnake, transformSnakeToCamel } from '@/shared/lib/utils/objects';
import { CONFIG } from '../config';
import { type CamelCaseRowData, type CreateItemValues } from '../types';
import { type CreateResult } from '../../_base/types';

interface Params {
  values: CreateItemValues;
  path?: string;
}

export async function createItem({
  values,
  path,
}: Params): Promise<CreateResult<CamelCaseRowData>> {
  try {
    const supabase = createServerClient();

    const snakedValues = transformCamelToSnake(values);

    // 기본 쿼리
    let query = supabase
      .from(CONFIG.tableName)
      .insert(snakedValues as any)
      .select()
      .single();

    // 쿼리 실행
    const { data, error } = await query;

    // 에러 처리
    if (error) {
      throw new Error(error.message);
    }

    // 패스 재검증
    if (path) {
      revalidatePath(path);
    }

    // snake_case → camelCase 변환
    const createdItem = transformSnakeToCamel(data);

    return { success: true, data: createdItem };
  } catch (error) {
    console.error(error);
    return { success: false, error: '데이터를 생성하는 중 오류가 발생했습니다.' };
  }
}
