'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/shared/lib/supabase/server';
import { transformCamelToSnake, transformSnakeToCamel } from '@/shared/lib/utils/objects';
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

    // DB 저장용 값 준비 (파일은 클라이언트에서 이미 업로드 완료)
    const insertValues = {
      ...values,
      id: noticeId,
    };

    const snakedValues = transformCamelToSnake(insertValues);

    // notices 테이블에 레코드 생성
    const { data, error } = await supabase
      .from(CONFIG.tableName)
      .insert(snakedValues as any)
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
    const createdItem = transformSnakeToCamel(data);

    return { success: true, data: createdItem as ItemDTO };
  } catch (error) {
    console.error(error);
    return { success: false, error: '데이터를 생성하는 중 오류가 발생했습니다.' };
  }
}
