'use client';

import { ReactElement } from 'react';
import { type FieldPath, type FieldValues } from 'react-hook-form';
import { Combobox, type ComboboxProps } from '@/shared/ui/combobox';
import { FormField } from './form-field';
import type { FormBaseProps } from './types';

type ExcludedComboboxProps = 'value' | 'onValueChange' | 'aria-invalid' | 'ref';

export type FormComboboxProps<
  V extends FieldValues = FieldValues,
  N extends FieldPath<V> = FieldPath<V>,
> = FormBaseProps<V, N> & Omit<ComboboxProps, ExcludedComboboxProps>;

export const FormCombobox = <
  V extends FieldValues = FieldValues,
  N extends FieldPath<V> = FieldPath<V>,
>({
  control,
  name,
  label,
  description,
  orientation,
  optional,
  ...comboboxProps
}: FormComboboxProps<V, N>): ReactElement => {
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
        <Combobox
          ref={field.ref}
          value={field.value}
          onValueChange={onChange}
          aria-invalid={fieldState.invalid}
          {...comboboxProps}
        />
      )}
    </FormField>
  );
};
