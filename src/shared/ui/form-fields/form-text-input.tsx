'use client';

import { ReactElement, useState, useEffect } from 'react';
import { type FieldPath, type FieldValues } from 'react-hook-form';
import { Input } from '@/shared/ui/input';
import { FormField } from './form-field';
import type { FormBaseProps, ExcludedFormProps } from './types';

export type FormTextInputProps<
  V extends FieldValues = FieldValues,
  N extends FieldPath<V> = FieldPath<V>
> = FormBaseProps<V, N> &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, ExcludedFormProps | 'type'> & {
    customFilter?: (value: string) => string;
    valueTransform?: (displayValue: string) => string;
  };

export const FormTextInput = <
  V extends FieldValues = FieldValues,
  N extends FieldPath<V> = FieldPath<V>
>({
  control,
  name,
  label,
  description,
  orientation,
  optional,
  customFilter,
  valueTransform,
  ...inputProps
}: FormTextInputProps<V, N>): ReactElement => {
  return (
    <FormField
      control={control}
      name={name}
      label={label}
      description={description}
      orientation={orientation}
      optional={optional}
    >
      {({ onChange, fieldState, ...field }) => {
        const [displayValue, setDisplayValue] = useState(field.value || '');

        // field.value 변경 시 (외부에서 값 설정 시) displayValue 업데이트
        useEffect(() => {
          const rawValue = field.value || '';
          setDisplayValue(customFilter ? customFilter(rawValue) : rawValue);
        }, [field.value, customFilter]);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const inputValue = e.target.value;

          // 1. 화면 표시값 생성 (customFilter 적용)
          const newDisplayValue = customFilter ? customFilter(inputValue) : inputValue;
          setDisplayValue(newDisplayValue);

          // 2. 폼 저장값 생성 (valueTransform 적용)
          const transformedValue = valueTransform
            ? valueTransform(newDisplayValue)
            : newDisplayValue;

          // 3. react-hook-form에 저장값 전달
          onChange(transformedValue);
        };

        return (
          <Input
            {...field}
            value={displayValue}
            onChange={handleChange}
            aria-invalid={fieldState.invalid}
            {...inputProps}
          />
        );
      }}
    </FormField>
  );
};
