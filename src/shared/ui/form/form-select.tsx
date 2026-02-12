'use client';

import { ReactElement } from 'react';
import { type FieldPath, type FieldValues } from 'react-hook-form';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { FormField } from './form-field';
import type { FormBaseProps } from './types';

type SelectRootProps = React.ComponentProps<typeof SelectPrimitive.Root>;
type ExcludedSelectProps = 'value' | 'onValueChange' | 'defaultValue' | 'name';

export type FormSelectProps<
  V extends FieldValues = FieldValues,
  N extends FieldPath<V> = FieldPath<V>
> = FormBaseProps<V, N> &
  Omit<SelectRootProps, ExcludedSelectProps | keyof FormBaseProps<V, N>> & {
    options: {
      label: string;
      value: string;
    }[];
    placeholder?: string;
  };

export const FormSelect = <
  V extends FieldValues = FieldValues,
  N extends FieldPath<V> = FieldPath<V>
>({
  control,
  name,
  label,
  description,
  orientation,
  optional,
  options,
  placeholder = 'Select',
  ...selectProps
}: FormSelectProps<V, N>): ReactElement => {
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
        <Select
          name={field.name}
          value={field.value}
          onValueChange={onChange}
          {...selectProps}
        >
          <SelectTrigger
            ref={field.ref}
            id={field.name}
            aria-invalid={fieldState.invalid}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map(option => (
              <SelectItem
                key={option.value}
                value={option.value}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </FormField>
  );
};
