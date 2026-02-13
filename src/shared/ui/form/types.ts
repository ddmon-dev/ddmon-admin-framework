import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import type { ReactNode } from 'react';

/**
 * react-hook-form의 field가 관리하는 props들을 명시적으로 제외
 * FormField 컴포넌트가 내부에서 관리하는 props들을 제외
 */
export type ExcludedFormProps =
  | 'name'
  | 'value'
  | 'onChange'
  | 'onBlur'
  | 'ref'
  | 'id'
  | 'defaultValue';

/**
 * 모든 Form 컴포넌트의 공통 props
 */
export type FormBaseProps<
  V extends FieldValues = FieldValues,
  N extends FieldPath<V> = FieldPath<V>,
> = {
  control: Control<V>;
  name: N;
  label?: ReactNode;
  description?: ReactNode;
  orientation?: 'vertical' | 'horizontal' | 'responsive';
  optional?: boolean;
};
