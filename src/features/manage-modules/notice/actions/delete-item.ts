'use server';

import { revalidatePath } from 'next/cache';
import { transformSnakeToCamel } from '@/shared/lib/utils/objects';
import { softDelete } from '../../_base/utils/db-operations';
import { deleteFilesByUrls } from '@/shared/lib/supabase/file-processing';
import { CONFIG } from '../config';
import { type DeleteResult } from '../../_base/types';
import { type ItemDTO } from '../types';
import { getItem } from './get-item';

interface Params {
  id: string;
  path?: string;
}

export async function deleteItem({ id, path }: Params): Promise<DeleteResult<ItemDTO>> {
  try {
    // 1. 항목 조회하여 첨부 파일 확인
    const { success: getSuccess, data: item } = await getItem({ id });

    // 2. 첨부 파일이 있으면 삭제
    if (getSuccess && item?.files) {
      // 모든 카테고리의 파일 URL을 동적으로 추출
      const allFileUrls = Object.values(item.files)
        .flat()
        .map(f => f.url);

      if (allFileUrls.length > 0) {
        await deleteFilesByUrls(allFileUrls);
      }
    }

    // 3. Base 유틸리티를 사용하여 soft delete 수행
    const { data, error } = await softDelete(CONFIG.tableName, id);

    if (error) {
      return { success: false, error };
    }

    // 4. 패스 재검증
    if (path) {
      revalidatePath(path);
    }

    // 5. snake_case → camelCase 변환
    const deletedItem = transformSnakeToCamel(data);

    return { success: true, data: deletedItem as ItemDTO };
  } catch (error) {
    console.error(error);
    return { success: false, error: '데이터를 삭제하는 중 오류가 발생했습니다.' };
  }
}
