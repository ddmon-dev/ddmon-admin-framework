import { z } from 'zod';

export const writeSchema = z.object({
  lang: z.string().optional(),
  category: z.string().min(1, '카테고리를 선택해주세요.'),
  question: z.string().min(1, '질문을 입력해주세요.'),
  answer: z.string().min(1, '답변을 입력해주세요.'),
});
