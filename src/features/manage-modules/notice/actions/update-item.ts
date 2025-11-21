'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/shared/lib/supabase/server';
import { transformCamelToSnake, transformSnakeToCamel } from '@/shared/lib/utils/objects';
import { updateEntityFiles } from '../../_base/utils/entity-file-operations';
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

    // files 필드 분리
    const { files, ...restValues } = values;

    // DB 저장용 값 준비 (files 제외)
    const snakedValues = transformCamelToSnake(restValues);

    // 1. notices 테이블 업데이트
    const { data, error } = await supabase
      .from(CONFIG.tableName)
      .update(snakedValues as any)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    // 2. files 테이블 업데이트 (새 파일 추가 + 삭제 표시된 파일 제거)
    await updateEntityFiles('notices', id, files);

    // 3. 패스 재검증
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
