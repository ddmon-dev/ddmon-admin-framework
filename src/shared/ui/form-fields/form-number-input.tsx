'use client';

import { ReactElement } from 'react';
import { type FieldPath, type FieldValues } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';
import { Input } from '@/shared/ui/input';
import { FormField } from './form-field';
import type { FormBaseProps } from './types';

export type FormNumberInputProps<
  V extends FieldValues = FieldValues,
  N extends FieldPath<V> = FieldPath<V>
> = FormBaseProps<V, N> & {
  /** 천 단위 구분자 (기본: false) */
  thousandSeparator?: boolean | string;
  /** 접두사 (예: '₩', '$') */
  prefix?: string;
  /** 접미사 (예: '원', '개') */
  suffix?: string;
  /** 소수점 허용 여부 (기본: false) */
  allowDecimal?: boolean;
  /** 소수점 자릿수 (allowDecimal=true일 때만) */
  decimalScale?: number;
  /** 음수 허용 여부 (기본: false) */
  allowNegative?: boolean;
  /** placeholder */
  placeholder?: string;
};

/**
 * FormNumberInput - 숫자 입력 전용 컴포넌트 (react-number-format 기반)
 *
 * @example
 * ```tsx
 * // 기본 숫자 입력
 * <FormNumberInput
 *   control={form.control}
 *   name="age"
 *   label="나이"
 * />
 *
 * // 천 단위 구분자
 * <FormNumberInput
 *   control={form.control}
 *   name="viewCount"
 *   label="조회수"
 *   thousandSeparator
 * />
 *
 * // 통화
 * <FormNumberInput
 *   control={form.control}
 *   name="price"
 *   label="가격"
 *   prefix="₩"
 *   thousandSeparator
 * />
 *
 * // 소수점
 * <FormNumberInput
 *   control={form.control}
 *   name="rating"
 *   label="평점"
 *   allowDecimal
 *   decimalScale={1}
 * />
 * ```
 */
export const FormNumberInput = <
  V extends FieldValues = FieldValues,
  N extends FieldPath<V> = FieldPath<V>
>({
  control,
  name,
  label,
  description,
  orientation,
  optional,
  thousandSeparator = false,
  prefix,
  suffix,
  allowDecimal = false,
  decimalScale,
  allowNegative = false,
  placeholder,
}: FormNumberInputProps<V, N>): ReactElement => {
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
        <NumericFormat
          customInput={Input}
          getInputRef={field.ref}
          value={field.value}
          onValueChange={values => {
            onChange(values.floatValue ?? null);
          }}
          thousandSeparator={thousandSeparator}
          prefix={prefix}
          suffix={suffix}
          allowNegative={allowNegative}
          decimalScale={allowDecimal ? decimalScale : 0}
          fixedDecimalScale={allowDecimal && decimalScale !== undefined}
          placeholder={placeholder}
          aria-invalid={fieldState.invalid}
        />
      )}
    </FormField>
  );
};
