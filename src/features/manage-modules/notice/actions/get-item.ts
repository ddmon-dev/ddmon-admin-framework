'use server';

import { createServerClient } from '@/shared/lib/supabase/server';
import { transformSnakeToCamel } from '@/shared/lib/utils/objects';
import { CONFIG } from '../config';
import { type FetchItemResult } from '../../_base/types';
import { type CamelCaseRowData } from '../types';

interface Params {
  id: string;
}

export async function getItem({ id }: Params): Promise<FetchItemResult<CamelCaseRowData>> {
  try {
    const supabase = createServerClient();

    // 기본 쿼리
    let query = supabase.from(CONFIG.tableName).select('*', { count: 'exact' });

    // 쿼리 실행
    const { data: rawData, error } = await query.eq('id', id).single();

    // 에러 처리
    if (error) {
      return { success: false, error: error.message };
    }

    // snake_case → camelCase 변환
    const item = transformSnakeToCamel(rawData);

    return { success: true, data: { ...item } };
  } catch (error) {
    console.error(error);
    return { success: false, error: '데이터를 불러오는 중 오류가 발생했습니다.' };
  }
}
