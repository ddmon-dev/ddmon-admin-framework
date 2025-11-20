'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/shared/lib/supabase/server';
import { transformSnakeToCamel } from '@/shared/lib/utils/objects';
import { type DeleteResult } from './types';
import { type TableName } from '@/shared/lib/supabase/helpers';

interface Params {
  tableName: TableName;
  id: string;
  path?: string;
}

export async function deleteItem({ tableName, id, path }: Params): Promise<DeleteResult<unknown>> {
  try {
    if (!id) {
      throw new Error('ID값이 없습니다.');
    }

    const supabase = createServerClient();

    // 기본 쿼리
    let query = supabase.from(tableName).update({ deleted: true }).eq('id', id).select().single();

    // 쿼리 실행
    const { data, error } = await query;

    // 에러 처리
    if (error) {
      throw new Error(error.message);
    }

    if (path) {
      revalidatePath(path);
    }

    return { success: true, data: transformSnakeToCamel(data) };
  } catch (error) {
    console.error(error);
    return { success: false, error: '데이터를 삭제하는 중 오류가 발생했습니다.' };
  }
}
