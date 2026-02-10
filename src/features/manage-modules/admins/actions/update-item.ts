'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/shared/lib/supabase/server';
import { hashPassword, requireAuth } from '@/features/auth';
import { Result } from '@/shared/utils/results';
import { GENERAL_ERRORS, VALIDATION_ERRORS, CRUD_ERRORS } from '@/shared/constants/error-messages';
import type { ActionResult } from '@/shared/types/results';
import type { UpdateItemParams } from '../../_base/types';
import { CONFIG, type ItemDTO } from '../config';
import { updateSchema } from '../schema';

export async function updateItem(params: UpdateItemParams<ItemDTO>): Promise<ActionResult<ItemDTO>> {
  const { id, values, pathname } = params;

  if (!id) {
    return Result.error(VALIDATION_ERRORS.NO_ID);
  }

  await requireAuth(CONFIG.auth);

  try {
    // 스키마 검증 (화이트리스트: id, confirmPassword, deleted, super_admin 등 자동 제거)
    const parsed = updateSchema.safeParse(values);
    if (!parsed.success) {
      console.error('[admins/updateItem] Validation failed:', parsed.error.flatten());
      return Result.error(VALIDATION_ERRORS.INVALID_INPUT);
    }

    const validatedValues: Record<string, any> = { ...parsed.data };

    // 비밀번호가 있으면 해시, 빈 값이면 제거
    if (validatedValues.password) {
      validatedValues.password = await hashPassword(validatedValues.password);
    } else {
      delete validatedValues.password;
    }

    const supabase = createServerClient();

    const { data, error } = await supabase
      .from(CONFIG.tableName)
      .update(validatedValues as any)
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
    console.error('[updateItem] Unexpected error:', error);
    return Result.error(GENERAL_ERRORS.UNEXPECTED);
  }
}
