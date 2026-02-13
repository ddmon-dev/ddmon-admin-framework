'use client';

import { ReactNode, ReactElement } from 'react';
import {
  Controller,
  type FieldPath,
  type FieldValues,
  type ControllerRenderProps,
  type ControllerFieldState,
} from 'react-hook-form';
import { Field, FieldContent, FieldLabel, FieldDescription, FieldError } from '../field';
import type { FormBaseProps } from './types';

export type FormFieldProps<
  V extends FieldValues = FieldValues,
  N extends FieldPath<V> = FieldPath<V>,
> = FormBaseProps<V, N> & {
  children: (
    field: ControllerRenderProps<V, N> & {
      id: string;
      fieldState: ControllerFieldState;
    }
  ) => ReactNode;
};

/**
 * Render Props 패턴
 *
 * @example
 * ```tsx
 * <FormField
 *   control={form.control}
 *   name="custom"
 *   label="커스텀 필드"
 *   description="커스텀 컴포넌트 사용 예시"
 * >
 *   {field => (
 *     <CustomComponent
 *       {...field}
 *       specialProp="value"
 *     />
 *   )}
 * </FormField>
 * ```
 */
export const FormField = <
  V extends FieldValues = FieldValues,
  N extends FieldPath<V> = FieldPath<V>,
>({
  control,
  name,
  label,
  description,
  orientation = 'vertical',
  children,
  optional = false,
}: FormFieldProps<V, N>): ReactElement => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} orientation={orientation}>
          {(label || description) && (
            <FieldContent>
              {label && (
                <FieldLabel htmlFor={field.name} className={optional ? 'w-full' : ''}>
                  {label}{' '}
                  {optional && (
                    <span className="ml-auto text-muted-foreground text-xs">(선택)</span>
                  )}
                </FieldLabel>
              )}
              {description && <FieldDescription>{description}</FieldDescription>}
            </FieldContent>
          )}
          {children({
            ...field,
            id: field.name,
            fieldState,
          })}
          {fieldState.error && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};
