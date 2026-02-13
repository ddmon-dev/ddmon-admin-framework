'use client';

import { ReactElement } from 'react';
import { type FieldPath, type FieldValues } from 'react-hook-form';
import { NativeSelect, NativeSelectOption } from '@/shared/ui/native-select';
import { FormField } from './form-field';
import type { FormBaseProps, ExcludedFormProps } from './types';

type NativeSelectProps = React.ComponentProps<'select'>;
type ExcludedNativeSelectProps = ExcludedFormProps | 'size';

export type FormNativeSelectProps<
  V extends FieldValues = FieldValues,
  N extends FieldPath<V> = FieldPath<V>,
> = FormBaseProps<V, N> &
  Omit<NativeSelectProps, ExcludedNativeSelectProps> & {
    options: {
      label: string;
      value: string;
    }[];
    placeholder?: string;
    size?: 'sm' | 'default';
  };

export const FormNativeSelect = <
  V extends FieldValues = FieldValues,
  N extends FieldPath<V> = FieldPath<V>,
>({
  control,
  name,
  label,
  description,
  orientation,
  optional,
  options,
  placeholder,
  size,
  ...selectProps
}: FormNativeSelectProps<V, N>): ReactElement => {
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
        <NativeSelect
          {...field}
          value={field.value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={fieldState.invalid}
          size={size}
          {...selectProps}
        >
          {placeholder && (
            <NativeSelectOption value="" disabled>
              {placeholder}
            </NativeSelectOption>
          )}
          {options.map((option) => (
            <NativeSelectOption key={option.value} value={option.value}>
              {option.label}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      )}
    </FormField>
  );
};
