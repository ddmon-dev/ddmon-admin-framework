import { email, phone, url, files, dateRange, numberRange } from './presets/common';
import { password } from './presets/password';

// 타입 re-export
export type { PasswordStrength, PasswordPresetOptions } from './presets/password';

/**
 * 복잡한 타입의 폼 필드를 위한 Zod 스키마 프리셋
 *
 * 검증 로직이 반복되거나 에러 메시지를 통일해야 하는 경우 사용합니다.
 *
 * @example
 * ```tsx
 * import { schemaPresets } from '@/shared/schemas';
 *
 * const schema = z.object({
 *   name: z.string().min(1, '이름을 입력하세요'),  // 단순 검증
 *   email: schemaPresets.email({ optional: true }),  // 프리셋 사용
 *   phone: schemaPresets.phone({ optional: true }),
 *   website: schemaPresets.url({ optional: true }),
 *   password: schemaPresets.password({ strength: 'strong' }),  // 비밀번호 검증
 *   files: schemaPresets.files({ thumbnail: 1, attachments: 0 }),
 *   viewCount: schemaPresets.numberRange(),  // 숫자 범위 검증
 * });
 * ```
 */
export const schemaPresets = {
  email,
  phone,
  url,
  password,
  files,
  dateRange,
  numberRange,
};
