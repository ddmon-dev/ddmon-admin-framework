'use client';

import { ReactElement } from 'react';
import { Controller, type FieldPath, type FieldValues } from 'react-hook-form';
import { Checkbox } from '@/shared/ui/checkbox';
import { Field, FieldLabel, FieldError } from '../field';
import type { FormBaseProps } from './types';

export type FormCheckboxProps<
  V extends FieldValues = FieldValues,
  N extends FieldPath<V> = FieldPath<V>
> = Omit<FormBaseProps<V, N>, 'description' | 'orientation'> & {
  /** 비활성화 */
  disabled?: boolean;
};

export const FormCheckbox = <
  V extends FieldValues = FieldValues,
  N extends FieldPath<V> = FieldPath<V>
>({
  control,
  name,
  label,
  disabled = false,
}: FormCheckboxProps<V, N>): ReactElement => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <Field
            orientation='horizontal'
            data-invalid={fieldState.invalid}
            className='gap-0'
          >
            <Checkbox
              ref={field.ref}
              id={field.name}
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={disabled}
              aria-invalid={fieldState.invalid}
            />
            <FieldLabel
              htmlFor={field.name}
              className='pl-2 cursor-pointer pt-[0.08rem]'
            >
              {label}
            </FieldLabel>
          </Field>
          {fieldState.error && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};
