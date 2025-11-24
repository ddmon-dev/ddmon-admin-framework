'use server';

import { createServerClient } from '@/shared/lib/supabase/server';
import { transformSnakeToCamel } from '@/shared/lib/utils/objects';

import { type GetItemResult } from '../../_base/types';

import { CONFIG } from '../config';
import { type ItemDTO } from '../types';

interface Params {
  id: string;
}

export async function getItem({ id }: Params): Promise<GetItemResult<ItemDTO>> {
  try {
    const supabase = createServerClient();

    // notices 테이블에서 데이터 조회 (files JSONB 컬럼 포함)
    const { data: rawData, error } = await supabase
      .from(CONFIG.tableName)
      .select('*')
      .eq('id', id)
      .single();

    // 에러 처리
    if (error) {
      return { success: false, error: error.message };
    }

    // snake_case → camelCase 변환
    const item = transformSnakeToCamel(rawData);

    return { success: true, data: item as ItemDTO };
  } catch (error) {
    console.error(error);
    return { success: false, error: '데이터를 불러오는 중 오류가 발생했습니다.' };
  }
}
