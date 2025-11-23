'use client';

import { ReactElement, useState } from 'react';
import { type FieldPath, type FieldValues } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupButton,
} from '@/shared/ui/input-group';
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
 * InputGroup 기반 구현:
 * - type="password" + 표시/숨김 토글 버튼
 * - InputGroup으로 깔끔한 통합 UI
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
      {({ fieldState, ...field }) =>
        showToggle ? (
          <InputGroup>
            <InputGroupInput
              {...field}
              {...inputProps}
              type={showPassword ? 'text' : 'password'}
              aria-invalid={fieldState.invalid}
            />
            <InputGroupAddon align='inline-end'>
              <InputGroupButton
                size='icon-xs'
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        ) : (
          <InputGroupInput
            {...field}
            {...inputProps}
            type='password'
            aria-invalid={fieldState.invalid}
          />
        )
      }
    </FormField>
  );
};
