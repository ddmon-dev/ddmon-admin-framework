'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/shared/lib/supabase/server';
import { deleteFolderFromStorage } from '@/shared/lib/file-system';
import { CONFIG } from '../config';
import { type ActionResult } from '@/shared/types/server-actions';

interface Params {
  id: string;
  path?: string;
}

/**
 * 게시글 영구 삭제 (복구 불가능)
 * DB에서 완전히 삭제하고 Storage 폴더 전체 삭제
 * 휴지통 화면에서 사용
 */
export async function hardDeleteItem({ id, path }: Params): Promise<ActionResult<void>> {
  try {
    const supabase = createServerClient();

    // 1. Storage 폴더 전체 삭제
    const folderPath = `notices/${id}`;
    await deleteFolderFromStorage(folderPath);

    // 2. DB에서 완전 삭제
    const { error } = await supabase.from(CONFIG.tableName).delete().eq('id', id);

    if (error) {
      throw new Error(error.message);
    }

    // 3. 패스 재검증
    if (path) {
      revalidatePath(path);
    }

    return { success: true, data: undefined };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : '데이터를 영구 삭제하는 중 오류가 발생했습니다.',
    };
  }
}
