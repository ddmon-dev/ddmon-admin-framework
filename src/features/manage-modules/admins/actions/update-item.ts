'use server';

import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { APP_CONFIG } from '@/app.config';
import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/shared/lib/supabase/server';
import { schemaPresets } from '@/shared/schemas';
import { hashPassword, requireAuth } from '@/features/auth';
import { Result } from '@/shared/utils/results';
import { GENERAL_ERRORS, VALIDATION_ERRORS, CRUD_ERRORS } from '@/shared/constants/error-messages';
import type { ActionResult } from '@/shared/types/results';
import type { UpdateItemParams } from '../../_base/types';
import { CONFIG, type ItemDTO } from '../config';

export async function updateItem(params: UpdateItemParams<ItemDTO>): Promise<ActionResult<ItemDTO>> {
  const { id, values, pathname } = params;

  try {
    if (!id) {
      return Result.error(VALIDATION_ERRORS.NO_ID);
    }

    await requireAuth({ requireSuper: true });

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
    if ('super_admin' in values) {
      return Result.error(`${APP_CONFIG.AUTH.ADMIN_LABELS.SUPER_ADMIN} 설정은 할 수 없습니다.`);
    }

    const supabase = createServerClient();

    const { data, error } = await supabase
      .from(CONFIG.tableName)
      .update(values as any)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);

      // 아이디 중복 에러 처리
      if (error.code === '23505') {
        const key = error.details.includes('(id)') ? '아이디' : '이메일';
        return Result.error(CRUD_ERRORS.ALREADY_EXISTS(key));
      }

      return Result.error(CRUD_ERRORS.UPDATE_FAILED('관리자'));
    }

    if (pathname) {
      revalidatePath(pathname);
    }

    return Result.success(data as ItemDTO);
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error('[updateItem] Unexpected error:', error);
    return Result.error(GENERAL_ERRORS.UNEXPECTED);
  }
}
