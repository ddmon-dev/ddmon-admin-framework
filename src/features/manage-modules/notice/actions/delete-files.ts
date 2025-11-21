'use server';

import { createServerClient } from '@/shared/lib/supabase/server';
import { deleteFilesByUrls } from '@/shared/lib/supabase/file-processing';
import { type ActionResult } from '@/shared/types/server-actions';

interface Params {
  entityId: string;
  fileUrls: string[];
}

/**
 * 엔티티의 특정 파일들을 Hard Delete (영구 삭제)
 * 게시글 수정 시 사용자가 명시적으로 삭제한 파일은 복구 불가
 */
export async function deleteFiles({
  entityId,
  fileUrls,
}: Params): Promise<ActionResult<void>> {
  try {
    if (fileUrls.length === 0) {
      return { success: true, data: undefined };
    }

    const supabase = createServerClient();

    // 1. Storage에서 삭제
    await deleteFilesByUrls(fileUrls);

    // 2. DB에서 실제 삭제 (DELETE)
    await supabase
      .from('files')
      .delete()
      .eq('entity_type', 'notices')
      .eq('entity_id', entityId)
      .in('url', fileUrls);

    return { success: true, data: undefined };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '파일 삭제 실패',
    };
  }
}
