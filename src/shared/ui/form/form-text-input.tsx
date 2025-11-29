'use client';

import { ReactElement, useState, useEffect } from 'react';
import {
  type FieldPath,
  type FieldValues,
  type ControllerRenderProps,
  type ControllerFieldState,
} from 'react-hook-form';
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

type TextInputFieldProps = {
  field: Omit<ControllerRenderProps, 'onChange'>;
  fieldState: ControllerFieldState;
  onChange: (value: string) => void;
  customFilter?: (value: string) => string;
  valueTransform?: (displayValue: string) => string;
  inputProps: React.InputHTMLAttributes<HTMLInputElement>;
};

/**
 * Hook을 사용하는 내부 컴포넌트
 * render prop 내부에서 Hook을 사용하면 안 되므로 별도 컴포넌트로 분리
 */
const TextInputField = ({
  field,
  fieldState,
  onChange,
  customFilter,
  valueTransform,
  inputProps,
}: TextInputFieldProps): ReactElement => {
  const [displayValue, setDisplayValue] = useState(field.value || '');

  // field.value 변경 시 (외부에서 값 설정 시) displayValue 업데이트
  useEffect(() => {
    const rawValue = field.value || '';
    setDisplayValue(customFilter ? customFilter(rawValue) : rawValue);
  }, [field.value, customFilter]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // 화면 표시값 생성 (customFilter 적용)
    const newDisplayValue = customFilter ? customFilter(inputValue) : inputValue;
    setDisplayValue(newDisplayValue);

    // 폼 저장값 생성 (valueTransform 적용)
    const transformedValue = valueTransform ? valueTransform(newDisplayValue) : newDisplayValue;

    // react-hook-form에 저장값 전달
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
      {({ onChange, fieldState, ...field }) => (
        <TextInputField
          field={field}
          fieldState={fieldState}
          onChange={onChange}
          customFilter={customFilter}
          valueTransform={valueTransform}
          inputProps={inputProps}
        />
      )}
    </FormField>
  );
};
