'use client';

import { ReactElement } from 'react';
import { type FieldPath, type FieldValues } from 'react-hook-form';
import { Textarea } from '@/shared/ui/textarea';
import { FormField } from './form-field';
import type { FormBaseProps, ExcludedFormProps } from './types';

export type FormTextareaProps<
  V extends FieldValues = FieldValues,
  N extends FieldPath<V> = FieldPath<V>,
> = FormBaseProps<V, N> &
  Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, ExcludedFormProps>;

export const FormTextarea = <
  V extends FieldValues = FieldValues,
  N extends FieldPath<V> = FieldPath<V>,
>({
  control,
  name,
  label,
  description,
  orientation,
  optional,
  ...textareaProps
}: FormTextareaProps<V, N>): ReactElement => {
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
        <Textarea {...field} {...textareaProps} aria-invalid={fieldState.invalid} />
      )}
    </FormField>
  );
};
