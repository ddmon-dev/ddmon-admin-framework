'use server';

import { revalidatePath } from 'next/cache';
import { transformSnakeToCamel } from '@/shared/lib/utils/objects';
import { createServerClient } from '@/shared/lib/supabase/server';
import { deleteFolderFromStorage } from '@/shared/lib/file-system';
import { type TableName } from '@/shared/lib/supabase/db-helpers';
import { type DeleteResult } from '../types';

interface Params {
  tableName: TableName;
  id: string;
  pathname?: string;
}

/**
 * Soft delete: deleted 컬럼을 true로 설정
 */
export async function softDelete<T>({ tableName, id, pathname }: Params): Promise<DeleteResult<T>> {
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

    // 패스 재검증
    if (pathname) {
      revalidatePath(pathname);
    }

    const deletedItem = transformSnakeToCamel(data);

    return { success: true, data: deletedItem as T };
  } catch (error) {
    console.error(error);
    return { success: false, error: '데이터를 삭제하는 중 오류가 발생했습니다.' };
  }
}

/**
 * Hard delete: 실제로 데이터를 삭제
 */
export async function hardDelete<T>({ tableName, id, pathname }: Params): Promise<DeleteResult<T>> {
  try {
    if (!id) {
      throw new Error('ID값이 없습니다.');
    }

    const supabase = createServerClient();

    // DB에서 완전 삭제
    const { data, error } = await supabase.from(tableName).delete().eq('id', id).select().single();

    if (error) {
      throw new Error(error.message);
    }

    // Storage 폴더 전체 삭제
    const folderPath = `${tableName}/${id}`;
    await deleteFolderFromStorage(folderPath);

    // 패스 재검증
    if (pathname) {
      revalidatePath(pathname);
    }

    const deletedItem = transformSnakeToCamel(data);

    return { success: true, data: deletedItem as T };
  } catch (error) {
    console.error(error);
    return { success: false, error: '데이터를 삭제하는 중 오류가 발생했습니다.' };
  }
}
