'use server';

import { createServerClient } from '@/shared/lib/supabase/server';
import { type TableName } from '@/shared/lib/supabase/helpers';

interface DeleteResult {
  data?: any;
  error?: string;
}

/**
 * Soft delete: deleted 컬럼을 true로 설정
 */
export async function softDelete(tableName: TableName, id: string): Promise<DeleteResult> {
  try {
    if (!id) {
      throw new Error('ID값이 없습니다.');
    }

    const supabase = createServerClient();

    const { data, error } = await supabase
      .from(tableName)
      .update({ deleted: true })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return { data };
  } catch (error) {
    console.error(error);
    return { error: error instanceof Error ? error.message : '삭제 중 오류가 발생했습니다.' };
  }
}

/**
 * Hard delete: 실제로 데이터를 삭제
 */
export async function hardDelete(tableName: TableName, id: string): Promise<DeleteResult> {
  try {
    if (!id) {
      throw new Error('ID값이 없습니다.');
    }

    const supabase = createServerClient();

    const { data, error } = await supabase.from(tableName).delete().eq('id', id).select().single();

    if (error) {
      throw new Error(error.message);
    }

    return { data };
  } catch (error) {
    console.error(error);
    return { error: error instanceof Error ? error.message : '삭제 중 오류가 발생했습니다.' };
  }
}
