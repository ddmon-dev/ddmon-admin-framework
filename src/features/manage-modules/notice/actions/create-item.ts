'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/shared/lib/supabase/server';
import { transformCamelToSnake, transformSnakeToCamel } from '@/shared/lib/utils/objects';
import {
  processFiles,
  rollbackFiles,
  type ProcessedFiles,
} from '@/shared/lib/supabase/file-processing';
import { CONFIG } from '../config';
import { type ItemDTO, type CreateItemValues } from '../types';
import { type CreateResult } from '../../_base/types';

interface Params {
  values: CreateItemValues;
  path?: string;
}

export async function createItem({ values, path }: Params): Promise<CreateResult<ItemDTO>> {
  const noticeId = crypto.randomUUID();
  let uploadedFiles: ProcessedFiles = {};

  try {
    const supabase = createServerClient();

    // 파일 처리 (업로드 + 메타데이터 생성)
    uploadedFiles = await processFiles({
      filesInput: values.files as any,
      folder: `notices/${noticeId}`,
    });

    // DB 저장용 값 준비
    const insertValues = {
      ...values,
      id: noticeId,
      files: uploadedFiles,
    };

    const snakedValues = transformCamelToSnake(insertValues);

    // DB 저장
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

    // 실패 시 업로드된 파일 자동 삭제 (롤백)
    await rollbackFiles(uploadedFiles);

    return { success: false, error: '데이터를 생성하는 중 오류가 발생했습니다.' };
  }
}
