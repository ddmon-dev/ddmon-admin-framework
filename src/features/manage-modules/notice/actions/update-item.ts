'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/shared/lib/supabase/server';
import { transformCamelToSnake, transformSnakeToCamel } from '@/shared/lib/utils/objects';
import {
  processFiles,
  rollbackFiles,
  deleteFilesByUrls,
  type ProcessedFiles,
  type FileUploadValue,
} from '@/shared/lib/supabase/file-processing';
import { CONFIG } from '../config';
import { type ItemDTO, type UpdateItemValues } from '../types';
import { type UpdateResult } from '../../_base/types';

interface Params {
  id: string;
  values: UpdateItemValues;
  path?: string;
}

export async function updateItem({ id, values, path }: Params): Promise<UpdateResult<ItemDTO>> {
  let uploadedFiles: ProcessedFiles = {};
  const deletedUrls: string[] = [];

  try {
    if (!id) {
      throw new Error('ID값이 없습니다.');
    }

    const supabase = createServerClient();

    // 삭제 표시된 파일 URL 추출
    if (values.files) {
      for (const files of Object.values(values.files)) {
        if (files) {
          const markedFiles = (files as FileUploadValue[]).filter(
            (f): f is Extract<FileUploadValue, { type: 'existing' }> =>
              f?.type === 'existing' && f.markedForDeletion === true
          );
          deletedUrls.push(...markedFiles.map(f => f.url));
        }
      }
    }

    // 파일 처리 (업로드 + 메타데이터 생성)
    uploadedFiles = await processFiles({
      filesInput: values.files as any,
      folder: `notices/${id}`,
    });

    // DB 저장용 값 준비
    const updateValues = {
      ...values,
      files: uploadedFiles,
    };

    const snakedValues = transformCamelToSnake(updateValues);

    // DB 업데이트
    const { data, error } = await supabase
      .from(CONFIG.tableName)
      .update(snakedValues as any)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    // 삭제 표시된 파일 Storage에서 삭제
    if (deletedUrls.length > 0) {
      await deleteFilesByUrls(deletedUrls);
    }

    // 패스 재검증
    if (path) {
      revalidatePath(path);
    }

    // snake_case → camelCase 변환
    const updatedItem = transformSnakeToCamel(data);

    return { success: true, data: updatedItem as ItemDTO };
  } catch (error) {
    console.error(error);

    // 실패 시 업로드된 파일 자동 삭제 (롤백)
    await rollbackFiles(uploadedFiles);

    return { success: false, error: '데이터를 업데이트하는 중 오류가 발생했습니다.' };
  }
}
