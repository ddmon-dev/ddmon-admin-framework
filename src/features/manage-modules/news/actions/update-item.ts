'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/shared/lib/supabase/server';
import { transformCamelToSnake, transformSnakeToCamel } from '@/shared/lib/utils/objects';
import { extractAllFileUrls, deleteFilesFromStorage } from '@/shared/lib/file-system';

import { type UpdateResult } from '../../_base/types';

import { CONFIG } from '../config';
import { type ItemDTO } from '../types';

interface Params {
  id: string;
  values: Partial<ItemDTO>;
  pathname?: string;
}

export async function updateItem({ id, values, pathname }: Params): Promise<UpdateResult<ItemDTO>> {
  try {
    if (!id) {
      throw new Error('ID값이 없습니다.');
    }

    const supabase = createServerClient();

    // 파일이 있을 때만 기존 파일 조회
    let oldFiles: any;
    if ('files' in values && values.files) {
      const { data: oldData } = await supabase
        .from(CONFIG.tableName)
        .select('files')
        .eq('id', id)
        .single();
      oldFiles = oldData?.files;
    }

    // DB 저장용 값 준비
    const snakedValues = transformCamelToSnake(values);

    // 테이블 업데이트
    const { data, error } = await supabase
      .from(CONFIG.tableName)
      .update(snakedValues as any)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    // 삭제된 파일 Storage에서 제거
    if (oldFiles && values.files) {
      const oldUrls = extractAllFileUrls(oldFiles);
      const newUrls = extractAllFileUrls(values.files);
      const deletedUrls = oldUrls.filter(url => !newUrls.includes(url));

      if (deletedUrls.length > 0) {
        await deleteFilesFromStorage(deletedUrls);
      }
    }

    // 패스 재검증
    if (pathname) {
      revalidatePath(pathname);
    }

    // snake_case → camelCase 변환
    const updatedItem = transformSnakeToCamel(data);

    return { success: true, data: updatedItem as ItemDTO };
  } catch (error) {
    console.error(error);
    return { success: false, error: '데이터를 업데이트하는 중 오류가 발생했습니다.' };
  }
}
