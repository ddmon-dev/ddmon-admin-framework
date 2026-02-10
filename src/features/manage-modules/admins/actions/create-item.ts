'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/shared/lib/supabase/server';
import { hashPassword, requireAuth } from '@/features/auth';
import { Result } from '@/shared/utils/results';
import { GENERAL_ERRORS, CRUD_ERRORS, VALIDATION_ERRORS } from '@/shared/constants/error-messages';
import type { ActionResult } from '@/shared/types/results';
import type { CreateItemParams } from '../../_base/types';
import { CONFIG, type ItemDTO } from '../config';
import { createSchema } from '../schema';

export async function createItem(params: CreateItemParams<ItemDTO>): Promise<ActionResult<ItemDTO>> {
  const { values, pathname } = params;

  await requireAuth(CONFIG.auth);

  try {
    // 스키마 검증 (화이트리스트: confirmPassword, super_admin 등 자동 제거)
    const parsed = createSchema.safeParse(values);
    if (!parsed.success) {
      console.error('[admins/createItem] Validation failed:', parsed.error.flatten());
      return Result.error(VALIDATION_ERRORS.INVALID_INPUT);
    }

    const validatedValues = { ...parsed.data };

    // 비밀번호 해시
    validatedValues.password = await hashPassword(validatedValues.password);

    const supabase = createServerClient();

    const { data, error } = await supabase
      .from(CONFIG.tableName)
      .insert(validatedValues as any)
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
    console.error('[createItem] Unexpected error:', error);
    return Result.error(GENERAL_ERRORS.UNEXPECTED);
  }
}
