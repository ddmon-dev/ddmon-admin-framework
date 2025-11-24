import { z } from 'zod';

/**
 * 스키마 프리셋 반환 타입 (조건부 타입)
 * - optional: true → z.ZodOptional<z.ZodString>
 * - optional: false or 없음 → z.ZodString
 */
export type PresetSchema<T extends { optional?: boolean } | undefined> = T extends {
  optional: true;
}
  ? z.ZodOptional<z.ZodString>
  : z.ZodString;
