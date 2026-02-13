'use client';

import { ReactElement } from 'react';
import { Controller, type FieldPath, type FieldValues } from 'react-hook-form';
import { Checkbox } from '@/shared/ui/checkbox';
import { Field, FieldLabel, FieldError } from '../field';
import type { FormBaseProps } from './types';

type CheckboxProps = React.ComponentProps<typeof Checkbox>;
type ExcludedCheckboxProps =
  | 'checked'
  | 'onCheckedChange'
  | 'defaultChecked'
  | 'id'
  | 'name'
  | 'ref'
  | 'value'
  | 'aria-invalid';

export type FormCheckboxProps<
  V extends FieldValues = FieldValues,
  N extends FieldPath<V> = FieldPath<V>,
> = Omit<FormBaseProps<V, N>, 'description' | 'orientation' | 'optional'> &
  Omit<CheckboxProps, ExcludedCheckboxProps>;

export const FormCheckbox = <
  V extends FieldValues = FieldValues,
  N extends FieldPath<V> = FieldPath<V>,
>({
  control,
  name,
  label,
  ...checkboxProps
}: FormCheckboxProps<V, N>): ReactElement => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <Field orientation="horizontal" data-invalid={fieldState.invalid} className="gap-0">
            <Checkbox
              ref={field.ref}
              id={field.name}
              checked={field.value}
              onCheckedChange={field.onChange}
              aria-invalid={fieldState.invalid}
              {...checkboxProps}
            />
            <FieldLabel htmlFor={field.name} className="pl-2 cursor-pointer pt-[0.08rem]">
              {label}
            </FieldLabel>
          </Field>
          {fieldState.error && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};
