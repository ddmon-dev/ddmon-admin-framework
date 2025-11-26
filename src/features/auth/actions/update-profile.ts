'use server';

import { createServerClient } from '@/shared/lib/supabase/server';
import { createServerAction } from '@/shared/utils/server-actions';
import { Result } from '@/shared/utils/results';
import { CRUD_ERRORS, VALIDATION_ERRORS } from '@/shared/constants/error-messages';

import { requireAuth } from '../utils/server';
import { hashPassword, verifyPassword } from '../utils/password';
import { type UpdateProfileValues } from '../types';

export const updateProfile = createServerAction<UpdateProfileValues, void>({
  name: 'updateProfile',
  auth: true,
  validate: values => {
    // 새 비밀번호가 있으면 현재 비밀번호도 필수
    if (values.newPassword && !values.currentPassword) {
      return Result.error(VALIDATION_ERRORS.REQUIRED_FIELD('현재 비밀번호'));
    }
    return null;
  },
  handler: async values => {
    const user = await requireAuth();
    const supabase = createServerClient();

    // 비밀번호 변경 시 현재 비밀번호 검증
    if (values.newPassword) {
      // DB에서 현재 해시된 비밀번호 가져오기
      const { data: adminData, error: fetchError } = await supabase
        .from('admins')
        .select('password')
        .eq('id', user.id)
        .single();

      if (fetchError || !adminData) {
        return Result.error(CRUD_ERRORS.NOT_FOUND('사용자 정보'));
      }

      // 현재 비밀번호 검증
      const isValid = await verifyPassword(values.currentPassword!, adminData.password);

      if (!isValid) {
        return Result.error('현재 비밀번호가 일치하지 않습니다.');
      }
    }

    // 업데이트 데이터 준비
    const updateData: Record<string, string> = {
      name: values.name,
      email: values.email,
    };

    // 새 비밀번호가 있으면 해시 후 추가
    if (values.newPassword) {
      updateData.password = await hashPassword(values.newPassword);
    }

    // DB 업데이트 (본인만)
    const { error: updateError } = await supabase
      .from('admins')
      .update(updateData)
      .eq('id', user.id);

    if (updateError) {
      console.error('Supabase error:', updateError);
      if (updateError.code === '23505') {
        // UNIQUE 제약 위반
        return Result.error(CRUD_ERRORS.DUPLICATE('이메일'));
      }
      return Result.error(CRUD_ERRORS.UPDATE_FAILED('프로필'));
    }

    return Result.ok();
  },
});
