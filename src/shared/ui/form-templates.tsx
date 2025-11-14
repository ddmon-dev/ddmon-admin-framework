'use client';

import { ReactNode } from 'react';
import {
  Controller,
  type ControllerProps,
  type FieldValues,
  type FieldPath,
} from 'react-hook-form';
import { Field, FieldContent, FieldLabel, FieldError } from './field';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';

type FormControlProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues
> = {
  name: TName;
  label: ReactNode;
  control: ControllerProps<TFieldValues, TName, TTransformedValues>['control'];
};

type FormBaseProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues
> = FormControlProps<TFieldValues, TName, TTransformedValues> & {
  children: (
    field: Parameters<
      ControllerProps<TFieldValues, TName, TTransformedValues>['render']
    >[0]['field'] & {
      'aria-invalid': boolean;
      id: string;
    }
  ) => ReactNode;
};

type FormControlFunc = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues
>(
  props: FormControlProps<TFieldValues, TName, TTransformedValues>
) => ReactNode;

function FormBase<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues
>({ control, name, label, children }: FormBaseProps<TFieldValues, TName, TTransformedValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldContent>
            <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
          </FieldContent>
          {children({ ...field, id: field.name, 'aria-invalid': fieldState.invalid })}
          {fieldState.error && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}

export const FormInput: FormControlFunc = props => {
  return <FormBase {...props}>{field => <Input {...field} />}</FormBase>;
};

export const FormTextarea: FormControlFunc = props => {
  return <FormBase {...props}>{field => <Textarea {...field} />}</FormBase>;
};
