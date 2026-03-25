'use client';

import { type FieldPath, type FieldValues } from 'react-hook-form';
import { APP_CONFIG } from '@/app.config';
import { FormSelect } from './form-select';
import type { FormBaseProps } from './types';

export type FormLangSelectProps<
  V extends FieldValues = FieldValues,
  N extends FieldPath<V> = FieldPath<V>
> = Omit<FormBaseProps<V, N>, 'name' | 'label'> & {
  name?: N;
  label?: string;
  disabled?: boolean;
};

const langOptions = APP_CONFIG.LANG.CODES.map((code) => ({
  value: code,
  label: APP_CONFIG.LANG.LABELS[code],
}));

export function FormLangSelect<
  V extends FieldValues = FieldValues,
  N extends FieldPath<V> = FieldPath<V>
>({
  name = 'lang' as N,
  label = '언어',
  ...props
}: FormLangSelectProps<V, N>) {
  return <FormSelect name={name} label={label} options={langOptions} {...props} />;
}
