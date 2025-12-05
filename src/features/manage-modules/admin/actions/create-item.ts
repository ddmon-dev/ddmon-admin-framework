'use server';

import { APP_CONFIG } from '@/app.config';
import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/shared/lib/supabase/server';
import { transformCamelToSnake, transformSnakeToCamel } from '@/shared/utils/objects';
import { schemaPresets } from '@/shared/schemas';
import { hashPassword } from '@/features/auth';
import { createServerAction } from '@/features/utils/server-actions';
import { Result } from '@/shared/utils/results';
import { CreateItemParams } from '../../_base/types';
import { CONFIG } from '../config';
import { type ItemDTO } from '../config';
import { CRUD_ERRORS, VALIDATION_ERRORS } from '@/shared/constants/error-messages';

export const createItem = createServerAction<CreateItemParams<ItemDTO>, ItemDTO>({
  name: 'createItem',
  auth: { requireSuper: true },
  handler: async ({ values, pathname }) => {
    // confirmPassword 제거
    // superAdmin은 항상 false (최고관리자는 1명만 / 어플리케이션 단에서 생성 불가)
    'confirmPassword' in values && delete values.confirmPassword;
    'superAdmin' in values && delete values.superAdmin;

    // 비밀번호 검증 및 해시
    if (!values.password) {
      return Result.error(VALIDATION_ERRORS.REQUIRED_FIELD('비밀번호'));
    }

    const validatePassword = schemaPresets
      .password({
        strength: APP_CONFIG.AUTH.PASSWORD_STRENGTH,
      })
      .safeParse(values.password);

    if (!validatePassword.success) {
      return Result.error(validatePassword.error.message);
    }

    values.password = await hashPassword(validatePassword.data);

    const supabase = createServerClient();

    const snakedValues = transformCamelToSnake(values);

    const { data, error } = await supabase
      .from(CONFIG.tableName)
      .insert(snakedValues as any)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);

      // 아이디 중복 에러 처리
      if (error.code === '23505') {
        const key = error.details.includes('(id)') ? '아이디' : '이메일';
        return Result.error(CRUD_ERRORS.ALREADY_EXISTS(key));
      }

      return Result.error(CRUD_ERRORS.CREATE_FAILED('관리자'));
    }

    if (pathname) {
      revalidatePath(pathname);
    }

    const createdItem = transformSnakeToCamel(data);

    return Result.success(createdItem as ItemDTO);
  },
});
