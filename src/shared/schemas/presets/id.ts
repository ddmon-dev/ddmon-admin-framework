import { APP_CONFIG } from '@/app.config';
import { z } from 'zod';

export const id = () => {
  const message = `아이디는 최소 ${APP_CONFIG.AUTH.ID_MIN_LENGTH}자 이상, 영문자와 숫자만 입력가능합니다.`;
  return z
    .string()
    .min(APP_CONFIG.AUTH.ID_MIN_LENGTH, message)
    .regex(/^[a-zA-Z0-9]+$/, message);
};
