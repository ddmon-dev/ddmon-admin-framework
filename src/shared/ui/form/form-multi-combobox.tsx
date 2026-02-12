'use client';

import { ReactElement } from 'react';
import { type FieldPath, type FieldValues } from 'react-hook-form';
import { MultiCombobox, type MultiComboboxProps } from '@/shared/ui/multi-combobox';
import { FormField } from './form-field';
import type { FormBaseProps } from './types';

type ExcludedMultiComboboxProps = 'value' | 'onValueChange' | 'aria-invalid' | 'ref';

export type FormMultiComboboxProps<
  V extends FieldValues = FieldValues,
  N extends FieldPath<V> = FieldPath<V>
> = FormBaseProps<V, N> & Omit<MultiComboboxProps, ExcludedMultiComboboxProps>;

export const FormMultiCombobox = <
  V extends FieldValues = FieldValues,
  N extends FieldPath<V> = FieldPath<V>
>({
  control,
  name,
  label,
  description,
  orientation,
  optional,
  ...multiComboboxProps
}: FormMultiComboboxProps<V, N>): ReactElement => {
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
        <MultiCombobox
          ref={field.ref}
          value={field.value}
          onValueChange={onChange}
          aria-invalid={fieldState.invalid}
          {...multiComboboxProps}
        />
      )}
    </FormField>
  );
};
