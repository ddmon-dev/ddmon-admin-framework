'use server';

import { APP_CONFIG } from '@/app.config';
import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/shared/lib/supabase/server';
import { transformCamelToSnake, transformSnakeToCamel } from '@/shared/utils/objects';
import { schemaPresets } from '@/shared/schemas';
import { hashPassword } from '@/features/auth';
import { createServerAction } from '@/features/utils/server-actions';
import { Result } from '@/shared/utils/results';
import { VALIDATION_ERRORS, CRUD_ERRORS } from '@/shared/constants/error-messages';
import { UpdateItemParams } from '../../_base/types';
import { CONFIG } from '../config';
import { type ItemDTO } from '../config';

export const updateItem = createServerAction<UpdateItemParams<ItemDTO>, ItemDTO>({
  name: 'updateItem',
  auth: { requireSuper: true },
  handler: async ({ id, values, pathname }) => {
    if (!id) {
      return Result.error(VALIDATION_ERRORS.NO_ID);
    }

    // 아이디는 수정 불가
    // 비밀번호 확인은 제거
    // 삭제는 업데이트 액션에서 처리하지 않음
    'id' in values && delete values.id;
    'confirmPassword' in values && delete values.confirmPassword;
    'deleted' in values && delete values.deleted;

    // 비밀번호가 있으면 검증 후 해시, 빈 값이면 제거
    if (values.password) {
      const validatePassword = schemaPresets
        .password({
          strength: APP_CONFIG.AUTH.PASSWORD_STRENGTH,
        })
        .safeParse(values.password);

      if (!validatePassword.success) {
        return Result.error(validatePassword.error.message);
      }

      values.password = await hashPassword(validatePassword.data);
    } else {
      delete values.password;
    }

    // 최고관리자 설정은 할 수 없음
    if ('superAdmin' in values) {
      return Result.error('최고관리자 설정은 할 수 없습니다.');
    }

    const supabase = createServerClient();

    const snakedValues = transformCamelToSnake(values);

    const { data, error } = await supabase
      .from(CONFIG.tableName)
      .update(snakedValues as any)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return Result.error(CRUD_ERRORS.UPDATE_FAILED('관리자'));
    }

    if (pathname) {
      revalidatePath(pathname);
    }

    const updatedItem = transformSnakeToCamel(data);

    return Result.success(updatedItem as ItemDTO);
  },
});
