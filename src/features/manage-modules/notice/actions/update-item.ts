'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/shared/lib/supabase/server';
import { transformCamelToSnake, transformSnakeToCamel } from '@/shared/lib/utils/objects';
import { extractAllFileUrls, deleteFilesFromStorage } from '@/shared/lib/file-system';
import { CONFIG } from '../config';
import { type ItemDTO, type UpdateItemValues } from '../types';
import { type UpdateResult } from '../../_base/types';

interface Params {
  id: string;
  values: UpdateItemValues;
  path?: string;
}

export async function updateItem({ id, values, path }: Params): Promise<UpdateResult<ItemDTO>> {
  try {
    if (!id) {
      throw new Error('ID값이 없습니다.');
    }

    const supabase = createServerClient();

    // 1. 기존 files 조회 (삭제된 파일 확인용)
    const { data: oldData } = await supabase
      .from(CONFIG.tableName)
      .select('files')
      .eq('id', id)
      .single();

    // 2. DB 저장용 값 준비
    const snakedValues = transformCamelToSnake(values);

    // 3. notices 테이블 업데이트
    const { data, error } = await supabase
      .from(CONFIG.tableName)
      .update(snakedValues as any)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    // 4. 삭제된 파일 확인 및 Storage 삭제
    const oldUrls = extractAllFileUrls((oldData as any)?.files);
    const newUrls = extractAllFileUrls((values as any).files);
    const deletedUrls = oldUrls.filter(url => !newUrls.includes(url));

    if (deletedUrls.length > 0) {
      await deleteFilesFromStorage(deletedUrls);
    }

    // 5. 패스 재검증
    if (path) {
      revalidatePath(path);
    }

    // snake_case → camelCase 변환
    const updatedItem = transformSnakeToCamel(data);

    return { success: true, data: updatedItem as ItemDTO };
  } catch (error) {
    console.error(error);
    return { success: false, error: '데이터를 업데이트하는 중 오류가 발생했습니다.' };
  }
}
