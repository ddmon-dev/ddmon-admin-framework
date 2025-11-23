'use client';

import { ReactElement } from 'react';
import { type FieldPath, type FieldValues } from 'react-hook-form';
import { PatternFormat } from 'react-number-format';
import { Input } from '@/shared/ui/input';
import { FormField } from './form-field';
import type { FormBaseProps } from './types';

export type FormPhoneInputProps<
  V extends FieldValues = FieldValues,
  N extends FieldPath<V> = FieldPath<V>
> = FormBaseProps<V, N> & {
  /** placeholder */
  placeholder?: string;
};

/**
 * FormPhoneInput - 전화번호 입력 전용 컴포넌트 (react-number-format 기반)
 *
 * 자동으로 하이픈을 삽입하여 전화번호 형식으로 표시하지만,
 * 실제 저장되는 값은 하이픈이 제거된 숫자만 저장됩니다.
 *
 * @example
 * ```tsx
 * // 기본 사용
 * <FormPhoneInput
 *   control={form.control}
 *   name="phoneNumber"
 *   label="휴대폰 번호"
 *   placeholder="010-1234-5678"
 * />
 *
 * // 선택 항목
 * <FormPhoneInput
 *   control={form.control}
 *   name="contactNumber"
 *   label="연락처"
 *   optional
 * />
 * ```
 *
 * @remarks
 * - 화면 표시: 010-1234-5678 (자동 포맷팅)
 * - 저장 값: 01012345678 (하이픈 제거)
 * - 한국 전화번호 전용 (11자리 휴대폰 번호 기준)
 */
export const FormPhoneInput = <
  V extends FieldValues = FieldValues,
  N extends FieldPath<V> = FieldPath<V>
>({
  control,
  name,
  label,
  description,
  orientation,
  optional,
  placeholder = '010-1234-5678',
}: FormPhoneInputProps<V, N>): ReactElement => {
  return (
    <FormField
      control={control}
      name={name}
      label={label}
      description={description}
      orientation={orientation}
      optional={optional}
    >
      {({ onChange, fieldState, ...field }) => (
        <PatternFormat
          customInput={Input}
          value={field.value || ''}
          format="###-####-####"
          mask="_"
          allowEmptyFormatting={false}
          onValueChange={values => {
            // values.formattedValue: "010-1234-5678" (하이픈 포함, 표시용)
            // values.value: "01012345678" (하이픈 제거, DB 저장용)
            onChange(values.value || '');
          }}
          placeholder={placeholder}
          aria-invalid={fieldState.invalid}
        />
      )}
    </FormField>
  );
};
