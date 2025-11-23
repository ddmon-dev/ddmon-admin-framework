'use client';

import { ReactElement } from 'react';
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
      {({ fieldState, ...field }) => (
        <Input
          {...field}
          aria-invalid={fieldState.invalid}
          customFilter={customFilter}
          {...inputProps}
        />
      )}
    </FormField>
  );
};
