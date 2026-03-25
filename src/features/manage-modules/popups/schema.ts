import { z } from 'zod';

export const writeSchema = z.object({
  lang: z.string().optional(),
  title: z.string().min(1, '제목을 입력해주세요.'),
  content: z.string().min(1, '내용을 입력해주세요.'),
  position_top: z.number().min(0).int(),
  position_left: z.number().min(0).int(),
  width: z.number().min(1).int(),
  is_active: z.boolean(),
  is_always: z.boolean(),
  start_date: z.date().nullish(),
  end_date: z.date().nullish(),
  z_index: z.number().min(0).int(),
});
