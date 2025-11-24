import { z } from 'zod';
import { AUTH_POLICIES } from '@/features/auth';

export const id = () => {
  const message = `아이디는 최소 ${AUTH_POLICIES.ID_MIN_LENGTH}자 이상, 영문자와 숫자만 입력가능합니다.`;
  return z
    .string()
    .min(AUTH_POLICIES.ID_MIN_LENGTH, message)
    .regex(/^[a-zA-Z0-9]+$/, message);
};
