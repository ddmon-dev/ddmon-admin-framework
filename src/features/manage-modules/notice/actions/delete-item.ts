'use server';

import { revalidatePath } from 'next/cache';
import { transformSnakeToCamel } from '@/shared/lib/utils/objects';
import { softDelete } from '../../_base/utils/db-operations';
import { CONFIG } from '../config';
import { type DeleteResult } from '../../_base/types';
import { type ItemDTO } from '../types';

interface Params {
  id: string;
  path?: string;
}

/**
 * Soft Delete: deleted = true로 설정
 * Storage 파일은 유지 (복구 가능)
 */
export async function deleteItem({ id, path }: Params): Promise<DeleteResult<ItemDTO>> {
  try {
    // notices 테이블에서 soft delete 수행
    const { data, error } = await softDelete(CONFIG.tableName, id);

    if (error) {
      return { success: false, error };
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
    return { success: false, error: '데이터를 삭제하는 중 오류가 발생했습니다.' };
  }
}
