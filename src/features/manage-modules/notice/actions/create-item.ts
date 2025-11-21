'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/shared/lib/supabase/server';
import { transformCamelToSnake, transformSnakeToCamel } from '@/shared/lib/utils/objects';
import {
  createEntityFiles,
  deleteEntityFiles,
} from '../../_base/utils/entity-file-operations';
import { CONFIG } from '../config';
import { type ItemDTO, type CreateItemValues } from '../types';
import { type CreateResult } from '../../_base/types';

interface Params {
  values: CreateItemValues;
  path?: string;
}

export async function createItem({ values, path }: Params): Promise<CreateResult<ItemDTO>> {
  const noticeId = crypto.randomUUID();

  try {
    const supabase = createServerClient();

    // files 필드 분리
    const { files, ...restValues } = values;

    // DB 저장용 값 준비 (files 제외)
    const insertValues = {
      ...restValues,
      id: noticeId,
    };

    const snakedValues = transformCamelToSnake(insertValues);

    // 1. notices 테이블에 레코드 생성
    const { data, error } = await supabase
      .from(CONFIG.tableName)
      .insert(snakedValues as any)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    // 2. files 테이블에 파일 저장
    await createEntityFiles('notices', noticeId, files);

    // 3. 패스 재검증
    if (path) {
      revalidatePath(path);
    }

    // snake_case → camelCase 변환
    const createdItem = transformSnakeToCamel(data);

    return { success: true, data: createdItem as ItemDTO };
  } catch (error) {
    console.error(error);

    // 실패 시 notices 레코드 및 업로드된 파일 삭제 (롤백)
    await deleteEntityFiles('notices', noticeId);

    const supabase = createServerClient();
    await supabase.from(CONFIG.tableName).delete().eq('id', noticeId);

    return { success: false, error: '데이터를 생성하는 중 오류가 발생했습니다.' };
  }
}
