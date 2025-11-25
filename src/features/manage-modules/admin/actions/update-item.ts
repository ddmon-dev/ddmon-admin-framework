'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/shared/lib/supabase/server';
import { transformCamelToSnake, transformSnakeToCamel } from '@/shared/utils/objects';
import { schemaPresets } from '@/shared/schemas';
import { auth, requireAuth, hashPassword, AUTH_POLICIES } from '@/features/auth';

import { type UpdateResult } from '../../_base/config';
import { CONFIG } from '../config';
import { type ItemDTO } from '../config';

interface Params {
  id: string;
  values: Partial<ItemDTO>;
  pathname?: string;
}

export async function updateItem({ id, values, pathname }: Params): Promise<UpdateResult<ItemDTO>> {
  // 최고관리자만 접근 가능
  await requireAuth({ requireSuper: true });

  try {
    if (!id) {
      throw new Error('ID값이 없습니다.');
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
          strength: AUTH_POLICIES.PASSWORD_STRENGTH,
        })
        .safeParse(values.password);

      if (!validatePassword.success) {
        throw new Error(validatePassword.error.message);
      }

      values.password = await hashPassword(validatePassword.data);
    } else {
      delete values.password;
    }

    // 최고관리자 설정은 할 수 없음
    if ('superAdmin' in values) {
      throw new Error('최고관리자 설정은 할 수 없습니다.');
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
      throw new Error(error.message);
    }

    if (pathname) {
      revalidatePath(pathname);
    }

    const updatedItem = transformSnakeToCamel(data);

    return { success: true, data: updatedItem as ItemDTO };
  } catch (error) {
    console.error(error);
    return { success: false, error: '데이터를 업데이트하는 중 오류가 발생했습니다.' };
  }
}
