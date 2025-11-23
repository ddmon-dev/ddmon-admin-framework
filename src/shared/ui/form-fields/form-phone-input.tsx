'use client';

import { ReactElement } from 'react';
import { type FieldPath, type FieldValues } from 'react-hook-form';
import { telFilter } from '@/shared/lib/utils/input-filters';
import { FormInput } from './form-input';
import type { FormInputProps } from './form-input';

export type FormPhoneInputProps<
  V extends FieldValues = FieldValues,
  N extends FieldPath<V> = FieldPath<V>
> = Omit<FormInputProps<V, N>, 'customFilter'>;

/**
 * FormPhoneInput - 전화번호 입력 컴포넌트
 *
 * FormInput + telFilter 프리셋
 * - 02/010/070 패턴에 따라 자동 하이픈 삽입
 * - 숫자만 입력 허용
 * - 최대 길이 자동 제한
 *
 * @example
 * ```tsx
 * <FormPhoneInput
 *   control={form.control}
 *   name="phone"
 *   label="전화번호"
 *   placeholder="010-1234-5678"
 * />
 * ```
 */
export const FormPhoneInput = <
  V extends FieldValues = FieldValues,
  N extends FieldPath<V> = FieldPath<V>
>(
  props: FormPhoneInputProps<V, N>
): ReactElement => {
  return (
    <FormInput
      {...props}
      customFilter={telFilter}
    />
  );
};
