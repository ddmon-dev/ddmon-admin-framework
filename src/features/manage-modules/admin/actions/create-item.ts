'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/shared/lib/supabase/server';
import { transformCamelToSnake, transformSnakeToCamel } from '@/shared/utils/objects';
import { schemaPresets } from '@/shared/schemas';
import { auth } from '@/features/auth';
import { hashPassword } from '@/features/auth/utils';
import { AUTH_POLICIES } from '@/features/auth/constants';

import { type CreateResult } from '../../_base/config';

import { CONFIG } from '../config';
import { type ItemDTO } from '../config';

interface Params {
  values: Partial<ItemDTO>;
  pathname?: string;
}

export async function createItem({ values, pathname }: Params): Promise<CreateResult<ItemDTO>> {
  try {
    // 최고관리자만 관리 메뉴를 통한 관리자 계정 생성 가능
    const session = await auth();
    const isSuperAdmin = session?.user.superAdmin;

    if (!isSuperAdmin) {
      throw new Error('최고관리자만 생성할 수 있습니다.');
    }

    // confirmPassword 제거
    // superAdmin은 항상 false (최고관리자는 1명만 / 어플리케이션 단에서 생성 불가)
    'confirmPassword' in values && delete values.confirmPassword;
    'superAdmin' in values && delete values.superAdmin;

    // 비밀번호 검증 및 해시
    if (!values.password) {
      throw new Error('비밀번호는 필수입니다.');
    }

    const validatePassword = schemaPresets
      .password({
        strength: AUTH_POLICIES.PASSWORD_STRENGTH,
      })
      .safeParse(values.password);

    if (!validatePassword.success) {
      throw new Error(validatePassword.error.message);
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
      throw new Error(error.message);
    }

    if (pathname) {
      revalidatePath(pathname);
    }

    const createdItem = transformSnakeToCamel(data);

    return { success: true, data: createdItem as ItemDTO };
  } catch (error) {
    console.error(error);
    return { success: false, error: '데이터를 생성하는 중 오류가 발생했습니다.' };
  }
}
