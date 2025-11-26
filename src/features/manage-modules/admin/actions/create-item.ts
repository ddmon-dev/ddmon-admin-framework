'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/shared/lib/supabase/server';
import { transformCamelToSnake, transformSnakeToCamel } from '@/shared/utils/objects';
import { schemaPresets } from '@/shared/schemas';
import { hashPassword, AUTH_POLICIES } from '@/features/auth';
import { createServerAction, ActionResult } from '@/shared/utils/server-actions';
import { CreateItemParams } from '../../_base/config';
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
      return ActionResult.error(VALIDATION_ERRORS.REQUIRED_FIELD('비밀번호'));
    }

    const validatePassword = schemaPresets
      .password({
        strength: AUTH_POLICIES.PASSWORD_STRENGTH,
      })
      .safeParse(values.password);

    if (!validatePassword.success) {
      return ActionResult.error(validatePassword.error.message);
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
      return ActionResult.error(CRUD_ERRORS.CREATE_FAILED('관리자'));
    }

    if (pathname) {
      revalidatePath(pathname);
    }

    const createdItem = transformSnakeToCamel(data);

    return ActionResult.success(createdItem as ItemDTO);
  },
});
