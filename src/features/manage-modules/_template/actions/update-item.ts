'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/shared/lib/supabase/server';
import { transformCamelToSnake, transformSnakeToCamel } from '@/shared/utils/objects';
import { extractAllFileUrls, deleteFilesFromStorage } from '@/shared/lib/file-system';
import { createServerAction, ActionResult } from '@/shared/utils/server-actions';
import { VALIDATION_ERRORS } from '@/shared/constants/error-messages';
import { UpdateItemParams } from '../../_base/config';
import { CONFIG } from '../config';
import { type ItemDTO } from '../config';

export const updateItem = createServerAction<UpdateItemParams<ItemDTO>, ItemDTO>({
  name: 'updateItem',
  auth: true,
  validate: params => {
    if (!params.id) {
      return ActionResult.error(VALIDATION_ERRORS.NO_ID);
    }
    return null;
  },
  handler: async ({ id, values, pathname }) => {
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

    const snakedValues = transformCamelToSnake(values);

    const { data, error } = await supabase
      .from(CONFIG.tableName)
      .update(snakedValues as any)
      .eq('id', id)
      .select()
      .single();

    // 예상 가능한 Supabase 에러
    if (error) {
      console.error('Supabase error:', error);
      return ActionResult.error(error.message);
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

    // 성공 처리
    if (pathname) {
      revalidatePath(pathname);
    }

    const updatedItem = transformSnakeToCamel(data);
    return ActionResult.success(updatedItem as ItemDTO);
  },
});
