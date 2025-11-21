'use server';

import { createServerClient } from '@/shared/lib/supabase/server';
import { transformSnakeToCamel } from '@/shared/lib/utils/objects';
import { getEntityFiles } from '@/shared/lib/file-system';
import { CONFIG } from '../config';
import { type GetItemResult } from '../../_base/types';
import { type ItemDTO } from '../types';

interface Params {
  id: string;
}

export async function getItem({ id }: Params): Promise<GetItemResult<ItemDTO>> {
  try {
    const supabase = createServerClient();

    // 1. notices 테이블에서 기본 데이터 조회
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

    // 2. files 테이블에서 파일 데이터 조회
    const files = await getEntityFiles('notices', id);

    return { success: true, data: { ...item, files } as ItemDTO };
  } catch (error) {
    console.error(error);
    return { success: false, error: '데이터를 불러오는 중 오류가 발생했습니다.' };
  }
}
