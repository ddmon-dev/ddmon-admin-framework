'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/shared/lib/supabase/server';
import { deleteFolderFromStorage } from '@/shared/lib/file-system';
import { transformSnakeToCamel } from '@/shared/lib/utils/objects';
import { CONFIG } from '../config';
import { type DeleteResult } from '../../_base/types';
import { type ItemDTO } from '../types';

interface Params {
  id: string;
  path?: string;
}

/**
 * 게시글 영구 삭제 (복구 불가능)
 * DB에서 완전히 삭제하고 Storage 폴더 전체 삭제
 * 휴지통 화면에서 사용
 */
export async function hardDeleteItem({ id, path }: Params): Promise<DeleteResult<ItemDTO>> {
  try {
    const supabase = createServerClient();

    // Storage 폴더 전체 삭제
    const folderPath = `${CONFIG.tableName}/${id}`;
    await deleteFolderFromStorage(folderPath);

    // DB에서 완전 삭제
    const { data, error } = await supabase
      .from(CONFIG.tableName)
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    // 패스 재검증
    if (path) {
      revalidatePath(path);
    }

    // snake_case → camelCase 변환
    const deletedItem = transformSnakeToCamel(data);

    return { success: true, data: deletedItem as ItemDTO };
  } catch (error) {
    console.error(error);
    return { success: false, error: '데이터를 영구 삭제하는 중 오류가 발생했습니다.' };
  }
}
