'use client';

import { ReactElement, useState } from 'react';
import { type FieldPath, type FieldValues } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { FormField } from './form-field';
import type { FormBaseProps, ExcludedFormProps } from './types';

export type FormPasswordInputProps<
  V extends FieldValues = FieldValues,
  N extends FieldPath<V> = FieldPath<V>
> = FormBaseProps<V, N> &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, ExcludedFormProps | 'type'> & {
    /** 비밀번호 표시/숨김 토글 버튼 표시 여부 (기본: true) */
    showToggle?: boolean;
  };

/**
 * FormPasswordInput - 비밀번호 입력 컴포넌트
 *
 * type="password" + 표시/숨김 토글 버튼
 *
 * @example
 * ```tsx
 * <FormPasswordInput
 *   control={form.control}
 *   name="password"
 *   label="비밀번호"
 *   placeholder="비밀번호를 입력하세요"
 * />
 *
 * // 토글 버튼 없이
 * <FormPasswordInput
 *   control={form.control}
 *   name="password"
 *   label="비밀번호"
 *   showToggle={false}
 * />
 * ```
 */
export const FormPasswordInput = <
  V extends FieldValues = FieldValues,
  N extends FieldPath<V> = FieldPath<V>
>({
  control,
  name,
  label,
  description,
  orientation,
  optional,
  showToggle = true,
  ...inputProps
}: FormPasswordInputProps<V, N>): ReactElement => {
  const [showPassword, setShowPassword] = useState(false);

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
        <div className='relative'>
          <Input
            {...field}
            {...inputProps}
            type={showPassword ? 'text' : 'password'}
            aria-invalid={fieldState.invalid}
            className={showToggle ? 'pr-10' : undefined}
          />
          {showToggle && (
            <Button
              type='button'
              variant='ghost'
              size='icon-sm'
              onClick={() => setShowPassword(!showPassword)}
              className='absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7'
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className='h-4 w-4' />
              ) : (
                <Eye className='h-4 w-4' />
              )}
            </Button>
          )}
        </div>
      )}
    </FormField>
  );
};
