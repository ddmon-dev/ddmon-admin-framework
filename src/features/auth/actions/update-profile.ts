'use server';

import { createServerClient } from '@/shared/lib/supabase/server';

import { requireAuth } from '../utils/server';
import { hashPassword, verifyPassword } from '../utils/password';
import { type UpdateProfileValues, type UpdateProfileResult } from '../types';

export async function updateProfile(values: UpdateProfileValues): Promise<UpdateProfileResult> {
  // 인증 확인 (로그인한 본인만)
  const user = await requireAuth();

  try {
    const supabase = createServerClient();

    // 비밀번호 변경 시 현재 비밀번호 검증
    if (values.newPassword) {
      if (!values.currentPassword) {
        return { success: false, error: '현재 비밀번호를 입력하세요.' };
      }

      // DB에서 현재 해시된 비밀번호 가져오기
      const { data: adminData, error: fetchError } = await supabase
        .from('admins')
        .select('password')
        .eq('id', user.id)
        .single();

      if (fetchError || !adminData) {
        return { success: false, error: '사용자 정보를 찾을 수 없습니다.' };
      }

      // 현재 비밀번호 검증
      const isValid = await verifyPassword(values.currentPassword, adminData.password);

      if (!isValid) {
        return { success: false, error: '현재 비밀번호가 일치하지 않습니다.' };
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
      if (updateError.code === '23505') {
        // UNIQUE 제약 위반
        return { success: false, error: '이미 사용 중인 이메일입니다.' };
      }
      throw new Error(updateError.message);
    }

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: '프로필을 업데이트하는 중 오류가 발생했습니다.' };
  }
}
