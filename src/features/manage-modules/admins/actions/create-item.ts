'use server';

import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { APP_CONFIG } from '@/app.config';
import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/shared/lib/supabase/server';
import { schemaPresets } from '@/shared/schemas';
import { hashPassword, requireAuth } from '@/features/auth';
import { Result } from '@/shared/utils/results';
import { GENERAL_ERRORS, CRUD_ERRORS, VALIDATION_ERRORS } from '@/shared/constants/error-messages';
import type { ActionResult } from '@/shared/types/results';
import type { CreateItemParams } from '../../_base/types';
import { CONFIG, type ItemDTO } from '../config';

export async function createItem(params: CreateItemParams<ItemDTO>): Promise<ActionResult<ItemDTO>> {
  const { values, pathname } = params;

  try {
    await requireAuth({ requireSuper: true });

    // confirmPassword 제거
    // super_admin은 항상 false (최고관리자는 1명만 / 어플리케이션 단에서 생성 불가)
    'confirmPassword' in values && delete values.confirmPassword;
    'super_admin' in values && delete values.super_admin;

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

    const { data, error } = await supabase
      .from(CONFIG.tableName)
      .insert(values as any)
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

    return Result.success(data as ItemDTO);
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error('[createItem] Unexpected error:', error);
    return Result.error(GENERAL_ERRORS.UNEXPECTED);
  }
}
