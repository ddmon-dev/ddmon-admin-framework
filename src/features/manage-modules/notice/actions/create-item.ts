'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/shared/lib/supabase/server';
import { transformCamelToSnake, transformSnakeToCamel } from '@/shared/utils/objects';
import { createServerAction } from '@/shared/utils/server-actions';
import { Result } from '@/shared/utils/results';
import { CreateItemParams } from '../../_base/config';
import { CONFIG } from '../config';
import { type ItemDTO } from '../config';
import { CRUD_ERRORS } from '@/shared/constants/error-messages';

export const createItem = createServerAction<CreateItemParams<ItemDTO>, ItemDTO>({
  name: 'createItem',
  auth: true,
  handler: async ({ values, pathname }) => {
    const supabase = createServerClient();

    // DB 저장용 값 준비 (파일은 클라이언트에서 이미 업로드 완료)
    const insertValues = {
      ...values,
    };

    const snakedValues = transformCamelToSnake(insertValues);

    // notices 테이블에 레코드 생성
    const { data, error } = await supabase
      .from(CONFIG.tableName)
      .insert(snakedValues as any)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return Result.error(CRUD_ERRORS.CREATE_FAILED());
    }

    // 성공 처리
    if (pathname) {
      revalidatePath(pathname);
    }

    const createdItem = transformSnakeToCamel(data);
    return Result.success(createdItem as ItemDTO);
  },
});
