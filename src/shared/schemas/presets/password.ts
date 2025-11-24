import { z } from 'zod';

/**
 * 비밀번호 강도 레벨
 */
export type PasswordStrength = 'minimum' | 'simple' | 'medium' | 'strong' | 'veryStrong';

/**
 * 비밀번호 프리셋 옵션
 */
export type PasswordPresetOptions = {
  /** 비밀번호 강도 (기본: 'medium') */
  strength?: PasswordStrength;
  /** 최소 길이 (강도별 기본값 무시) */
  minLength?: number;
  /** 최대 길이 (기본: 64, NIST 권장) */
  maxLength?: number;
  /** 빈 문자열 허용 (선택 필드용) */
  allowEmpty?: boolean;
  /** 커스텀 에러 메시지 */
  message?: string;
};

/**
 * 비밀번호 스키마 반환 타입 (조건부 타입)
 */
type PasswordSchema<T extends PasswordPresetOptions | undefined> = T extends { allowEmpty: true }
  ? z.ZodOptional<z.ZodString>
  : z.ZodString;

/**
 * 비밀번호 정책 설정 (NIST 2025 기반)
 */
const PASSWORD_POLICIES = {
  minimum: {
    minLength: 6,
    pattern: /.{6,}/,
    message: '비밀번호는 6자 이상이어야 합니다.',
  },
  simple: {
    minLength: 8,
    pattern: /.{8,}/,
    message: '비밀번호는 8자 이상이어야 합니다.',
  },
  medium: {
    minLength: 8,
    pattern: /^(?=.*[A-Za-z])(?=.*\d).{8,}$/,
    message: '비밀번호는 8자 이상, 영문과 숫자를 포함해야 합니다.',
  },
  strong: {
    minLength: 10,
    pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{10,}$/,
    message: '비밀번호는 10자 이상, 영문 대소문자와 숫자를 포함해야 합니다.',
  },
  veryStrong: {
    minLength: 12,
    pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{12,}$/,
    message: '비밀번호는 12자 이상, 영문 대소문자, 숫자, 특수문자를 모두 포함해야 합니다.',
  },
} as const;

/**
 * 비밀번호 검증
 * - 강도별 패턴 제공 (simple, medium, strong, veryStrong)
 * - NIST 2025 가이드라인 기반
 * - FormPasswordInput과 함께 사용
 *
 * @example
 * // 기본 (보통 강도 - 일반 회원)
 * password: schemaPresets.password()
 *
 * @example
 * // 관리자 계정 (강력한 비밀번호)
 * password: schemaPresets.password({ strength: 'strong' })
 *
 * @example
 * // 슈퍼관리자 (매우 강력한 비밀번호)
 * password: schemaPresets.password({ strength: 'veryStrong' })
 *
 * @example
 * // 로그인 (간단한 검증)
 * password: schemaPresets.password({ strength: 'simple' })
 *
 * @example
 * // 커스텀 최소 길이
 * password: schemaPresets.password({ strength: 'medium', minLength: 10 })
 *
 * @example
 * // 선택 필드 (비밀번호 변경)
 * newPassword: schemaPresets.password({ allowEmpty: true })
 */
export const password = <T extends PasswordPresetOptions | undefined = undefined>(
  options?: T
): PasswordSchema<T> => {
  const strength = options?.strength || 'medium';
  const policy = PASSWORD_POLICIES[strength];
  const minLength = options?.minLength || policy.minLength;
  const maxLength = options?.maxLength || 64; // NIST 권장
  const message = options?.message || policy.message;

  const schema = z
    .string()
    .min(minLength, { message })
    .max(maxLength, { message: `비밀번호는 ${maxLength}자를 초과할 수 없습니다.` })
    .regex(policy.pattern, { message });

  return (options?.allowEmpty ? schema.nullish().or(z.literal('')) : schema) as PasswordSchema<T>;
};
