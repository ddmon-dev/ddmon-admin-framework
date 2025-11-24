'use server';

import { createServerClient } from '@/shared/lib/supabase/server';
import { transformSnakeToCamel } from '@/shared/lib/utils/objects';

import { CONFIG } from '../config';
import { type ItemDTO } from '../types';

interface GetListForExportResult {
  success: boolean;
  data?: ItemDTO[];
  error?: string;
}

/**
 * 엑셀 다운로드용 전체 데이터 조회
 * - 페이지네이션 없음
 * - 필터링 조건은 getList와 동일
 */
export async function getExportData(): Promise<GetListForExportResult> {
  try {
    const supabase = createServerClient();

    // 기본 쿼리
    let query = supabase.from(CONFIG.tableName).select('*').eq('deleted', false); // 삭제된 데이터는 제외

    // 정렬
    query = query.order('created_at', { ascending: false }).order('id', { ascending: false });

    // 페이지네이션 없이 전체 조회
    const { data: rawData, error } = await query;

    // 에러 처리
    if (error) {
      return { success: false, error: error.message };
    }

    // snake_case → camelCase 변환
    const data = rawData.map(row => transformSnakeToCamel(row)) as ItemDTO[];

    return { success: true, data };
  } catch (error) {
    console.error(error);
    return { success: false, error: '데이터를 불러오는 중 오류가 발생했습니다.' };
  }
}
