import { z } from 'zod';
import { schemaPresets } from '@/shared/schemas';
import { VALIDATION_ERRORS } from '@/shared/constants/error-messages';

export const updateProfileSchema = z.object({
  name: z.string().min(3, VALIDATION_ERRORS.TOO_SHORT('이름', 3)),
  email: schemaPresets.email(),
  currentPassword: schemaPresets.password({ optional: true, strength: 'minimum' }),
  newPassword: schemaPresets.password({ optional: true, strength: 'minimum' }),
});
