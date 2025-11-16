'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FieldGroup } from '@/shared/ui/field';
import { FormInput } from '@/shared/ui/form-fields';
import { LoadingButton } from '@/shared/ui/loading-button';

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, { message: '비밀번호를 입력해주세요.' })
      .min(6, { message: '비밀번호는 최소 6자 이상이어야 합니다.' })
      .regex(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, {
        message: '비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다.',
      }),
    confirmPassword: z.string().min(1, { message: '비밀번호 확인을 입력해주세요.' }),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['confirmPassword'],
  });

export function ResetPasswordForm() {
  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(values: z.infer<typeof resetPasswordSchema>) {
    console.log('Reset password form submitted:', values);
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup className='gap-y-6'>
        <FieldGroup className='gap-y-4'>
          <FormInput
            name='password'
            label='새 비밀번호'
            control={form.control}
            type='password'
            placeholder='••••••••'
            autoComplete='new-password'
          />
          <FormInput
            name='confirmPassword'
            label='비밀번호 확인'
            control={form.control}
            type='password'
            placeholder='••••••••'
            autoComplete='new-password'
          />
        </FieldGroup>

        <LoadingButton
          type='submit'
          isLoading={form.formState.isSubmitting}
        >
          비밀번호 변경
        </LoadingButton>
      </FieldGroup>
    </form>
  );
}
