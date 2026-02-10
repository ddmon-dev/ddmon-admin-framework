import { z } from 'zod';
import { schemaPresets } from '@/shared/schemas';
import { APP_CONFIG } from '@/app.config';

export const createSchema = z.object({
  id: schemaPresets.id(),
  name: z.string().min(3, '이름은 3자 이상 입력해주세요.'),
  password: schemaPresets.password({ strength: APP_CONFIG.AUTH.PASSWORD_STRENGTH }),
  email: schemaPresets.email(),
});

export const updateSchema = z.object({
  name: z.string().min(3, '이름은 3자 이상 입력해주세요.'),
  password: schemaPresets.password({
    optional: true,
    strength: APP_CONFIG.AUTH.PASSWORD_STRENGTH,
  }),
  email: schemaPresets.email(),
});
