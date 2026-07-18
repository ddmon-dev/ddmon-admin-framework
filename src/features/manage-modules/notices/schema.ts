import { z } from 'zod';
import { schemaPresets } from '@/shared/schemas';

export const writeSchema = z.object({
  lang: z.string().optional(),
  category: z.string().min(1, '카테고리를 선택해주세요.'),
  created_at: z.date().nullish(),
  view_count: schemaPresets.numberRange(),
  title: z.string().min(1, '제목을 입력해주세요.'),
  content: z.string().min(1, '내용을 입력해주세요.'),
  files: schemaPresets.dbFiles().optional(),
});
